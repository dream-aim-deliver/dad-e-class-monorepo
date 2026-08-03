import Script from 'next/script';

declare global {
    interface Window {
        /**
         * Standard Consent Mode plumbing: wraps window.dataLayer.push(arguments)
         * in the variadic gtag shape. Defined by GtagBootstrapScript below.
         *
         * NO application code calls this — see the ownership note below. It is
         * declared so tests and any future gtag.js interop see the real shape
         * rather than `any`.
         *
         * `dataLayer` is deliberately NOT declared here: @next/third-parties
         * already declares it globally as `Object[]`, and a second declaration
         * with a different element type is a compile error ("Subsequent
         * property declarations must have the same type").
         */
        gtag?: (...args: unknown[]) => void;
    }
}

/**
 * Inline dataLayer/gtag bootstrap — MUST render before GTM loads.
 *
 * Guarantees `window.dataLayer` exists in <head> before the Usercentrics CMP
 * and GTM scripts run, and defines the conventional `window.gtag` queue
 * wrapper.
 *
 * IMPORTANT — Consent Mode ownership (Compliance-Critical):
 * This script issues NO consent command, and neither does any other app code.
 * The whole of Google Consent Mode — the `default` all-denied baseline and
 * every `update` — is owned exclusively by the Usercentrics GTM Tag Template
 * in the tenant's GTM container (the default fires on GTM's Consent
 * Initialization trigger; `wait_for_update` is configured there, 2000 ms
 * recommended). Adding a default here recreates the duplicate-default setup
 * removed in TSK-1783 / PR #699; adding an update recreates the two-writer
 * setup removed in #705. The guarantee only holds while the Usercentrics
 * template is configured in the tenant's GTM container — if Usercentrics/GTM
 * is ever removed, a denied-by-default baseline must be re-implemented in code.
 *
 * Why keep `window.gtag` when nothing in the app calls it: it is the standard
 * global gtag.js and GTM expect to find or define, and defining it early means
 * any call that arrives before GTM loads is queued into the dataLayer rather
 * than lost. Removing it is a plausible further cleanup, but one that can only
 * be verified against a deployed environment, so it is deliberately not
 * bundled with #705.
 *
 * Strategy "beforeInteractive" is critical — it inlines into <head> so the
 * globals exist before GTM and before the CMP can emit anything.
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
