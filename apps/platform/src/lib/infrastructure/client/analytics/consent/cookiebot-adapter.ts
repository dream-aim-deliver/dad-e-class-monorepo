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
            if (document.querySelector('script[data-cookiebot="true"]')) return;

            const script = document.createElement('script');
            script.src = `https://consent.cookiebot.com/uc.js?cbid=${encodeURIComponent(options.cbid)}`;
            script.setAttribute('data-cookiebot', 'true');
            // Cookiebot's "auto" blocking mode automatically blocks prior-categorized
            // tags until consent is given, belt-and-braces with Consent Mode v2.
            script.setAttribute('data-blockingmode', 'auto');
            script.async = true;
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
