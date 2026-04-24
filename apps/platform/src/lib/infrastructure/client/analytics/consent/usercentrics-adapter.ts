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
    consent?: { status?: boolean };
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
                !!s.consent?.status &&
                typeof s.categorySlug === 'string' &&
                categories.includes(s.categorySlug.toLowerCase()),
        );

    return {
        analytics: has(['statistics', 'analytics']),
        marketing: has(['marketing']),
        preferences: has(['functional', 'preferences']),
    };
}

/**
 * Usercentrics CMP v3 adapter.
 *
 * Script mounting is handled server-side by `<UsercentricsCMPLoader>` and
 * `<UsercentricsAutoblocker>` rendered into `<head>`; this adapter only wires
 * runtime listeners and translates consent state. Keeping injection out of
 * client effects eliminates the hydration race (effect-never-runs cases like
 * bfcache restore, upstream error boundary, cancelled hydration) that
 * previously caused the banner to flakily not appear.
 *
 * Consent state is read from `window.UC_UI.getServicesBaseInfo()` on every
 * CMP event; the banner is opened via `window.UC_UI.showFirstLayer()`.
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

            const listener = () => handler(readUsercentricsState());
            if (typeof window !== 'undefined') {
                // UC_UI_INITIALIZED fires once the CMP has loaded and parsed
                // its settings; UC_UI_CMP_EVENT fires on every user interaction
                // (ACCEPT_ALL / DENY_ALL / SAVE).
                window.addEventListener('UC_UI_INITIALIZED', listener);
                window.addEventListener('UC_UI_CMP_EVENT', listener);
            }

            return () => {
                if (typeof window === 'undefined') return;
                window.removeEventListener('UC_UI_INITIALIZED', listener);
                window.removeEventListener('UC_UI_CMP_EVENT', listener);
            };
        },

        showBanner() {
            if (typeof window === 'undefined') return;
            window.UC_UI?.showFirstLayer?.();
        },
    };
}
