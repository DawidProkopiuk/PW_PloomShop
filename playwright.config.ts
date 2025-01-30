import { defineConfig, devices } from '@playwright/test';
import { Fixtures } from './src/tests/fixtures/fixtures';

export default defineConfig<Fixtures>({
  testDir: './src/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: 'html',
  timeout: 90 * 1000,
  use: {
    trace: 'retain-on-failure',
    headless: false,
    screenshot: 'on',
  },

  projects: [
    {
      name: 'chrome-uk',
      use: {
         ...devices['Desktop Chrome'],
         marketName: 'uk'
      },
    },
    {
      name: 'chrome-pl',
      use: {
         ...devices['Desktop Chrome'],
         marketName: 'pl'
      },
    },
  ],
});
