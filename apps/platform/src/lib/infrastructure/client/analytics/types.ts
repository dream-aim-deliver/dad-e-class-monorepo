/**
 * Public types for the analytics module.
 *
 * Consumed by the `track.*` SDK, the CMP adapter interface, and the
 * React provider layer. Framework-agnostic.
 */

/** Offer categories used as `item_category` in GA4 e-commerce events. */
export type TOfferType = 'course' | 'package' | 'coaching';

/** A single item in a GA4 e-commerce event. */
export interface TItem {
    item_id: string;
    item_name: string;
    item_category: TOfferType;
    price: number;
    quantity?: number;
    index?: number;
}

/**
 * Normalized consent state exposed by any CMP adapter.
 *
 * Deliberately per-service only. There are no analytics/marketing/preferences
 * category flags: those existed to feed Google Consent Mode, which the app no
 * longer writes to (the Usercentrics GTM template owns it — see #705). What is
 * left is the one question the app genuinely has to answer for itself: may this
 * specific first-party integration run?
 *
 * Categories were also a lossy proxy — a category is true when ANY service in
 * it is consented — which is what let monitoring run for users who had
 * explicitly refused it, and what granted advertising signals to a user who
 * accepted only Google Analytics.
 */
export interface TConsentState {
    /**
     * Per-service consent, keyed by lower-cased CMP service name.
     *
     * Undefined when the CMP could not enumerate services (e.g. the noop
     * adapter, or a failed read) — callers must treat "absent" as "no consent
     * record", not as consent. Use hasServiceConsent() rather than reading
     * this directly.
     */
    services?: Record<string, boolean>;
}

/** Default all-denied consent state used before the CMP has answered. */
export const DENIED_CONSENT: TConsentState = {
    services: {},
};

/**
 * Look up consent for ONE specific CMP service by name fragment.
 *
 * Matching is a case-insensitive substring test against the service names the
 * CMP reported, so a dashboard label like
 * "Platform Performance & Error Monitoring (OpenTelemetry)" can be matched on a
 * stable fragment ("opentelemetry") without pinning the full string.
 *
 * Returns `false` when the service is absent from the CMP payload: no consent
 * record means no consent. There is deliberately no broader fallback — the
 * category proxy this replaced is exactly what let monitoring run for users who
 * had explicitly refused it.
 *
 * Caveat: substring matching means an unrelated service whose name happens to
 * contain the fragment would also match. Safe for the fragments in use today,
 * but pick fragments specific enough to stay unambiguous as more per-service
 * gates are added.
 */
export function hasServiceConsent(
    state: TConsentState,
    nameFragment: string,
): boolean {
    if (!state.services) return false;
    const needle = nameFragment.toLowerCase();
    return Object.entries(state.services).some(
        ([name, granted]) => granted && name.includes(needle),
    );
}
