import { DENIED_CONSENT, type TConsentState } from '../types';
import type { TConsentAdapter } from './consent-adapter';

interface TCookiebotGlobal {
    consent?: {
        statistics: boolean;
        marketing: boolean;
        preferences: boolean;
    };
    show?: () => void;
}

declare global {
    interface Window {
        Cookiebot?: TCookiebotGlobal;
    }
}

interface TCookiebotAdapterOptions {
    cbid: string;
}

function readCookiebotState(): TConsentState {
    const consent =
        typeof window !== 'undefined' ? window.Cookiebot?.consent : undefined;
    if (!consent) return { ...DENIED_CONSENT };
    return {
        analytics: !!consent.statistics,
        marketing: !!consent.marketing,
        preferences: !!consent.preferences,
    };
}

export function createCookiebotAdapter(
    options: TCookiebotAdapterOptions,
): TConsentAdapter {
    return {
        init() {
            if (typeof document === 'undefined') return;
            // Idempotent: Cookiebot's runtime self-identifies via id="Cookiebot",
            // so we key the guard on the same id.
            if (document.getElementById('Cookiebot')) return;

            const script = document.createElement('script');
            // Canonical Cookiebot setup per https://www.cookiebot.com/en/developer/ —
            // id="Cookiebot" + data-cbid attribute + data-blockingmode="auto", loaded
            // synchronously so auto-blocking activates before any other script can
            // set cookies. The query-string form (?cbid=...) works too but is the
            // secondary method.
            script.id = 'Cookiebot';
            script.src = 'https://consent.cookiebot.com/uc.js';
            script.type = 'text/javascript';
            script.setAttribute('data-cbid', options.cbid);
            script.setAttribute('data-blockingmode', 'auto');
            // Explicit async=false preserves insertion order so Cookiebot's
            // auto-blocking runtime activates before any subsequently-injected
            // tracker script. (DOM-created scripts default to async=true.)
            script.async = false;
            document.head.appendChild(script);
        },

        onConsentChange(handler) {
            // Fire synchronously with current (or denied) state so consumers
            // don't need a loading spinner on first render.
            handler(readCookiebotState());

            const listener = () => handler(readCookiebotState());
            if (typeof window !== 'undefined') {
                window.addEventListener('CookiebotOnAccept', listener);
                window.addEventListener('CookiebotOnDecline', listener);
                window.addEventListener('CookiebotOnDialogInit', listener);
            }

            return () => {
                if (typeof window === 'undefined') return;
                window.removeEventListener('CookiebotOnAccept', listener);
                window.removeEventListener('CookiebotOnDecline', listener);
                window.removeEventListener('CookiebotOnDialogInit', listener);
            };
        },

        showBanner() {
            if (typeof window === 'undefined') return;
            window.Cookiebot?.show?.();
        },
    };
}
