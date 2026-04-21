import Script from 'next/script';

/**
 * Inline script that MUST render before GTM loads.
 *
 * Initializes window.dataLayer, defines window.gtag (GLOBAL, reused by
 * consent-mode.ts helpers), and applies the default-denied Consent Mode v2
 * baseline. When the user has consented on a prior visit, Cookiebot will fire
 * `consent update` within a few hundred milliseconds of load, preventing any
 * denied pings from being sent.
 *
 * Strategy "beforeInteractive" is critical — it inlines into <head> so it runs
 * before any other script tag, including GTM itself.
 *
 * Why `window.gtag = function(){ ... }` (not `function gtag(){ ... }`):
 * consent-mode.ts (Task 6) calls `window.gtag('consent', 'update', {...})`
 * later when the user interacts with the CMP. That requires gtag to be a
 * global on window, not a local function inside this inline script.
 *
 * The `window.gtag = window.gtag || ...` guard protects against a
 * re-initialization path (e.g., if GTM's own bootstrap defined gtag first).
 */
export function ConsentModeDefaultScript() {
    const code = `
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            personalization_storage: 'denied',
            security_storage: 'granted',
            wait_for_update: 500
        });
    `;
    return (
        <Script
            id="consent-mode-default"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: code }}
        />
    );
}
