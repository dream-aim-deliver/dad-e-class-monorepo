import { DENIED_CONSENT, type TConsentState } from '../types';
import type { TConsentAdapter } from './consent-adapter';

/**
 * Minimal shape of window.UC_UI we rely on.
 *
 * Usercentrics CMP v3 exposes a larger API — we only use what the adapter
 * needs. Casting to `unknown` is required because Usercentrics does not ship
 * a public type for `UC_UI` in a framework-neutral package.
 */
interface TUserCentricsService {
    id?: string;
    name?: string;
    categorySlug?: string;
    consent?: { status?: boolean };
}

interface TUserCentricsUI {
    isInitialized?: () => boolean;
    showFirstLayer?: () => void;
    showSecondLayer?: () => void;
    getServicesBaseInfo?: () => TUserCentricsService[];
}

declare global {
    interface Window {
        UC_UI?: TUserCentricsUI;
    }
}

/**
 * Translate the Usercentrics per-service consent payload into our normalized
 * {analytics, marketing, preferences} shape.
 *
 * Usercentrics doesn't have a first-class "category" concept in the JS API,
 * so we aggregate by the `categorySlug` field that admins set on each
 * service in the Usercentrics dashboard. Canonical category slugs:
 *   - statistics / analytics  → our `analytics`
 *   - marketing               → our `marketing`
 *   - functional / preferences → our `preferences`
 *   - essential               → always granted, not surfaced in TConsentState
 *
 * We're deliberately tolerant here: a tenant's admin may use non-standard
 * slugs. Unknown slugs map to nothing (false for all three), which means
 * services under those slugs won't unlock any tracking in our app — safe
 * default.
 */
function readUsercentricsState(): TConsentState {
    const ui = typeof window !== 'undefined' ? window.UC_UI : undefined;
    const services = ui?.getServicesBaseInfo?.();
    if (!services || services.length === 0) return { ...DENIED_CONSENT };

    const has = (categories: string[]): boolean =>
        services.some(
            (s) =>
                !!s.consent?.status &&
                typeof s.categorySlug === 'string' &&
                categories.includes(s.categorySlug.toLowerCase()),
        );

    return {
        analytics: has(['statistics', 'analytics']),
        marketing: has(['marketing']),
        preferences: has(['functional', 'preferences']),
    };
}

interface TUsercentricsAdapterOptions {
    /** Settings ID from the Usercentrics dashboard (data-settings-id). */
    settingsId: string;
}

const CMP_LOADER_URL = 'https://web.cmp.usercentrics.eu/ui/loader.js';

/**
 * Usercentrics CMP v3 adapter.
 *
 * Injects the CMP loader script. The autoblocker is mounted separately via
 * `<UsercentricsAutoblocker />` in the layouts so it can run with
 * `beforeInteractive` priority — the adapter only handles the main CMP UI
 * and the consent-state translation.
 *
 * Consent state is read from `window.UC_UI.getServicesBaseInfo()` on every
 * CMP event; the banner is opened via `window.UC_UI.showFirstLayer()`.
 */
export function createUsercentricsAdapter(
    options: TUsercentricsAdapterOptions,
): TConsentAdapter {
    return {
        init() {
            if (typeof document === 'undefined') return;
            // Idempotent: Usercentrics's loader self-identifies via id="usercentrics-cmp".
            if (document.getElementById('usercentrics-cmp')) return;

            const script = document.createElement('script');
            script.id = 'usercentrics-cmp';
            script.src = CMP_LOADER_URL;
            script.async = true;
            script.setAttribute('data-settings-id', options.settingsId);
            document.head.appendChild(script);
        },

        onConsentChange(handler) {
            // Fire synchronously with current (or denied) state so consumers
            // don't need to special-case first paint.
            handler(readUsercentricsState());

            const listener = () => handler(readUsercentricsState());
            if (typeof window !== 'undefined') {
                // UC_UI_INITIALIZED fires once the CMP has loaded and parsed
                // its settings; UC_UI_CMP_EVENT fires on every user interaction
                // (ACCEPT_ALL / DENY_ALL / SAVE).
                window.addEventListener('UC_UI_INITIALIZED', listener);
                window.addEventListener('UC_UI_CMP_EVENT', listener);
            }

            return () => {
                if (typeof window === 'undefined') return;
                window.removeEventListener('UC_UI_INITIALIZED', listener);
                window.removeEventListener('UC_UI_CMP_EVENT', listener);
            };
        },

        showBanner() {
            if (typeof window === 'undefined') return;
            window.UC_UI?.showFirstLayer?.();
        },
    };
}
