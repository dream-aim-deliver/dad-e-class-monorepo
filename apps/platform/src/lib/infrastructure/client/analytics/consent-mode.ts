import type { TConsentState } from './types';

declare global {
    interface Window {
        // Defined by GTM / the Usercentrics Consent Mode tag before tracking fires.
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

/**
 * IMPORTANT: Consent default behavior (Compliance-Critical)
 *
 * The `consent default = denied` baseline is NOW OWNED BY:
 * - Usercentrics GTM Tag Template (only source of truth)
 *
 * DO NOT re-add consent-default scripts in this file.
 * Doing so will reintroduce the race condition where multiple
 * scripts override each other and block GA4 tracking.
 *
 * This guarantee only holds while Usercentrics is configured.
 * If Usercentrics is removed, consent defaults must be re-implemented
 * in code.
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
