import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'node node_modules/next/dist/bin/next start',
    url: 'http://127.0.0.1:3000/en',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    gracefulShutdown: {
      signal: 'SIGTERM',
      timeout: 5_000
    }
  }
})
