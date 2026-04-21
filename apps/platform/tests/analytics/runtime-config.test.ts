import { describe, it, expect } from 'vitest';
import type { RuntimeConfig } from '../../src/lib/infrastructure/types/runtime-config';

describe('RuntimeConfig — analytics fields', () => {
    it('includes optional NEXT_PUBLIC_GTM_ID and NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID fields', () => {
        const config: RuntimeConfig = {
            NEXT_PUBLIC_E_CLASS_RUNTIME: 'test',
            NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: 'Test',
            NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
            NEXT_PUBLIC_E_CLASS_CMS_REST_URL: 'http://localhost:5173',
            defaultTheme: 'just-do-ad',
            NEXT_PUBLIC_GTM_ID: 'GTM-TKP9GV24',
            NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: 'qYcjvyqjEYm8kA',
        };
        expect(config.NEXT_PUBLIC_GTM_ID).toBe('GTM-TKP9GV24');
        expect(config.NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID).toBe('qYcjvyqjEYm8kA');
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
        expect(config.NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID).toBeUndefined();
    });
});
