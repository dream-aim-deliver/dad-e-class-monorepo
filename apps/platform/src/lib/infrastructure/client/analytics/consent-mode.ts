import type { TConsentState } from './types';

declare global {
    interface Window {
        // Defined by ConsentModeDefaultScript (Task 10) before any script loads.
        // Wraps window.dataLayer.push(arguments) in the variadic gtag shape.
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

/**
 * Google Consent Mode v2 — default consent applied before GTM loads.
 *
 * This is ALREADY called inline by ConsentModeDefaultScript (Task 10) at
 * `beforeInteractive`, so production rendering does not need to invoke it
 * again. The export exists so unit tests can exercise the shape independently.
 */
export function applyDefaultConsent(): void {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        personalization_storage: 'denied',
        security_storage: 'granted',
        wait_for_update: 500,
    });
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
