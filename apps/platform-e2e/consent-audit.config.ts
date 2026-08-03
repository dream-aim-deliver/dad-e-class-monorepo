import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the LIVE consent audit (`src/consent-audit.spec.ts`).
 *
 * Deliberately separate from `playwright.config.ts`:
 *   - No `webServer`: this suite audits the DEPLOYED public sites
 *     (justdoad.ai and eclass.justdoad.ch), not a local dev build.
 *   - No `baseURL`: each test navigates to an absolute production URL.
 *
 * NOT part of CI. It depends on live third-party infrastructure (Usercentrics
 * CDN, Google Tag Manager) and on the client's CMP dashboard configuration, so
 * a failure here is a finding about production config — not a broken build.
 *
 * Run:
 *   pnpm exec playwright test -c apps/platform-e2e/consent-audit.config.ts
 */
export default defineConfig({
    testDir: './src',
    testMatch: /consent-audit\.spec\.ts/,
    // Live third-party CDNs + GTM need generous time to settle.
    timeout: 90_000,
    expect: { timeout: 30_000 },
    // Serial: these assert on real network traffic; parallel runs make the
    // console report interleave and harder to hand to a client.
    workers: 1,
    fullyParallel: false,
    retries: 0,
    reporter: [['list']],
    use: {
        ...devices['Desktop Chrome'],
        // Swiss visitor — this is a revDSG question, and Usercentrics decides
        // consent enforcement partly by region.
        locale: 'de-CH',
        timezoneId: 'Europe/Zurich',
        trace: 'off',
    },
    projects: [{ name: 'consent-audit' }],
});
