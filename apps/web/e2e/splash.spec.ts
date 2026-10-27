import { expect, test } from '@playwright/test';

/** L'app installée (affichage « standalone ») : simulée en remplaçant matchMedia. */
const installed = () => {
  const original = window.matchMedia.bind(window);
  window.matchMedia = (query: string) =>
    query === '(display-mode: standalone)'
      ? ({
          matches: true,
          media: query,
          addEventListener() {},
          removeEventListener() {},
        } as unknown as MediaQueryList)
      : original(query);
};

test.describe('Écran de démarrage', () => {
  test('l’app installée s’ouvre sur Kitzy et sa lanterne, puis l’écran s’efface', async ({
    page,
  }) => {
    await page.addInitScript(installed);
    await page.goto('./');
    const splash = page.locator('#splash');
    await expect(splash).toBeVisible();
    await expect(splash).toHaveAttribute('aria-hidden', 'true');
    await expect(splash.locator('img')).toHaveAttribute('src', /kitzy-lanterne\.webp$/);
    // Il disparaît une fois l'app affichée…
    await expect(splash).toHaveCount(0, { timeout: 5000 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // … et ne revient pas à chaque rechargement.
    await page.reload();
    await expect(page.locator('#splash')).toBeHidden();
  });

  test('pas d’écran de démarrage dans un onglet du navigateur', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('#splash')).toBeHidden();
  });

  test('iPhone : un écran de démarrage par taille d’écran, servi en JPEG', async ({ page }) => {
    await page.goto('./');
    const links = page.locator('link[rel="apple-touch-startup-image"]');
    await expect(links).toHaveCount(8);
    const href = await links.first().getAttribute('href');
    const image = await page.request.get(href!);
    expect(image.headers()['content-type']).toContain('image/jpeg');
  });
});
