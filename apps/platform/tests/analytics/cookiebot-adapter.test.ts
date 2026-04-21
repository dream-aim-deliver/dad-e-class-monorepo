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

    it('init() injects the canonical Cookiebot script tag', () => {
        const adapter = createCookiebotAdapter({ cbid: '01234567-89ab-cdef-0123-456789abcdef' });
        adapter.init();

        const script = document.getElementById('Cookiebot') as HTMLScriptElement | null;
        expect(script).not.toBeNull();
        expect(script!.tagName).toBe('SCRIPT');
        expect(script!.src).toBe('https://consent.cookiebot.com/uc.js');
        expect(script!.getAttribute('data-cbid')).toBe('01234567-89ab-cdef-0123-456789abcdef');
        expect(script!.getAttribute('data-blockingmode')).toBe('auto');
        expect(script!.type).toBe('text/javascript');
        // Must be synchronous for auto-blocking to activate before other scripts.
        expect(script!.async).toBe(false);
    });

    it('init() does not inject twice on repeat calls', () => {
        const adapter = createCookiebotAdapter({ cbid: 'abc' });
        adapter.init();
        adapter.init();
        expect(document.querySelectorAll('script#Cookiebot').length).toBe(1);
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
