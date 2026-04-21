import { describe, it, expect, vi } from 'vitest';
import { createNoopAdapter } from '../../src/lib/infrastructure/client/analytics/consent/noop-adapter';

describe('noop-adapter', () => {
    it('exposes the TConsentAdapter shape and does nothing when init/showBanner called', () => {
        const adapter = createNoopAdapter();
        expect(() => adapter.init()).not.toThrow();
        expect(() => adapter.showBanner()).not.toThrow();
    });

    it('onConsentChange calls the handler once with DENIED state and returns unsubscribe', () => {
        const adapter = createNoopAdapter();
        const handler = vi.fn();
        const unsubscribe = adapter.onConsentChange(handler);
        expect(handler).toHaveBeenCalledWith({
            analytics: false,
            marketing: false,
            preferences: false,
        });
        expect(handler).toHaveBeenCalledTimes(1);
        expect(typeof unsubscribe).toBe('function');
        // Unsubscribe is a no-op but must not throw.
        expect(() => unsubscribe()).not.toThrow();
    });
});
