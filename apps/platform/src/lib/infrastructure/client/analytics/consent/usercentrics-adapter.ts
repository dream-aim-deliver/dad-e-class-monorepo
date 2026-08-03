import { DENIED_CONSENT, type TConsentState } from '../types';
import type { TConsentAdapter } from './consent-adapter';

/**
 * Usercentrics records HOW a service's consent was set, not just whether it is
 * currently granted:
 *   - 'EXPLICIT' — the user actively made this choice (Accept / Deny / Save).
 *   - 'IMPLICIT' — a default/pre-interaction state (e.g. "consent by default"
 *     in opt-out regions, or the baseline the CMP reports on first load before
 *     the banner is touched).
 * See Usercentrics' CONSENT_TYPE enum. `status` alone is NOT sufficient: on a
 * first visit the CMP can report `status: true, type: 'IMPLICIT'`, and acting
 * on that would grant tracking before the user consented.
 */
type TConsentType = 'EXPLICIT' | 'IMPLICIT';

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
    consent?: { status?: boolean; type?: TConsentType };
}

interface TUserCentricsUI {
    isInitialized?: () => boolean;
    showFirstLayer?: () => void;
    showSecondLayer?: () => void;
    /**
     * CMP v3 versions up to ~3.120 return the array synchronously; newer
     * versions (observed live on v3.121.2) return a Promise. The adapter
     * must support both — see readServices below.
     *
     * NOTE: verified live (2026-08) that this payload is `{status, history}`
     * only — it carries NO `consent.type`, so it cannot distinguish an
     * explicit user decision from an implicit default. `__ucCmp` below is the
     * preferred source for exactly that reason.
     */
    getServicesBaseInfo?: () =>
        | TUserCentricsService[]
        | Promise<TUserCentricsService[]>;
    /** Hides the persistent floating "privacy button" (fingerprint icon). */
    hidePrivacyButton?: () => void;
}

/**
 * Newer hosted CMP builds expose `window.__ucCmp`, whose `getConsentDetails()`
 * DOES report per-service `{given, type}` — the only place the
 * EXPLICIT/IMPLICIT distinction is actually available to us.
 *
 * Note the shape differs from getServicesBaseInfo(): services come back as a
 * keyed object (not an array), the category field is `category` (not
 * `categorySlug`), and consent is `given` (not `status`).
 */
interface TUcCmpService {
    name?: string;
    category?: string;
    essential?: boolean;
    consent?: { given?: boolean; type?: TConsentType };
}

interface TUcCmpConsentDetails {
    consent?: { status?: string; required?: boolean };
    services?: Record<string, TUcCmpService>;
}

interface TUcCmp {
    getConsentDetails?: () => Promise<TUcCmpConsentDetails>;
}

declare global {
    interface Window {
        UC_UI?: TUserCentricsUI;
        __ucCmp?: TUcCmp;
    }
}

/**
 * Source-agnostic view of one CMP service, with `granted` already resolved
 * according to what the source can actually tell us about explicitness.
 */
interface TNormalizedService {
    name?: string;
    category?: string;
    granted: boolean;
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
    services: TNormalizedService[],
): TConsentState {
    const isGoogleAnalytics = (s: TNormalizedService): boolean =>
        typeof s.name === 'string' &&
        s.name.toLowerCase().startsWith('google analytics');

    // Google Analytics is deliberately excluded from category aggregation and
    // handled only by hasGoogleAnalyticsConsent below.
    //
    // Measured on production: a user who opened the CMP's granular settings and
    // accepted ONLY Google Analytics had ad_storage, ad_user_data and
    // ad_personalization granted (gcs=G111). GA is filed under "marketing" in
    // this tenant's dashboard, so it alone flipped the marketing category and,
    // through it, every advertising signal — for a user who consented to an
    // analytics service and nothing else. The Usercentrics GTM template got the
    // same case right (it pushed all ad signals denied); only our mapping
    // disagreed, which is what identified this as ours.
    //
    // GA is an analytics service whichever category the dashboard files it
    // under, so its consent must not imply advertising consent.
    const has = (categories: string[]): boolean =>
        services.some(
            (s) =>
                s.granted &&
                !isGoogleAnalytics(s) &&
                typeof s.category === 'string' &&
                categories.includes(s.category.toLowerCase()),
        );

    // Tenant dashboards (e.g. eclass.justdoad.ch) may have no
    // statistics/analytics category at all and file Google Analytics under
    // "marketing". The user's per-service consent to GA itself IS analytics
    // consent, regardless of which category the dashboard admin chose.
    //
    // This matches on a dashboard-editable label, so it is brittle by nature:
    // renaming the service in Usercentrics silently reopens the gcs=G110 bug
    // with no compile-time or unit-test signal. A per-tenant service id is not
    // a safe substitute (ids differ per account, and env-specific values must
    // not be hardcoded here). The tripwire is the live audit —
    // apps/platform-e2e/src/consent-audit.spec.ts — which would catch the
    // regression against production; run it after any CMP dashboard change.
    const hasGoogleAnalyticsConsent = services.some(
        (s) => s.granted && isGoogleAnalytics(s),
    );

    // Per-service consent, so callers can gate ONE integration precisely
    // instead of relying on a category proxy. See hasServiceConsent().
    const perService: Record<string, boolean> = {};
    for (const service of services) {
        if (typeof service.name !== 'string') continue;
        const key = service.name.toLowerCase();
        // A name could appear twice; consent to either counts.
        perService[key] = perService[key] || service.granted;
    }

    return {
        analytics:
            has(['statistics', 'analytics']) || hasGoogleAnalyticsConsent,
        marketing: has(['marketing']),
        preferences: has(['functional', 'preferences']),
        services: perService,
    };
}

