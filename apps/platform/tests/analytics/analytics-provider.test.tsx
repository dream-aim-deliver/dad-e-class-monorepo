import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, render } from '@testing-library/react';

// Mock @next/third-parties/google so we don't actually load GTM in tests.
const GtmMock = vi.fn(() => null);
vi.mock('@next/third-parties/google', () => ({
    GoogleTagManager: (props: { gtmId: string }) => GtmMock(props),
}));

import { ConsentProvider } from '../../src/lib/infrastructure/client/analytics/consent/consent-provider';
import { AnalyticsProvider } from '../../src/lib/infrastructure/client/analytics/analytics-provider';
import { RuntimeConfigProvider } from '../../src/lib/infrastructure/client/context/runtime-config-context';
import type { TConsentAdapter } from '../../src/lib/infrastructure/client/analytics/consent/consent-adapter';
import type { RuntimeConfig } from '../../src/lib/infrastructure/types/runtime-config';

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

function readDataLayer(): unknown[] {
    return ((window as Window).dataLayer ?? []).slice();
}

/**
 * Mimic ConsentModeDefaultScript's bootstrap: define window.gtag as a
 * push-arguments-onto-dataLayer shim so the test can verify consent
 * updates land in dataLayer with the expected shape.
 */
function setupGtagShim(): void {
    (window as Window).dataLayer = [];
    (window as Window).gtag = function (...args: unknown[]) {
        (window as Window).dataLayer!.push(args);
    };
}

function baseConfig(): RuntimeConfig {
    return {
        NEXT_PUBLIC_E_CLASS_RUNTIME: 'test',
        NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: 'Test',
        NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        NEXT_PUBLIC_E_CLASS_CMS_REST_URL: 'http://localhost:5173',
        defaultTheme: 'just-do-ad',
    };
}

function fakeAdapter(): TConsentAdapter & { emit: (s: { analytics: boolean; marketing: boolean; preferences: boolean }) => void } {
    let currentHandler: ((s: unknown) => void) | null = null;
    return {
        init: vi.fn(),
        onConsentChange(handler) {
            handler({ analytics: false, marketing: false, preferences: false });
            currentHandler = handler as (s: unknown) => void;
            return () => {
                currentHandler = null;
            };
        },
        showBanner: vi.fn(),
        emit(state) {
            currentHandler?.(state);
        },
    };
}

describe('AnalyticsProvider', () => {
    beforeEach(() => {
        setupGtagShim();
        GtmMock.mockClear();
    });

    afterEach(() => {
        delete (window as Window).dataLayer;
        delete (window as Window).gtag;
    });

    it('renders GoogleTagManager when NEXT_PUBLIC_GTM_ID is set in RuntimeConfig', () => {
        const config = { ...baseConfig(), NEXT_PUBLIC_GTM_ID: 'GTM-TKP9GV24' };
        const adapter = fakeAdapter();
        render(
            <RuntimeConfigProvider config={config}>
                <ConsentProvider adapter={adapter}>
                    <AnalyticsProvider>
                        <div />
                    </AnalyticsProvider>
                </ConsentProvider>
            </RuntimeConfigProvider>,
        );
        expect(GtmMock).toHaveBeenCalledWith({ gtmId: 'GTM-TKP9GV24' });
    });

    it('does NOT render GoogleTagManager when NEXT_PUBLIC_GTM_ID is unset', () => {
        const config = baseConfig();
        const adapter = fakeAdapter();
        render(
            <RuntimeConfigProvider config={config}>
                <ConsentProvider adapter={adapter}>
                    <AnalyticsProvider>
                        <div />
                    </AnalyticsProvider>
                </ConsentProvider>
            </RuntimeConfigProvider>,
        );
        expect(GtmMock).not.toHaveBeenCalled();
    });

    it('calls gtag("consent","update",...) when adapter emits a new state', () => {
        const config = { ...baseConfig(), NEXT_PUBLIC_GTM_ID: 'GTM-TKP9GV24' };
        const adapter = fakeAdapter();
        render(
            <RuntimeConfigProvider config={config}>
                <ConsentProvider adapter={adapter}>
                    <AnalyticsProvider>
                        <div />
                    </AnalyticsProvider>
                </ConsentProvider>
            </RuntimeConfigProvider>,
        );

        // Clear dataLayer (the mount also fired an initial consent update for the denied state).
        (window as Window).dataLayer = [];
        act(() => {
            adapter.emit({ analytics: true, marketing: true, preferences: false });
        });

        expect(readDataLayer()).toContainEqual([
            'consent',
            'update',
            {
                analytics_storage: 'granted',
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                personalization_storage: 'denied',
            },
        ]);
    });
});
