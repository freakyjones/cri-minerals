import { defineConfig, devices } from '@playwright/test';

// Inject bypass flag so the web server starts with auth bypassed (for Node scripts run by Playwright)
process.env.VITE_E2E_BYPASS_AUTH = 'true';

const isCI = !!process.env.CI;
const port = isCI ? 4173 : 5174;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
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
  ],
  webServer: {
    command: isCI 
      ? `npm run build && npm run preview -- --port ${port} --strictPort`
      : `npm run dev -- --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !isCI,
    env: {
      VITE_E2E_BYPASS_AUTH: 'true',
    }
  },
});
