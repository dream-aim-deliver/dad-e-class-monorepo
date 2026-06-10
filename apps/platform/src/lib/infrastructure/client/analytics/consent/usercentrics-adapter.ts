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
    /**
     * CMP v3 versions up to ~3.120 return the array synchronously; newer
     * versions (observed live on v3.121.2) return a Promise. The adapter
     * must support both — see emitConsentState below.
     */
    getServicesBaseInfo?: () =>
        | TUserCentricsService[]
        | Promise<TUserCentricsService[]>;
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
function mapServicesToConsentState(
    services: TUserCentricsService[],
): TConsentState {
    const has = (categories: string[]): boolean =>
        services.some(
            (s) =>
                !!s.consent?.status &&
                typeof s.categorySlug === 'string' &&
                categories.includes(s.categorySlug.toLowerCase()),
        );

    // Tenant dashboards (e.g. eclass.justdoad.ch) may have no
    // statistics/analytics category at all and file Google Analytics under
    // "marketing". The user's per-service consent to GA itself IS analytics
    // consent, regardless of which category the dashboard admin chose.
    const hasGoogleAnalyticsConsent = services.some(
        (s) =>
            !!s.consent?.status &&
            typeof s.name === 'string' &&
            s.name.toLowerCase().startsWith('google analytics'),
    );

    return {
        analytics:
            has(['statistics', 'analytics']) || hasGoogleAnalyticsConsent,
        marketing: has(['marketing']),
        preferences: has(['functional', 'preferences']),
    };
}

function isThenable(value: unknown): value is Promise<TUserCentricsService[]> {
    return !!value && typeof (value as { then?: unknown }).then === 'function';
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
            let active = true;
            // Monotonic ticket per read: a slow Promise from an earlier read
            // must never overwrite the state from a later read. Without this,
            // a stale all-denied snapshot can land AFTER the user's grant and
            // silently revoke it (the gcs=G100 production incident).
            let seq = 0;

            const emitConsentState = (isInitialEmit: boolean) => {
                const ticket = ++seq;
                const ui =
                    typeof window !== 'undefined' ? window.UC_UI : undefined;
                const emitDeniedFallback = () => {
                    // Only the subscribe-time emit reports denied when the
                    // real state is unknown — consumers need a synchronous
                    // first-paint value. Event-driven emits stay quiet
                    // instead: pushing denied on a read failure would revoke
                    // a consent the user already gave.
                    if (isInitialEmit) handler({ ...DENIED_CONSENT });
                };

                if (!ui?.isInitialized?.()) {
                    emitDeniedFallback();
                    return;
                }

                let services: unknown;
                try {
                    services = ui.getServicesBaseInfo?.();
                } catch {
                    emitDeniedFallback();
                    return;
                }

                // CMP ≤ ~3.120: synchronous array.
                if (Array.isArray(services)) {
                    if (services.length === 0) {
                        emitDeniedFallback();
                        return;
                    }
                    handler(mapServicesToConsentState(services));
                    return;
                }

                // CMP ≥ 3.121: Promise<service[]>. Resolve it and emit the
                // REAL state; drop the result if a newer read started or the
                // consumer unsubscribed in the meantime.
                if (isThenable(services)) {
                    emitDeniedFallback();
                    services
                        .then((resolved) => {
                            if (!active || ticket !== seq) return;
                            if (Array.isArray(resolved) && resolved.length > 0) {
                                handler(mapServicesToConsentState(resolved));
                            }
                        })
                        .catch(() => {
                            // Keep the last emitted state on CMP errors.
                        });
                    return;
                }

                emitDeniedFallback();
            };

            // Fire synchronously with current (or denied) state so consumers
            // don't need to special-case first paint.
            emitConsentState(true);

            const listener = () => emitConsentState(false);
            if (typeof window !== 'undefined') {
                // UC_UI_INITIALIZED fires once the CMP has loaded and parsed
                // its settings; UC_UI_CMP_EVENT fires on every user interaction
                // (ACCEPT_ALL / DENY_ALL / SAVE).
                window.addEventListener('UC_UI_INITIALIZED', listener);
                window.addEventListener('UC_UI_CMP_EVENT', listener);
            }

            return () => {
                active = false;
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
