import Script from 'next/script';

/**
 * Inline gtag bootstrap — MUST render before GTM loads.
 *
 * Initializes window.dataLayer and defines window.gtag (GLOBAL, reused by
 * consent-mode.ts updateConsent() when the user interacts with the CMP).
 *
 * IMPORTANT — Consent default ownership (Compliance-Critical):
 * This script deliberately issues NO consent command. The
 * `gtag(... , 'default', all-denied)` baseline is owned exclusively by the
 * Usercentrics GTM Tag Template (fires on GTM's Consent Initialization
 * trigger; `wait_for_update` is configured there — 2000 ms recommended).
 * Re-adding a default here would create the duplicate-default situation
 * removed in TSK-1783 / PR #699 follow-up. The guarantee only holds while
 * the Usercentrics template is configured in the tenant's GTM container —
 * if Usercentrics/GTM is ever removed, a denied-by-default baseline must be
 * re-implemented in code.
 *
 * Why `window.gtag = window.gtag || function(){...}` (not a local function):
 * consent-mode.ts calls `window.gtag('consent', 'update', {...})` later, so
 * gtag must be a window global. The guard keeps an existing definition
 * (e.g. if GTM's own bootstrap ran first) intact.
 *
 * Strategy "beforeInteractive" is critical — it inlines into <head> so the
 * global exists before GTM and before any consent update can fire.
 */
export function GtagBootstrapScript() {
    const code = `
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    `;
    return (
        <Script
            id="gtag-bootstrap"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: code }}
        />
    );
}
