import { DENIED_CONSENT, type TConsentState } from '../types';
import type { TConsentAdapter } from './consent-adapter';

/**
 * Minimal shape of window.UC_UI we rely on.
 *
 * Usercentrics CMP v3 exposes a larger API — we only use what the adapter
 * needs. Casting to `unknown` is required because Usercentrics does not ship
 * a public type for `UC_UI` in a framework-neutral package.
 */
interface TUserCentricsService {
    id?: string;
    name?: string;
    categorySlug?: string;
    consent?: { status?: boolean; type?: string };
}

interface TUserCentricsUI {
    isInitialized?: () => boolean;
    showFirstLayer?: () => void;
    showSecondLayer?: () => void;
    getServicesBaseInfo?: () => TUserCentricsService[];
    /** Hides the persistent floating "privacy button" (fingerprint icon). */
    hidePrivacyButton?: () => void;
}

declare global {
    interface Window {
        UC_UI?: TUserCentricsUI;
    }
}

/** CMP events that reflect a final user decision (not banner-shown / implicit). */
const RESOLVED_CMP_EVENT_TYPES = new Set([
    'ACCEPT_ALL',
    'DENY_ALL',
    'SAVE_CC',
]);

/**
 * Usercentrics may report consent.status=true with type IMPLICIT on
 * onInitialPageLoad before the user interacts. Only EXPLICIT consent may
 * unlock in-app gated features (OTel, track.*). Google Consent Mode is
 * owned by GTM — this gate does not call gtag.
 */
function isExplicitlyGranted(service: TUserCentricsService): boolean {
    if (!service.consent?.status) return false;
    const type = service.consent.type?.toUpperCase();
    return type === 'EXPLICIT';
}

/**
 * Translate the Usercentrics per-service consent payload into our normalized
 * {analytics, marketing, preferences} shape.
 *
 * Usercentrics doesn't have a first-class "category" concept in the JS API,
 * so we aggregate by the `categorySlug` field that admins set on each
 * service in the Usercentrics dashboard. Canonical category slugs:
 *   - statistics / analytics  → our `analytics`
 *   - marketing               → our `marketing`
 *   - functional / preferences → our `preferences`
 *   - essential               → always granted, not surfaced in TConsentState
 *
 * We're deliberately tolerant here: a tenant's admin may use non-standard
 * slugs. Unknown slugs map to nothing (false for all three), which means
 * services under those slugs won't unlock any tracking in our app — safe
 * default.
 */
function readUsercentricsState(): TConsentState {
    const ui = typeof window !== 'undefined' ? window.UC_UI : undefined;
    // Wait for the CMP to be fully initialized — otherwise getServicesBaseInfo
    // may return a Promise, undefined, or a partially-constructed object
    // depending on SDK version, none of which are safe to iterate.
    if (!ui?.isInitialized?.()) return { ...DENIED_CONSENT };

    const services = ui.getServicesBaseInfo?.();
    if (!Array.isArray(services) || services.length === 0) {
        return { ...DENIED_CONSENT };
    }

    const has = (categories: string[]): boolean =>
        services.some(
            (s) =>
                isExplicitlyGranted(s) &&
                typeof s.categorySlug === 'string' &&
                categories.includes(s.categorySlug.toLowerCase()),
        );

    return {
        analytics: has(['statistics', 'analytics']),
        marketing: has(['marketing']),
        preferences: has(['functional', 'preferences']),
    };
}

function isResolvedConsentCmpEvent(event: Event): boolean {
    const type = (event as CustomEvent<{ type?: string }>).detail?.type;
    return typeof type === 'string' && RESOLVED_CMP_EVENT_TYPES.has(type);
}

/**
 * Usercentrics CMP v3 adapter.
 *
 * Script mounting is handled server-side by `<UsercentricsCMPLoader>` and
 * `<UsercentricsAutoblocker>` rendered into `<head>`; this adapter only wires
 * runtime listeners and translates consent state for in-app gating. Keeping
 * injection out of client effects eliminates the hydration race (effect-never-
 * runs cases like bfcache restore, upstream error boundary, cancelled hydration)
 * that previously caused the banner to flakily not appear.
 *
 * Does NOT call gtag — Google Consent Mode is owned by the Usercentrics GTM
 * tag. See `docs/consent-mode-ownership.md`.
 */
export function createUsercentricsAdapter(): TConsentAdapter {
    return {
        init() {
            // Hide the persistent floating privacy button ("fingerprint" icon)
            // at runtime. Cookie-settings access is provided via the footer's
            // "Privacy Settings" link (<UsercentricsSecondLayerLink>), so the
            // corner icon is redundant and the design intent is to route users
            // through the footer link instead.
            //
            // Fire on the CMP's initial load AND on every subsequent consent
            // event: some Usercentrics versions re-mount the button when the
            // banner closes or when consent changes, so a single hide-once is
            // not robust enough. Both calls are no-ops if the dashboard has
            // already disabled the button or if the API is unavailable.
            if (typeof window !== 'undefined') {
                const hidePrivacyButton = () =>
                    window.UC_UI?.hidePrivacyButton?.();
                window.addEventListener(
                    'UC_UI_INITIALIZED',
                    hidePrivacyButton,
                    { once: true },
                );
                window.addEventListener(
                    'UC_UI_CMP_EVENT',
                    hidePrivacyButton,
                );
            }
        },

        onConsentChange(handler) {
            // Fire synchronously with current (or denied) state so consumers
            // don't need to special-case first paint.
            handler(readUsercentricsState());

            const onInitialized = () => handler(readUsercentricsState());
            // Returning visitors: stored EXPLICIT consent is readable after init.
            const onCmpEvent = (event: Event) => {
                if (!isResolvedConsentCmpEvent(event)) return;
                handler(readUsercentricsState());
            };

            if (typeof window !== 'undefined') {
                window.addEventListener('UC_UI_INITIALIZED', onInitialized);
                window.addEventListener('UC_UI_CMP_EVENT', onCmpEvent);
            }

            return () => {
                if (typeof window === 'undefined') return;
                window.removeEventListener('UC_UI_INITIALIZED', onInitialized);
                window.removeEventListener('UC_UI_CMP_EVENT', onCmpEvent);
            };
        },

        showBanner() {
            if (typeof window === 'undefined') return;
            window.UC_UI?.showFirstLayer?.();
        },
    };
}
