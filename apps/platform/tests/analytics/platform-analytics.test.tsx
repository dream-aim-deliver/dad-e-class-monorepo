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

    it('does NOT inject the Usercentrics loader when settings ID is unset', () => {
        render(
            <NextIntlClientProvider locale="en" messages={{}}>
                <RuntimeConfigProvider config={baseConfig()}>
                    <PlatformAnalytics>
                        <span />
                    </PlatformAnalytics>
                </RuntimeConfigProvider>
            </NextIntlClientProvider>,
        );
        expect(document.getElementById('usercentrics-cmp')).toBeNull();
    });

    it('injects the Usercentrics loader when settings ID is set', () => {
        const config = {
            ...baseConfig(),
            NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: 'qYcjvyqjEYm8kA',
        };
        render(
            <NextIntlClientProvider locale="en" messages={{}}>
                <RuntimeConfigProvider config={config}>
                    <PlatformAnalytics>
                        <span />
                    </PlatformAnalytics>
                </RuntimeConfigProvider>
            </NextIntlClientProvider>,
        );
        const script = document.getElementById('usercentrics-cmp') as HTMLScriptElement | null;
        expect(script).not.toBeNull();
        expect(script!.getAttribute('data-settings-id')).toBe('qYcjvyqjEYm8kA');
        expect(script!.src).toBe('https://web.cmp.usercentrics.eu/ui/loader.js');
    });

    it('passes the locale as data-language on the Usercentrics loader script', () => {
        const config = {
            ...baseConfig(),
            NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: 'qYcjvyqjEYm8kA',
        };
        render(
            <NextIntlClientProvider locale="de" messages={{}}>
                <RuntimeConfigProvider config={config}>
                    <PlatformAnalytics>
                        <span />
                    </PlatformAnalytics>
                </RuntimeConfigProvider>
            </NextIntlClientProvider>,
        );
        const script = document.getElementById('usercentrics-cmp') as HTMLScriptElement | null;
        expect(script).not.toBeNull();
        expect(script!.getAttribute('data-language')).toBe('de');
    });
});
