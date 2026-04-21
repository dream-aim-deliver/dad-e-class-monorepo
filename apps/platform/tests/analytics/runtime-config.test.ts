import { describe, it, expect } from 'vitest';
import type { RuntimeConfig } from '../../src/lib/infrastructure/types/runtime-config';

describe('RuntimeConfig — analytics fields', () => {
    it('includes optional NEXT_PUBLIC_GTM_ID field (type-only check)', () => {
        const config: RuntimeConfig = {
            NEXT_PUBLIC_E_CLASS_RUNTIME: 'test',
            NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: 'Test',
            NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
            NEXT_PUBLIC_E_CLASS_CMS_REST_URL: 'http://localhost:5173',
            defaultTheme: 'just-do-ad',
            NEXT_PUBLIC_GTM_ID: 'GTM-TKP9GV24',
            NEXT_PUBLIC_COOKIEBOT_CBID: '01234567-89ab-cdef-0123-456789abcdef',
        };
        expect(config.NEXT_PUBLIC_GTM_ID).toBe('GTM-TKP9GV24');
        expect(config.NEXT_PUBLIC_COOKIEBOT_CBID).toBe('01234567-89ab-cdef-0123-456789abcdef');
    });

    it('allows analytics fields to be omitted (they are optional)', () => {
        const config: RuntimeConfig = {
            NEXT_PUBLIC_E_CLASS_RUNTIME: 'test',
            NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: 'Test',
            NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
            NEXT_PUBLIC_E_CLASS_CMS_REST_URL: 'http://localhost:5173',
            defaultTheme: 'just-do-ad',
        };
        expect(config.NEXT_PUBLIC_GTM_ID).toBeUndefined();
        expect(config.NEXT_PUBLIC_COOKIEBOT_CBID).toBeUndefined();
    });
});
