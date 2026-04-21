import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';

// Stub next/script — we assert via the spy's calls, not via rendered DOM,
// so the mock returns null (avoids Next.js lint rule for sync <script> tags
// in tests).
const ScriptMock = vi.fn<(props: Record<string, unknown>) => null>(() => null);
vi.mock('next/script', () => ({
    default: (props: Record<string, unknown>) => ScriptMock(props),
}));

import { CookieDeclaration } from '../../src/lib/infrastructure/client/analytics/cookie-declaration';
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

describe('CookieDeclaration', () => {
    beforeEach(() => {
        ScriptMock.mockClear();
    });

    it('renders nothing when NEXT_PUBLIC_COOKIEBOT_CBID is unset', () => {
        const { container } = render(
            <RuntimeConfigProvider config={baseConfig()}>
                <CookieDeclaration />
            </RuntimeConfigProvider>,
        );
        expect(container.innerHTML).toBe('');
        expect(ScriptMock).not.toHaveBeenCalled();
    });

    it('renders the Cookiebot declaration script when CBID is set', () => {
        const config = {
            ...baseConfig(),
            NEXT_PUBLIC_COOKIEBOT_CBID: '59658407-52fe-4797-8882-ffceae83a61a',
        };
        render(
            <RuntimeConfigProvider config={config}>
                <CookieDeclaration />
            </RuntimeConfigProvider>,
        );
        expect(ScriptMock).toHaveBeenCalledTimes(1);
        const props = ScriptMock.mock.calls[0][0];
        expect(props).toMatchObject({
            id: 'CookieDeclaration',
            src: 'https://consent.cookiebot.com/59658407-52fe-4797-8882-ffceae83a61a/cd.js',
            strategy: 'afterInteractive',
            async: true,
        });
    });
});
