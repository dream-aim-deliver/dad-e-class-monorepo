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
    getServicesBaseInfo?: () => UCService[];
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

    it('init() injects the canonical Usercentrics CMP loader script', () => {
        const adapter = createUsercentricsAdapter({ settingsId: 'qYcjvyqjEYm8kA' });
        adapter.init();

        const script = document.getElementById('usercentrics-cmp') as HTMLScriptElement | null;
        expect(script).not.toBeNull();
        expect(script!.tagName).toBe('SCRIPT');
        expect(script!.src).toBe('https://web.cmp.usercentrics.eu/ui/loader.js');
        expect(script!.getAttribute('data-settings-id')).toBe('qYcjvyqjEYm8kA');
        expect(script!.async).toBe(true);
    });

    it('init() does not inject twice on repeat calls', () => {
        const adapter = createUsercentricsAdapter({ settingsId: 'abc123xyz000' });
        adapter.init();
        adapter.init();
        expect(document.querySelectorAll('script#usercentrics-cmp').length).toBe(1);
    });

    it('onConsentChange fires handler immediately with denied state when UC_UI is not loaded', () => {
        const adapter = createUsercentricsAdapter({ settingsId: 'abc' });
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

        const adapter = createUsercentricsAdapter({ settingsId: 'abc' });
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });
    });

    it('returns denied state when getServicesBaseInfo returns a non-array (Promise, undefined, etc.)', () => {
        // Regression test for the "services.some is not a function" crash:
        // when the SDK returns something that has .length but isn't an array
        // (e.g. a Promise or a wrapped object), the adapter must NOT try to
        // iterate it.
        window.UC_UI = {
            isInitialized: () => true,
            // @ts-expect-error intentionally returning a non-array to simulate
            // the misbehaving SDK path
            getServicesBaseInfo: () => Promise.resolve([]),
        };

        const adapter = createUsercentricsAdapter({ settingsId: 'abc' });
        const handler = vi.fn();
        expect(() => adapter.onConsentChange(handler)).not.toThrow();
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });
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

        const adapter = createUsercentricsAdapter({ settingsId: 'abc' });
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

    it('treats "analytics" and "preferences" slugs as equivalent aliases', () => {
        window.UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () => [
                { id: 'x', categorySlug: 'analytics', consent: { status: true } },
                { id: 'y', categorySlug: 'preferences', consent: { status: true } },
            ],
        };

        const adapter = createUsercentricsAdapter({ settingsId: 'abc' });
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

        const adapter = createUsercentricsAdapter({ settingsId: 'abc' });
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

        const adapter = createUsercentricsAdapter({ settingsId: 'abc' });
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

        const adapter = createUsercentricsAdapter({ settingsId: 'abc' });
        adapter.showBanner();
        expect(showFirstLayer).toHaveBeenCalledTimes(1);
    });

    it('showBanner() is a no-op if UC_UI is not loaded yet', () => {
        const adapter = createUsercentricsAdapter({ settingsId: 'abc' });
        expect(() => adapter.showBanner()).not.toThrow();
    });
});
