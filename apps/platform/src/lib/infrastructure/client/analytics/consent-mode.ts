/**
 * Google Consent Mode — ownership documentation (Compliance-Critical)
 *
 * DEFAULT (`gtag('consent', 'default', all-denied)`):
 *   Owned EXCLUSIVELY by the Usercentrics GTM Tag Template (Consent
 *   Initialization trigger; `wait_for_update` configured in GTM — 2000 ms
 *   recommended). DO NOT add a consent-default command in code (here or in
 *   GtagBootstrapScript) — that recreates the duplicate-default setup removed
 *   in TSK-1783 / PR #699 follow-up.
 *
 * UPDATE (`gtag('consent', 'update', …)`):
 *   Also owned EXCLUSIVELY by the Usercentrics GTM Tag Template (fires on
 *   UC_UI_INITIALIZED for returning visitors and on UC_UI_CMP_EVENT for user
 *   actions). The React app MUST NOT push consent updates — a duplicate
 *   app-side bridge caused premature gcs=G101 hits before banner interaction
 *   (see feature/fix-consent-premature-grant).
 *
 * IN-APP GATING (OTel, track.*):
 *   Owned by ConsentProvider + usercentrics-adapter. Reads Usercentrics
 *   service state for first-party features only; does not call gtag.
 *
 * If Usercentrics/GTM is ever removed from a tenant, both default and update
 * baselines must be re-implemented — in GTM or in code, but never in both.
 *
 * Full ownership model + manual verification checklist:
 *   apps/platform/docs/consent-mode-ownership.md
 */

declare global {
    interface Window {
        // Defined by GtagBootstrapScript before any other script loads.
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

export {};
