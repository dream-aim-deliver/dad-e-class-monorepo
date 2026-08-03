import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('@next/third-parties/google', () => ({
    GoogleTagManager: () => null,
    sendGTMEvent: vi.fn(),
}));

// Skip the identity binder's session logic in this test.
vi.mock('next-auth/react', () => ({
    useSession: () => ({ status: 'unauthenticated', data: null }),
}));

import { PlatformAnalytics } from '../../src/lib/infrastructure/client/analytics/platform-analytics';
import { useConsent } from '../../src/lib/infrastructure/client/analytics/consent/consent-provider';
import { RuntimeConfigProvider } from '../../src/lib/infrastructure/client/context/runtime-config-context';
import type { RuntimeConfig } from '../../src/lib/infrastructure/types/runtime-config';

function baseConfig(): RuntimeConfig {
    return {
        NEXT_PUBLIC_E_CLASS_RUNTIME: 'test',
        NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: 'Test',
        NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        NEXT_PUBLIC_E_CLASS_CMS_REST_URL: 'http://localhost:5173',
        defaultTheme: 'just-do-ad',
    };
}

describe('PlatformAnalytics', () => {
    beforeEach(() => {
        document.head.innerHTML = '';
    });

    it('renders children even when no analytics env vars are set in RuntimeConfig', () => {
        render(
            <NextIntlClientProvider locale="en" messages={{}}>
                <RuntimeConfigProvider config={baseConfig()}>
                    <PlatformAnalytics>
                        <span data-testid="child">hello</span>
                    </PlatformAnalytics>
                </RuntimeConfigProvider>
            </NextIntlClientProvider>,
        );
        expect(screen.getByTestId('child')).toBeDefined();
    });

    // Loader-script injection is the responsibility of <UsercentricsCMPLoader>
    // rendered in the root layouts — see usercentrics-cmp-loader.test.tsx.
    // PlatformAnalytics itself only composes the Consent/Analytics providers.

    it('propagates granted consent through the provider chain when the UC SDK returns services as a Promise', async () => {
        // Regression test for the production incident where CMP v3.121+
        // (async getServicesBaseInfo) made the adapter report denied forever,
        // so GA4 recorded every hit as gcs=G100. Exercises the full chain:
        // UC_UI → adapter → ConsentProvider → useConsent().
        //
        // The chain used to terminate in gtag('consent','update',...); since
        // #705 the app writes no Consent Mode signals (the Usercentrics GTM
        // template is the single writer), so what is asserted is the consent
        // the app itself resolves. The dataLayer is checked too — it must stay
        // free of consent commands even on this fully-granted path.
        (window as Window & { dataLayer?: unknown[] }).dataLayer = [];
        (window as Window & { gtag?: (...a: unknown[]) => void }).gtag =
            function (...args: unknown[]) {
                (window as Window & { dataLayer?: unknown[] }).dataLayer?.push(
                    args,
                );
            };
        (window as Window & { UC_UI?: unknown }).UC_UI = {
            isInitialized: () => true,
            getServicesBaseInfo: () =>
                Promise.resolve([
                    {
                        id: 'ga',
                        name: 'Google Analytics',
                        categorySlug: 'statistics',
                        // Explicit: models a user who has actively consented.
                        consent: { status: true, type: 'EXPLICIT' },
                    },
                    {
                        id: 'ads',
                        name: 'Google Ads',
                        categorySlug: 'marketing',
                        consent: { status: true, type: 'EXPLICIT' },
                    },
                ]),
        };

        function ConsentProbe() {
            const { consent } = useConsent();
            return (
                <span data-testid="granted">
                    {Object.entries(consent.services ?? {})
                        .filter(([, granted]) => granted)
                        .map(([name]) => name)
                        .sort()
                        .join(',')}
                </span>
            );
        }

        try {
            render(
                <NextIntlClientProvider locale="en" messages={{}}>
                    <RuntimeConfigProvider
                        config={{
                            ...baseConfig(),
                            NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID:
                                'testSettingsId',
                        }}
                    >
                        <PlatformAnalytics>
                            <ConsentProbe />
                        </PlatformAnalytics>
                    </RuntimeConfigProvider>
                </NextIntlClientProvider>,
            );

            await vi.waitFor(() => {
                expect(screen.getByTestId('granted').textContent).toBe(
                    'google ads,google analytics',
                );
            });

            const dl = (window as Window & { dataLayer?: unknown[] })
                .dataLayer as unknown[][];
            expect(dl.filter((e) => e[0] === 'consent')).toEqual([]);
        } finally {
            delete (window as Window & { UC_UI?: unknown }).UC_UI;
            delete (window as Window & { gtag?: unknown }).gtag;
            delete (window as Window & { dataLayer?: unknown[] }).dataLayer;
        }
    });
});