/**
 * PREFERRED source. `__ucCmp.getConsentDetails()` reports `consent.type`, so we
 * can require an EXPLICIT (user-made) decision and ignore IMPLICIT
 * pre-interaction defaults.
 *
 * This is the defence-in-depth guard: if the CMP dashboard is ever
 * misconfigured to pre-grant services (services reporting `given: true` with
 * `type: 'IMPLICIT'` before the banner is touched), the app refuses to turn
 * that into a gtag consent grant or to start first-party telemetry.
 */
function normalizeFromCmpDetails(
    details: TUcCmpConsentDetails,
): TNormalizedService[] {
    return Object.values(details.services ?? {}).map((service) => ({
        name: service.name,
        category: service.category,
        granted:
            !!service.consent?.given && service.consent?.type === 'EXPLICIT',
    }));
}

/**
 * FALLBACK source, used only when `__ucCmp` is unavailable.
 *
 * Verified live: this payload has no `consent.type`, so explicitness cannot be
 * determined here. We deliberately fail OPEN and trust `status` — matching the
 * long-standing behaviour — rather than fail closed.
 *
 * Rationale: the CMP configuration is the primary control for what may be
 * granted; this adapter is a second layer. Failing closed on a source that
 * simply cannot answer the question would permanently deny consent even for
 * users who explicitly accepted, silently killing analytics (the gcs=G100
 * incident). A missing `__ucCmp` is reported via warnMissingCmpApi() so the
 * degraded path is observable rather than silent.
 */
function normalizeFromBaseInfo(
    services: TUserCentricsService[],
): TNormalizedService[] {
    return services.map((service) => ({
        name: service.name,
        category: service.categorySlug,
        granted: !!service.consent?.status,
    }));
}

function isThenable<T>(value: unknown): value is Promise<T> {
    return !!value && typeof (value as { then?: unknown }).then === 'function';
}

/**
 * Warn once per adapter instance: the explicit-consent guard is unavailable on
 * this CMP build. Instance-scoped rather than module-scoped so the degraded
 * path stays observable per adapter (and deterministically testable).
 */
function createMissingCmpApiWarner(): () => void {
    let warned = false;
    return () => {
        if (warned) return;
        warned = true;
        console.warn(
            '[consent] window.__ucCmp.getConsentDetails() unavailable — cannot ' +
                'distinguish EXPLICIT from IMPLICIT consent. Falling back to ' +
                'getServicesBaseInfo(); premature-grant protection is degraded ' +
                'and the CMP configuration is the only safeguard.',
        );
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
    const warnMissingCmpApi = createMissingCmpApiWarner();

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

                /** Emit only if this read is still the newest and live. */
                const emitIfCurrent = (services: TNormalizedService[]) => {
                    if (!active || ticket !== seq) return;
                    if (services.length === 0) return;
                    handler(mapServicesToConsentState(services));
                };

                // PREFERRED: __ucCmp.getConsentDetails() — the only source that
                // reports consent.type, so it can reject IMPLICIT pre-grants.
                const cmp =
                    typeof window !== 'undefined' ? window.__ucCmp : undefined;
                if (typeof cmp?.getConsentDetails === 'function') {
                    let details: unknown;
                    try {
                        details = cmp.getConsentDetails();
                    } catch {
                        emitDeniedFallback();
                        return;
                    }
                    if (isThenable<TUcCmpConsentDetails>(details)) {
                        emitDeniedFallback();
                        details
                            .then((resolved) => {
                                emitIfCurrent(normalizeFromCmpDetails(resolved));
                            })
                            .catch(() => {
                                // Keep the last emitted state on CMP errors.
                            });
                        return;
                    }
                    // Unexpected sync return — normalize what we got.
                    emitIfCurrent(
                        normalizeFromCmpDetails(
                            (details ?? {}) as TUcCmpConsentDetails,
                        ),
                    );
                    return;
                }

                // FALLBACK: getServicesBaseInfo(). Cannot see consent.type, so
                // premature-grant protection is degraded here — see
                // normalizeFromBaseInfo().
                warnMissingCmpApi();

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
                    handler(
                        mapServicesToConsentState(
                            normalizeFromBaseInfo(services),
                        ),
                    );
                    return;
                }

                // CMP ≥ 3.121: Promise<service[]>. Resolve it and emit the
                // REAL state; drop the result if a newer read started or the
                // consumer unsubscribed in the meantime.
                if (isThenable<TUserCentricsService[]>(services)) {
                    emitDeniedFallback();
                    services
                        .then((resolved) => {
                            if (!Array.isArray(resolved)) return;
                            emitIfCurrent(normalizeFromBaseInfo(resolved));
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
