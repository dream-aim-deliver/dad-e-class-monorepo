import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { updateConsent } from '../../src/lib/infrastructure/client/analytics/consent-mode';

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

/**
 * Mimic GtagBootstrapScript's inline bootstrap: define window.gtag so it
 * pushes its arguments into window.dataLayer. We assert against the
 * resulting dataLayer entries rather than spying on gtag directly; this
 * exercises the full "shape that lands in dataLayer" contract.
 *
 * NOTE: there is deliberately no applyDefaultConsent / consent-default test —
 * the denied baseline is owned by the Usercentrics GTM template (see
 * consent-mode.ts ownership doc).
 */
function setupGtagShim(): void {
    (window as Window).dataLayer = [];
    (window as Window).gtag = function (...args: unknown[]) {
        (window as Window).dataLayer!.push(args);
    };
}

function readDataLayer(): unknown[] {
    return ((window as Window).dataLayer ?? []).slice();
}

describe('consent-mode', () => {
    beforeEach(() => {
        setupGtagShim();
    });

    afterEach(() => {
        delete (window as Window).dataLayer;
        delete (window as Window).gtag;
    });

    describe('updateConsent', () => {
        it('translates TConsentState into an ad/analytics consent update', () => {
            updateConsent({ analytics: true, marketing: false, preferences: true });
            expect(readDataLayer()[0]).toEqual([
                'consent',
                'update',
                {
                    analytics_storage: 'granted',
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                    personalization_storage: 'granted',
                },
            ]);
        });

        it('grants all ad signals when marketing = true', () => {
            updateConsent({ analytics: true, marketing: true, preferences: false });
            expect(readDataLayer()[0]).toEqual([
                'consent',
                'update',
                {
                    analytics_storage: 'granted',
                    ad_storage: 'granted',
                    ad_user_data: 'granted',
                    ad_personalization: 'granted',
                    personalization_storage: 'denied',
                },
            ]);
        });

        it('is a no-op when window.gtag is missing', () => {
            delete (window as Window).gtag;
            expect(() =>
                updateConsent({ analytics: true, marketing: true, preferences: true }),
            ).not.toThrow();
            expect(readDataLayer()).toEqual([]);
        });
    });
});
