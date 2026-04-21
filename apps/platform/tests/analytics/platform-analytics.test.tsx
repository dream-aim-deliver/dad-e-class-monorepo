import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

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
            <RuntimeConfigProvider config={baseConfig()}>
                <PlatformAnalytics>
                    <span data-testid="child">hello</span>
                </PlatformAnalytics>
            </RuntimeConfigProvider>,
        );
        expect(screen.getByTestId('child')).toBeDefined();
    });

    it('does NOT inject the Cookiebot script when CBID is unset in RuntimeConfig', () => {
        render(
            <RuntimeConfigProvider config={baseConfig()}>
                <PlatformAnalytics>
                    <span />
                </PlatformAnalytics>
            </RuntimeConfigProvider>,
        );
        expect(document.querySelector('script[data-cookiebot="true"]')).toBeNull();
    });

    it('injects the Cookiebot script when CBID is set in RuntimeConfig', () => {
        const config = { ...baseConfig(), NEXT_PUBLIC_COOKIEBOT_CBID: '01234567-89ab-cdef-0123-456789abcdef' };
        render(
            <RuntimeConfigProvider config={config}>
                <PlatformAnalytics>
                    <span />
                </PlatformAnalytics>
            </RuntimeConfigProvider>,
        );
        const script = document.querySelector<HTMLScriptElement>('script[data-cookiebot="true"]');
        expect(script).not.toBeNull();
        expect(script!.src).toContain('01234567-89ab-cdef-0123-456789abcdef');
    });
});
