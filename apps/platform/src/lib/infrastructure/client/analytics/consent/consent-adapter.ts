import type { TConsentState } from '../types';

/**
 * Interface every Consent Management Platform (CMP) integration must implement.
 *
 * Keeps the CMP swappable: Usercentrics today, Cookiebot/Iubenda/DIY tomorrow
 * by writing a new adapter and flipping one line in platform-analytics.tsx.
 */
export interface TConsentAdapter {
    /** Load the CMP script / wire up its global listeners. Called once per app boot. */
    init(): void;

    /**
     * Subscribe to consent state changes.
     *
     * Implementations MUST call `handler` once with the current state
     * immediately (or with DENIED_CONSENT if unknown) so that consumers can
     * render without special first-paint handling.
     *
     * @returns Unsubscribe function. Safe to call at any time.
     */
    onConsentChange(handler: (state: TConsentState) => void): () => void;

    /** Programmatically open the CMP banner (for the "Manage cookies" footer link). */
    showBanner(): void;
}
