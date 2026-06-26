import { describe, it, expect } from 'vitest';

/**
 * consent-mode.ts is documentation + global Window typings only.
 * gtag consent commands are owned by the Usercentrics GTM tag — see
 * apps/platform/docs/consent-mode-ownership.md.
 */
describe('consent-mode', () => {
    it('module loads (ownership docs + global types; no updateConsent export)', async () => {
        const mod = await import('../../src/lib/infrastructure/client/analytics/consent-mode');
        expect(mod).toBeDefined();
        expect('updateConsent' in mod).toBe(false);
    });
});
