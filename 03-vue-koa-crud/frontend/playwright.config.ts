import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Vue + Koa CRUD application.
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: '.',
  testMatch: ['seed.spec.ts', 'tests/**/*.spec.ts'],
  /* Run tests serially since backend uses in-memory data */
  fullyParallel: false,
  workers: 1,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use */
  reporter: 'html',
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'http://localhost:5173',
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'node app.js',
      cwd: '../backend',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 10000,
    },
    {
      command: 'npm run dev',
      port: 5173,
      reuseExistingServer: !process.env.CI,
      timeout: 15000,
    },
  ],
});
