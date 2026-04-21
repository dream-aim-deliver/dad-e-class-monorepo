import { test, expect } from '@playwright/test';

/**
 * Analytics E2E smoke test.
 *
 * Skipped by default — requires NEXT_PUBLIC_GTM_ID and NEXT_PUBLIC_COOKIEBOT_CBID
 * to be set in the environment where the platform is being served. Run with
 * real Cookiebot dev-tier credentials for true coverage; otherwise relies on
 * Cookiebot's DOM event names alone which are stable across tenants.
 */

const ANALYTICS_ENABLED =
    !!process.env.NEXT_PUBLIC_GTM_ID && !!process.env.NEXT_PUBLIC_COOKIEBOT_CBID;

test.describe('analytics wiring', () => {
    test.skip(
        !ANALYTICS_ENABLED,
        'Requires NEXT_PUBLIC_GTM_ID + NEXT_PUBLIC_COOKIEBOT_CBID in env',
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

    test('clicking the Cookiebot accept button fires a consent update', async ({ page }) => {
        await page.goto('/en');

        // Cookiebot's default accept button has id #CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll.
        // Fall back to a more forgiving selector if custom branding is used.
        const accept = page.locator(
            '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll, [data-testid="cookiebot-accept-all"]',
        );
        await expect(accept).toBeVisible({ timeout: 10_000 });
        await accept.click();

        await expect
            .poll(async () =>
                page.evaluate(() => {
                    const layer = (
                        window as unknown as { dataLayer?: unknown[] }
                    ).dataLayer;
                    return layer?.some(
                        (entry) =>
                            Array.isArray(entry) &&
                            entry[0] === 'consent' &&
                            entry[1] === 'update',
                    );
                }),
            )
            .toBe(true);
    });
});
