import { describe, it, expect } from 'vitest';
import { clientEnvSchema } from '../../src/lib/infrastructure/client/config/env';

describe('clientEnvSchema — analytics additions', () => {
    const base = {
        NEXT_PUBLIC_E_CLASS_RUNTIME: 'eclass-dev',
        NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: 'E-Class Dev',
        NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        NEXT_PUBLIC_E_CLASS_CMS_REST_URL: 'http://localhost:5173',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_x',
    };

    it('accepts a valid GTM container ID', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_GTM_ID: 'GTM-TKP9GV24',
        });
        expect(result.success).toBe(true);
    });

    it('rejects a malformed GTM container ID', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_GTM_ID: 'not-a-gtm-id',
        });
        expect(result.success).toBe(false);
    });

    it('accepts a valid Cookiebot UUID CBID', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_COOKIEBOT_CBID: '01234567-89ab-cdef-0123-456789abcdef',
        });
        expect(result.success).toBe(true);
    });

    it('rejects a malformed Cookiebot CBID', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_COOKIEBOT_CBID: 'not-a-uuid',
        });
        expect(result.success).toBe(false);
    });

    it('passes when both analytics vars are unset (they are optional)', () => {
        const result = clientEnvSchema.safeParse(base);
        expect(result.success).toBe(true);
    });
});
