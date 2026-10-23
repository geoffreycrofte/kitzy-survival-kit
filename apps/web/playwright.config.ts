import { defineConfig, devices } from '@playwright/test';

/**
 * Tests de bout en bout sur la version compilée (service worker compris).
 * PLAYWRIGHT_CHROMIUM_PATH permet d'utiliser un Chromium déjà installé.
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    // L'app vit sous /app/ ; la page de présentation est à la racine du site.
    baseURL: 'http://localhost:4173/app/',
    trace: 'retain-on-failure',
    locale: 'fr-LU',
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 7'],
        // Chromium complet (nouveau mode headless) : le « headless shell » refuse les notifications.
        ...(executablePath ? { launchOptions: { executablePath } } : { channel: 'chromium' }),
      },
    },
  ],
  webServer: {
    command: 'pnpm build && pnpm preview',
    url: 'http://localhost:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
