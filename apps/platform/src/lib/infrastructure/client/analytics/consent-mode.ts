import type { TConsentState } from './types';

declare global {
    interface Window {
        // Defined by GTM / the Usercentrics Consent Mode tag before tracking fires.
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

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
