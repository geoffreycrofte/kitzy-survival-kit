import { expect, test } from '@playwright/test';

test('Kitzy fonctionne sans connexion après une première visite', async ({ page, context }) => {
  await page.goto('./');
  // Attendre que le service worker ait tout mis en cache et contrôle la page.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Prépare ton terrier.');

  // Une autre route s'ouvre aussi hors-ligne.
  await page.goto('./guide/sirenes');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('img.page-head__hog')).toHaveJSProperty('complete', true);
  expect(
    await page.locator('img.page-head__hog').evaluate((img: HTMLImageElement) => img.naturalWidth),
  ).toBeGreaterThan(0);
});
