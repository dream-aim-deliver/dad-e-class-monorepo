import { DENIED_CONSENT } from '../types';
import type { TConsentAdapter } from './consent-adapter';

/**
 * Adapter used when the CMP env var is unset.
 *
 * Reports a permanently-denied consent state so nothing fires. init() and
 * showBanner() are no-ops. Useful for dev environments where no CMP is
 * configured.
 */
export function createNoopAdapter(): TConsentAdapter {
    return {
        init() {
            /* no-op */
        },
        onConsentChange(handler) {
            handler({ ...DENIED_CONSENT });
            return () => {
                /* no-op unsubscribe */
            };
        },
        showBanner() {
            /* no-op */
        },
    };
}
