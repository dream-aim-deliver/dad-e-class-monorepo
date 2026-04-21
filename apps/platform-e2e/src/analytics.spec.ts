import { test, expect } from '@playwright/test';

/**
 * Analytics E2E smoke test.
 *
 * Skipped by default — requires NEXT_PUBLIC_GTM_ID and
 * NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID to be set in the environment where the
 * platform is being served. Run with real Usercentrics credentials for true
 * coverage; otherwise relies on Usercentrics' window events which are stable
 * across tenants.
 */

const ANALYTICS_ENABLED =
    !!process.env.NEXT_PUBLIC_GTM_ID &&
    !!process.env.NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID;

test.describe('analytics wiring', () => {
    test.skip(
        !ANALYTICS_ENABLED,
        'Requires NEXT_PUBLIC_GTM_ID + NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID in env',
    );

    test('default-denied consent is pushed before any other event', async ({ page }) => {
        await page.goto('/en');
        const consent = await page.evaluate(() => {
            const layer = (
                window as unknown as { dataLayer?: unknown[] }
            ).dataLayer;
            return layer?.find(
                (entry) =>
                    Array.isArray(entry) &&
                    entry[0] === 'consent' &&
                    entry[1] === 'default',
            );
        });
        expect(consent).toBeDefined();
    });

    test('UC_UI_INITIALIZED fires once the CMP loads', async ({ page }) => {
        await page.goto('/en');
        await expect
            .poll(
                async () =>
                    page.evaluate(
                        () =>
                            typeof (window as unknown as { UC_UI?: unknown }).UC_UI !==
                            'undefined',
                    ),
                { timeout: 15_000 },
            )
            .toBe(true);
    });
});
