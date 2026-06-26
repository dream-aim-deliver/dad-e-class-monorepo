import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createUsercentricsAdapter } from '../../src/lib/infrastructure/client/analytics/consent/usercentrics-adapter';

type UCService = {
    id?: string;
    name?: string;
    categorySlug?: string;
    consent?: { status?: boolean; type?: string };
};

type UC_UI = {
    isInitialized?: () => boolean;
    showFirstLayer?: () => void;
    showSecondLayer?: () => void;
    getServicesBaseInfo?: () => UCService[];
};

declare global {
    interface Window {
        UC_UI?: UC_UI;
    }
}

function dispatchCmpEvent(type: string): void {
    window.dispatchEvent(
        new CustomEvent('UC_UI_CMP_EVENT', { detail: { type } }),
    );
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
            getServicesBaseInfo: () => [
                {
                    id: 'x',
                    categorySlug: 'statistics',
                    consent: { status: true, type: 'EXPLICIT' },
                },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });
    });

    it('returns denied state when getServicesBaseInfo returns a non-array (Promise, undefined, etc.)', () => {
        window.UC_UI = {
            isInitialized: () => true,
            // @ts-expect-error intentionally returning a non-array to simulate
            // the misbehaving SDK path
            getServicesBaseInfo: () => Promise.resolve([]),
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        expect(() => adapter.onConsentChange(handler)).not.toThrow();
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });
    });

    it('ignores IMPLICIT consent on UC_UI_INITIALIZED (premature grant guard)', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                {
                    id: 'ga',
                    categorySlug: 'statistics',
                    consent: { status: true, type: 'IMPLICIT' },
                },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        window.dispatchEvent(new Event('UC_UI_INITIALIZED'));
        expect(handler).toHaveBeenCalledWith({
            analytics: false,
            marketing: false,
            preferences: false,
        });
    });

    it('ignores consent without type (safe default)', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                { id: 'ga', categorySlug: 'statistics', consent: { status: true } },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        dispatchCmpEvent('ACCEPT_ALL');
        expect(handler).toHaveBeenCalledWith({
            analytics: false,
            marketing: false,
            preferences: false,
        });
    });

    it('maps EXPLICIT services by categorySlug on ACCEPT_ALL UC_UI_CMP_EVENT', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                {
                    id: 'ga',
                    name: 'Google Analytics',
                    categorySlug: 'statistics',
                    consent: { status: true, type: 'EXPLICIT' },
                },
                {
                    id: 'meta',
                    name: 'Meta Pixel',
                    categorySlug: 'marketing',
                    consent: { status: false, type: 'EXPLICIT' },
                },
                {
                    id: 'ytp',
                    name: 'YouTube preferences',
                    categorySlug: 'functional',
                    consent: { status: true, type: 'EXPLICIT' },
                },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        dispatchCmpEvent('ACCEPT_ALL');
        expect(handler).toHaveBeenCalledWith({
            analytics: true,
            marketing: false,
            preferences: true,
        });
    });

    it('does not update on non-resolved UC_UI_CMP_EVENT types (e.g. CMP_SHOWN)', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                {
                    id: 'ga',
                    categorySlug: 'statistics',
                    consent: { status: true, type: 'EXPLICIT' },
                },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        dispatchCmpEvent('CMP_SHOWN');
        expect(handler).not.toHaveBeenCalled();
    });

    it('treats "analytics" and "preferences" slugs as equivalent aliases', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                {
                    id: 'x',
                    categorySlug: 'analytics',
                    consent: { status: true, type: 'EXPLICIT' },
                },
                {
                    id: 'y',
                    categorySlug: 'preferences',
                    consent: { status: true, type: 'EXPLICIT' },
                },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        dispatchCmpEvent('SAVE_CC');
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
                {
                    id: 'x',
                    categorySlug: 'something-weird',
                    consent: { status: true, type: 'EXPLICIT' },
                },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        dispatchCmpEvent('DENY_ALL');
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });
    });

    it('unsubscribe stops further callbacks', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                {
                    id: 'x',
                    categorySlug: 'statistics',
                    consent: { status: true, type: 'EXPLICIT' },
                },
            ],
        };

        const adapter = createUsercentricsAdapter();
        const handler = vi.fn();
        const unsubscribe = adapter.onConsentChange(handler);
        handler.mockClear();

        unsubscribe();
        dispatchCmpEvent('ACCEPT_ALL');
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
