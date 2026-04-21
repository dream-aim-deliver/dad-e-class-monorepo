import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createCookiebotAdapter } from '../../src/lib/infrastructure/client/analytics/consent/cookiebot-adapter';

type CookiebotGlobal = {
    consent?: { statistics: boolean; marketing: boolean; preferences: boolean };
    show?: () => void;
};

declare global {
    interface Window {
        Cookiebot?: CookiebotGlobal;
    }
}

describe('cookiebot-adapter', () => {
    beforeEach(() => {
        document.head.innerHTML = '';
        delete (window as Window).Cookiebot;
    });

    afterEach(() => {
        document.head.innerHTML = '';
        delete (window as Window).Cookiebot;
    });

    it('init() injects the Cookiebot script tag with the CBID', () => {
        const adapter = createCookiebotAdapter({ cbid: '01234567-89ab-cdef-0123-456789abcdef' });
        adapter.init();

        const script = document.querySelector<HTMLScriptElement>('script[data-cookiebot="true"]');
        expect(script).not.toBeNull();
        expect(script!.src).toBe(
            'https://consent.cookiebot.com/uc.js?cbid=01234567-89ab-cdef-0123-456789abcdef',
        );
        expect(script!.getAttribute('data-blockingmode')).toBe('auto');
    });

    it('init() does not inject twice on repeat calls', () => {
        const adapter = createCookiebotAdapter({ cbid: 'abc' });
        adapter.init();
        adapter.init();
        expect(document.querySelectorAll('script[data-cookiebot="true"]').length).toBe(1);
    });

    it('onConsentChange fires handler immediately with denied state when consent not yet known', () => {
        const adapter = createCookiebotAdapter({ cbid: 'abc' });
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });
    });

    it('onConsentChange fires handler with translated state on CookiebotOnAccept', () => {
        window.Cookiebot = { consent: { statistics: true, marketing: true, preferences: false } };

        const adapter = createCookiebotAdapter({ cbid: 'abc' });
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        window.dispatchEvent(new Event('CookiebotOnAccept'));
        expect(handler).toHaveBeenCalledWith({ analytics: true, marketing: true, preferences: false });
    });

    it('onConsentChange fires handler with all-denied on CookiebotOnDecline', () => {
        window.Cookiebot = { consent: { statistics: false, marketing: false, preferences: false } };

        const adapter = createCookiebotAdapter({ cbid: 'abc' });
        const handler = vi.fn();
        adapter.onConsentChange(handler);
        handler.mockClear();

        window.dispatchEvent(new Event('CookiebotOnDecline'));
        expect(handler).toHaveBeenCalledWith({ analytics: false, marketing: false, preferences: false });
    });

    it('unsubscribe stops further callbacks', () => {
        window.Cookiebot = { consent: { statistics: true, marketing: false, preferences: false } };

        const adapter = createCookiebotAdapter({ cbid: 'abc' });
        const handler = vi.fn();
        const unsubscribe = adapter.onConsentChange(handler);
        handler.mockClear();

        unsubscribe();
        window.dispatchEvent(new Event('CookiebotOnAccept'));
        expect(handler).not.toHaveBeenCalled();
    });

    it('showBanner() calls window.Cookiebot.show when available', () => {
        const show = vi.fn();
        window.Cookiebot = { show };

        const adapter = createCookiebotAdapter({ cbid: 'abc' });
        adapter.showBanner();
        expect(show).toHaveBeenCalledTimes(1);
    });

    it('showBanner() is a no-op if Cookiebot is not loaded yet', () => {
        const adapter = createCookiebotAdapter({ cbid: 'abc' });
        expect(() => adapter.showBanner()).not.toThrow();
    });
});
