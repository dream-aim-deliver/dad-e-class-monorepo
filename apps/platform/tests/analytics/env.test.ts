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

    it('accepts a valid Usercentrics Settings ID', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: 'qYcjvyqjEYm8kA',
        });
        expect(result.success).toBe(true);
    });

    it('rejects a Usercentrics Settings ID that is too short', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: 'tooshort',
        });
        expect(result.success).toBe(false);
    });

    it('rejects a Usercentrics Settings ID with disallowed characters', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: 'has spaces!!',
        });
        expect(result.success).toBe(false);
    });

    it('passes when both analytics vars are unset (they are optional)', () => {
        const result = clientEnvSchema.safeParse(base);
        expect(result.success).toBe(true);
    });

    it('rejects a GTM ID with a 6-char or shorter suffix', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_GTM_ID: 'GTM-ABCDEF',
        });
        expect(result.success).toBe(false);
    });

    it('rejects a GTM ID with a 9-char or longer suffix', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_GTM_ID: 'GTM-ABCDEFGHI',
        });
        expect(result.success).toBe(false);
    });

    it('accepts a 7-char GTM suffix', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_GTM_ID: 'GTM-ABCDEFG',
        });
        expect(result.success).toBe(true);
    });

    it('treats empty NEXT_PUBLIC_GTM_ID as unset (does not reject)', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_GTM_ID: '',
        });
        expect(result.success).toBe(true);
    });

    it('treats empty NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID as unset (does not reject)', () => {
        const result = clientEnvSchema.safeParse({
            ...base,
            NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: '',
        });
        expect(result.success).toBe(true);
    });
});
