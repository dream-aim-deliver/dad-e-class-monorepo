import type { TConsentState } from './types';

declare global {
    interface Window {
        // Defined by GtagBootstrapScript before any other script loads.
        // Wraps window.dataLayer.push(arguments) in the variadic gtag shape.
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

/**
 * IMPORTANT — Consent default ownership (Compliance-Critical):
 *
 * The `consent default = denied` baseline is owned EXCLUSIVELY by the
 * Usercentrics GTM Tag Template in the tenant's GTM container (fires on the
 * Consent Initialization trigger, `wait_for_update: 2000` recommended).
 *
 * DO NOT add a consent-default command in code (here or in
 * GtagBootstrapScript) — that recreates the duplicate-default setup removed
 * in the TSK-1783 / PR #699 follow-up. This guarantee only holds while the
 * Usercentrics template is configured in GTM; if Usercentrics/GTM is ever
 * removed, a denied-by-default baseline must be re-implemented in code.
 *
 * Consent UPDATES stay code-owned: GtagBootstrapScript defines window.gtag,
 * and updateConsent() below translates the (Promise-aware) Usercentrics
 * adapter state into gtag 'update' signals.
 */

/** Translate a normalized TConsentState into gtag consent 'update' signals. */
export function updateConsent(state: TConsentState): void {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('consent', 'update', {
        analytics_storage: state.analytics ? 'granted' : 'denied',
        ad_storage: state.marketing ? 'granted' : 'denied',
        ad_user_data: state.marketing ? 'granted' : 'denied',
        ad_personalization: state.marketing ? 'granted' : 'denied',
        personalization_storage: state.preferences ? 'granted' : 'denied',
    });
}
