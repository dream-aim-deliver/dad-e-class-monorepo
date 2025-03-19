import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';

import { workspaceRoot } from '@nx/devkit';

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://localhost:3000';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  globalSetup: './config/setup.ts',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm exec nx run --no-cloud platform:start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
    env: {
      'AUTH_SECRET': 'Wu/hegOKb+gqUY9pBZeLyZQLatMlZSWvK',
      'AUTH_ENABLE_TEST_ACCOUNTS': 'true',
      'AUTH_AUTH0_CLIENT_ID': 'NOT_NEEDED_FOR_PLAYWRIGHT',
      'AUTH_AUTH0_CLIENT_SECRET': 'NOT_NEEDED_FOR_PLAYWRIGHT',
      'AUTH_AUTH0_ISSUER': 'NOT_NEEDED_FOR_PLAYWRIGHT',
      'AUTH_AUTH0_AUTHORIZATION_URL': 'NOT_NEEDED_FOR_PLAYWRIGHT',
      'AUTH_AUTH0_ROLES_CLAIM_KEY': 'NOT_NEEDED_FOR_PLAYWRIGHT',
      'E_CLASS_PLATFORM_SHORT_NAME': "dev",
      'E_CLASS_PLATFORM_NAME':"E-Class Dev Platform"
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Uncomment for mobile browsers support
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
