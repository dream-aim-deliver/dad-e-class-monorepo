import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('@next/third-parties/google', () => ({
    GoogleTagManager: () => null,
    sendGTMEvent: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
    useSession: () => ({ status: 'unauthenticated', data: null }),
}));

import { PlatformAnalytics } from '../../src/lib/infrastructure/client/analytics/platform-analytics';
import { useConsent } from '../../src/lib/infrastructure/client/analytics/consent/consent-provider';
import { hasServiceConsent } from '../../src/lib/infrastructure/client/analytics/types';
import { RuntimeConfigProvider } from '../../src/lib/infrastructure/client/context/runtime-config-context';
import type { RuntimeConfig } from '../../src/lib/infrastructure/types/runtime-config';

/**
 * REPRODUCTION of the "premature consent grant" incident.
 *
 * Symptom observed live on eclass.justdoad.ch (fresh incognito, banner
 * untouched): GA4 hits fired with `gcs=G101` (analytics_storage granted) —
 * i.e. a granted `consent update` reached GTM BEFORE the user made any choice
 * in the Usercentrics banner.
 *
 * These tests drive the real provider chain
 *   CMP -> usercentrics adapter -> ConsentProvider -> useConsent()
 * and inspect what consent the app believes it has.
 *
 * The key production fact (measured live on both justdoad.ai and
 * eclass.justdoad.ch): the CMP reported services as consented on init, BEFORE
 * any interaction, with `consent.type: 'IMPLICIT'`. A first-party app must not
 * treat that pre-interaction default as a user grant.
 *
 * The root cause was the CMP's own per-service configuration and was fixed
 * there. These tests pin the app's defence-in-depth layer: even if the CMP
 * starts reporting implicit grants again, the app must not act on them.
 *
 * Since #705 the app no longer writes Google Consent Mode at all — the
 * Usercentrics GTM template is the single writer — so "acting on a grant" now
 * means enabling a first-party integration rather than pushing a gtag signal.
 * The dataLayer is still inspected here, to assert the app writes NOTHING to
 * it under any of these paths.
 */

function baseConfig(): RuntimeConfig {
    return {
        NEXT_PUBLIC_E_CLASS_RUNTIME: 'test',
        NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: 'Test',
        NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        NEXT_PUBLIC_E_CLASS_CMS_REST_URL: 'http://localhost:5173',
        defaultTheme: 'just-do-ad',
    };
}

type DataLayerWindow = Window & {
    dataLayer?: unknown[][];
    gtag?: (...a: unknown[]) => void;
    UC_UI?: unknown;
    __ucCmp?: unknown;
};

/**
 * Install a CMP that reports services the way production does.
 *
 * Production reads consent from `__ucCmp.getConsentDetails()` — the only API
 * that reports `consent.type`, so it is the one that can tell an EXPLICIT user
 * decision apart from an IMPLICIT pre-interaction default. (Verified live:
 * `UC_UI.getServicesBaseInfo()` returns `{status, history}` with no `type`.)
 */
function installCmp(
    services: {
        name: string;
        category: string;
        given: boolean;
        type: 'EXPLICIT' | 'IMPLICIT';
    }[],
): void {
    const w = window as DataLayerWindow;
    w.UC_UI = { isInitialized: () => true };
    w.__ucCmp = {
        getConsentDetails: () =>
            Promise.resolve({
                services: Object.fromEntries(
                    services.map((s, i) => [
                        `svc${i}`,
                        {
                            name: s.name,
                            category: s.category,
                            essential: false,
                            consent: { given: s.given, type: s.type },
                        },
                    ]),
                ),
            }),
    };
}

function installGtag(): void {
    const w = window as DataLayerWindow;
    w.dataLayer = [];
    w.gtag = function (...args: unknown[]) {
        (window as DataLayerWindow).dataLayer?.push(args);
    };
}

function consentCommands(): unknown[][] {
    const dl = ((window as DataLayerWindow).dataLayer ?? []) as unknown[][];
    return dl.filter((entry) => entry[0] === 'consent');
}

/** Surfaces what the app concluded about Google Analytics consent. */
function Probe() {
    const { consent } = useConsent();
    return (
        <span data-testid="ga">
            {String(hasServiceConsent(consent, 'google analytics'))}
        </span>
    );
}

function gaConsent(): boolean {
    return screen.getByTestId('ga').textContent === 'true';
}

