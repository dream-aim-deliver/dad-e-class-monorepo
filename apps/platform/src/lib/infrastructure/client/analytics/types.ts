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

/** Normalized consent state exposed by any CMP adapter. */
export interface TConsentState {
    /** Statistics / analytics cookies (maps to GA4 `analytics_storage`). */
    analytics: boolean;
    /** Marketing / advertising cookies (maps to `ad_storage` + `ad_user_data` + `ad_personalization`). */
    marketing: boolean;
    /** Preference cookies (maps to `personalization_storage`). */
    preferences: boolean;
}

/** Default all-denied consent state used before the CMP has answered. */
export const DENIED_CONSENT: TConsentState = {
    analytics: false,
    marketing: false,
    preferences: false,
};
