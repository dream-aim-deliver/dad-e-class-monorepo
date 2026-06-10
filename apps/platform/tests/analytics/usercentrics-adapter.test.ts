import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createUsercentricsAdapter } from '../../src/lib/infrastructure/client/analytics/consent/usercentrics-adapter';

type UCService = {
    id?: string;
    name?: string;
    categorySlug?: string;
    consent?: { status?: boolean };
};

type UC_UI = {
    isInitialized?: () => boolean;
    showFirstLayer?: () => void;
    showSecondLayer?: () => void;
    getServicesBaseInfo?: () => UCService[] | Promise<UCService[]>;
};

declare global {
    interface Window {
        UC_UI?: UC_UI;
    }
}

describe('usercentrics-adapter', () => {
    beforeEach(() => {
        document.head.innerHTML = '';
        delete (window as Window).UC_UI;
    });

    afterEach(() => {
        document.head.innerHTML = '';
        delete (window as Window).UC_UI;
    });

    it('init() does not inject the loader script (now rendered server-side in <head>)', () => {
        const adapter = createUsercentricsAdapter();
        adapter.init();
        expect(document.getElementById('usercentrics-cmp')).toBeNull();
    });

    it('onConsentChange fires handler immediately with denied state when UC_UI is not loaded', () => {
        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });
    });

    it('returns denied state when UC_UI exists but isInitialized() is false', () => {
        window.UC_UI = {
            isInitialized: () => false,
            // Simulate a pre-init state where getServicesBaseInfo could return
            // anything (Promise, undefined, partial data) — the guard must
            // short-circuit BEFORE we try to iterate.
            getServicesBaseInfo: () => [
                { id: 'x', categorySlug: 'statistics', consent: { status: true } },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });
    });

    it('returns denied state when getServicesBaseInfo returns a non-array, non-thenable value', () => {
        // Regression test for the "services.some is not a function" crash:
        // when the SDK returns garbage (a wrapped object, a string), the
        // adapter must NOT try to iterate it.
        window.UC_UI = {
            isInitialized: () => true,
            // @ts-expect-error intentionally returning a non-array to simulate
            // the misbehaving SDK path
            getServicesBaseInfo: () => ({ weird: true }),
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        expect(() => adapter.onConsentChange(handler)).not.toThrow();
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });
    });

    it('resolves consent state when getServicesBaseInfo returns a Promise (CMP v3.121+)', async () => {
        // CMP v3.121+ made getServicesBaseInfo async. The adapter must await
        // it and report the REAL state — returning denied here permanently
        // revoked granted consent in production (GA4 hits stuck at gcs=G100).
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () =>
                Promise.resolve([
                    { id: 'ga', categorySlug: 'marketing', consent: { status: true } },
                    { id: 'ot', categorySlug: 'functional', consent: { status: true } },
                ]),
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);

        // Synchronous first call keeps the documented first-paint contract.
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });

        await vi.waitFor(() =>
            expect(handler).toHaveBeenCalledWith({
                analytics: false,
                marketing: true,
                preferences: true,
            }),
        );
    });

    it('reports granted state after UC_UI_CMP_EVENT when the SDK is async (accept-all flow)', async () => {
        let granted = false;
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () =>
                Promise.resolve([
                    { id: 'ga', categorySlug: 'statistics', consent: { status: granted } },
                ]),
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        await vi.waitFor(() => expect(handler).toHaveBeenCalled());
        handler.mockClear();

        granted = true; // user clicks "Accept all" in the banner
        window.dispatchEvent(new Event('UC_UI_CMP_EVENT'));

        await vi.waitFor(() =>
            expect(handler).toHaveBeenCalledWith({
                analytics: true,
                marketing: false,
                preferences: false,
            }),
        );
        // The event-driven emission must not push a transient denied state.
        expect(handler).not.toHaveBeenCalledWith({
            analytics: false,
            marketing: false,
            preferences: false,
        });
    });

    it('drops stale async resolutions so an older snapshot cannot overwrite a newer one', async () => {
        // First read resolves LATE with denied; a CMP event then triggers a
        // second read that resolves EARLY with granted. The late denied
        // resolution must be discarded, not re-emitted.
        let resolveFirst: (s: UCService[]) => void = () => undefined;
        const first = new Promise<UCService[]>((res) => { resolveFirst = res; });
        const second = Promise.resolve([
            { id: 'ga', categorySlug: 'statistics', consent: { status: true } },
        ]);
        let call = 0;
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => (call++ === 0 ? first : second),
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        window.dispatchEvent(new Event('UC_UI_CMP_EVENT'));
        await vi.waitFor(() =>
            expect(handler).toHaveBeenCalledWith({
                analytics: true,
                marketing: false,
                preferences: false,
            }),
        );
        handler.mockClear();

        resolveFirst([{ id: 'ga', categorySlug: 'statistics', consent: { status: false } }]);
        await new Promise((res) => setTimeout(res, 10));
        expect(handler).not.toHaveBeenCalled();
    });

    it('a rejected getServicesBaseInfo Promise does not emit a state change or throw', async () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => Promise.reject(new Error('cmp exploded')),
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        // initial synchronous denied call is allowed; nothing further
        handler.mockClear();
        await new Promise((res) => setTimeout(res, 10));
        expect(handler).not.toHaveBeenCalled();
    });

    it('unsubscribe also cancels in-flight async resolutions', async () => {
        let resolveServices: (s: UCService[]) => void = () => undefined;
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () =>
                new Promise<UCService[]>((res) => { resolveServices = res; }),
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        const unsubscribe = adapter.onConsentChange(handler);
        handler.mockClear();

        unsubscribe();
        resolveServices([{ id: 'ga', categorySlug: 'statistics', consent: { status: true } }]);
        await new Promise((res) => setTimeout(res, 10));
        expect(handler).not.toHaveBeenCalled();
    });

    it('maps services by categorySlug into the normalized consent state on UC_UI_CMP_EVENT', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                { id: 'ga', name: 'Google Analytics', categorySlug: 'statistics', consent: { status: true } },
                { id: 'meta', name: 'Meta Pixel', categorySlug: 'marketing', consent: { status: false } },
                { id: 'ytp', name: 'YouTube preferences', categorySlug: 'functional', consent: { status: true } },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        window.dispatchEvent(new Event('UC_UI_CMP_EVENT'));
        expect(handler).toHaveBeenCalledWith({
            analytics: true,
            marketing: false,
            preferences: true,
        });
    });

    it('grants analytics when the Google Analytics service is consented, even under a "marketing" category', () => {
        // Real tenant payload shape: the Usercentrics dashboard for
        // eclass.justdoad.ch has no statistics/analytics category at all —
        // Google Analytics is classified under "marketing". Consent to the
        // GA service itself IS analytics consent; without this mapping,
        // analytics_storage stays denied forever (gcs=G110 incident).
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                { id: 'ga', name: 'Google Analytics', categorySlug: 'marketing', consent: { status: true } },
                { id: 'gtm', name: 'Google Tag Manager', categorySlug: 'marketing', consent: { status: true } },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        window.dispatchEvent(new Event('UC_UI_CMP_EVENT'));
        expect(handler).toHaveBeenCalledWith({
            analytics: true,
            marketing: true,
            preferences: false,
        });
    });

    it('does NOT grant analytics from other marketing services when Google Analytics itself is refused', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                { id: 'ga', name: 'Google Analytics', categorySlug: 'marketing', consent: { status: false } },
                { id: 'li', name: 'LinkedIn Insight Tag', categorySlug: 'marketing', consent: { status: true } },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        window.dispatchEvent(new Event('UC_UI_CMP_EVENT'));
        expect(handler).toHaveBeenCalledWith({
            analytics: false,
            marketing: true,
            preferences: false,
        });
    });

    it('treats "analytics" and "preferences" slugs as equivalent aliases', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                { id: 'x', categorySlug: 'analytics', consent: { status: true } },
                { id: 'y', categorySlug: 'preferences', consent: { status: true } },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        window.dispatchEvent(new Event('UC_UI_CMP_EVENT'));
        expect(handler).toHaveBeenCalledWith({
            analytics: true,
            marketing: false,
            preferences: true,
        });
    });

    it('ignores unknown category slugs (safe default)', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                { id: 'x', categorySlug: 'something-weird', consent: { status: true } },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        window.dispatchEvent(new Event('UC_UI_CMP_EVENT'));
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });
    });

    it('unsubscribe stops further callbacks', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                { id: 'x', categorySlug: 'statistics', consent: { status: true } },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        const unsubscribe = adapter.onConsentChange(handler);
        handler.mockClear();

        unsubscribe();
        window.dispatchEvent(new Event('UC_UI_CMP_EVENT'));
        expect(handler).not.toHaveBeenCalled();
    });

    it('showBanner() calls window.UC_UI.showFirstLayer when available', () => {
        const showFirstLayer = vi.fn();
        window.UC_UI = { showFirstLayer };

        const adapter = createUsercentricsAdapter();
        adapter.showBanner();
        expect(showFirstLayer).toHaveBeenCalledTimes(1);
    });

    it('showBanner() is a no-op if UC_UI is not loaded yet', () => {
        const adapter = createUsercentricsAdapter();
        expect(() => adapter.showBanner()).not.toThrow();
    });
});