function renderChain() {
    return render(
        <NextIntlClientProvider locale="en" messages={{}}>
            <RuntimeConfigProvider
                config={{
                    ...baseConfig(),
                    NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: 'testSettingsId',
                }}
            >
                <PlatformAnalytics>
                    <Probe />
                </PlatformAnalytics>
            </RuntimeConfigProvider>
        </NextIntlClientProvider>,
    );
}

const GOOGLE_ANALYTICS = {
    name: 'Google Analytics',
    category: 'marketing',
} as const;

describe('consent premature grant (reproduction)', () => {
    beforeEach(() => {
        document.head.innerHTML = '';
        installGtag();
    });

    afterEach(() => {
        const w = window as DataLayerWindow;
        delete w.UC_UI;
        delete w.__ucCmp;
        delete w.gtag;
        delete w.dataLayer;
    });

    it('does NOT treat an implicit pre-interaction default as consent', async () => {
        // First-time visitor: the CMP has initialized and — as observed in
        // production — already reports GA as consented, but the user has NOT
        // interacted with the banner. No UC_UI_CMP_EVENT is dispatched.
        installCmp([{ ...GOOGLE_ANALYTICS, given: true, type: 'IMPLICIT' }]);

        renderChain();

        // The CMP finishes loading and announces itself. This fires on the
        // very first page load, before any click.
        await act(async () => {
            window.dispatchEvent(new Event('UC_UI_INITIALIZED'));
            // let the async getConsentDetails promise settle
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(
            gaConsent(),
            'Treated an IMPLICIT pre-interaction default as a user grant',
        ).toBe(false);
    });

    it('DOES honor consent once the user explicitly accepts', async () => {
        // Same service, but now the user clicks "Accept All" — the CMP
        // dispatches UC_UI_CMP_EVENT and the status is an explicit choice.
        installCmp([{ ...GOOGLE_ANALYTICS, given: true, type: 'EXPLICIT' }]);

        renderChain();

        await act(async () => {
            window.dispatchEvent(new Event('UC_UI_INITIALIZED'));
            await Promise.resolve();
        });
        await act(async () => {
            // Usercentrics dispatches UC_UI_CMP_EVENT on ACCEPT_ALL.
            window.dispatchEvent(
                Object.assign(new Event('UC_UI_CMP_EVENT'), {
                    detail: { type: 'ACCEPT_ALL' },
                }),
            );
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(gaConsent()).toBe(true);
    });

    it('DOES restore a returning visitor whose stored consent is EXPLICIT on init (no interaction this session)', async () => {
        // The risky path: a returning visitor already granted consent on a
        // previous visit. On this load the CMP restores that decision and fires
        // UC_UI_INITIALIZED with NO UC_UI_CMP_EVENT — but because the stored
        // consent is EXPLICIT (a real prior choice), it must be honored.
        installCmp([{ ...GOOGLE_ANALYTICS, given: true, type: 'EXPLICIT' }]);

        renderChain();

        await act(async () => {
            window.dispatchEvent(new Event('UC_UI_INITIALIZED'));
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(gaConsent()).toBe(true);
    });

    it('writes NO Consent Mode command to the dataLayer, accepted or not', async () => {
        // Single-writer invariant (#705). Google Consent Mode is owned entirely
        // by the Usercentrics GTM template; the app duplicating those signals is
        // what escalated this incident from gcs=G101 to gcs=G111. A second
        // writer must not reappear — including on the explicit-accept path,
        // where pushing a grant looks superficially correct.
        installCmp([{ ...GOOGLE_ANALYTICS, given: true, type: 'EXPLICIT' }]);

        renderChain();

        await act(async () => {
            window.dispatchEvent(new Event('UC_UI_INITIALIZED'));
            await Promise.resolve();
            await Promise.resolve();
        });
        await act(async () => {
            window.dispatchEvent(
                Object.assign(new Event('UC_UI_CMP_EVENT'), {
                    detail: { type: 'ACCEPT_ALL' },
                }),
            );
            await Promise.resolve();
            await Promise.resolve();
        });

        // Guard against a vacuous pass: the app must genuinely have seen the
        // grant and still written nothing.
        expect(gaConsent()).toBe(true);

        const commands = consentCommands();
        expect(
            commands,
            `App wrote Consent Mode commands: ${JSON.stringify(commands)}`,
        ).toHaveLength(0);
    });
});
