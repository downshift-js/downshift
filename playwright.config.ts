import {defineConfig, devices} from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome'], hasTouch: true},
    },
  ],
  webServer: {
    command: 'npm run docs:serve',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
  },
})
