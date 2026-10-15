import { expect, test } from '@playwright/test';
import { setUpHousehold } from './helpers';

test.describe('Robustesse', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('la barre du bas reste au-dessus du contenu qui défile', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./');
    await expect(page.getByRole('heading', { name: 'Les prochains jours' })).toBeVisible();
    const nav = page.getByRole('navigation', { name: 'Navigation principale' });
    const box = await nav.boundingBox();
    // Le point au centre de chaque lien de la barre appartient bien à la barre.
    for (const name of ['Terrier', 'Kits', 'Courses']) {
      const link = await nav.getByRole('link', { name }).boundingBox();
      const inside = await page.evaluate(
        ([x, y]) => Boolean(document.elementFromPoint(x!, y!)?.closest('.bottom-nav')),
        [link!.x + link!.width / 2, link!.y + link!.height / 2],
      );
      expect(inside, name).toBe(true);
    }
    expect(box).not.toBeNull();
  });

  test('la base se libère quand l’onglet est mis en pause, puis se rouvre', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./gestes');
    await page.evaluate(() => document.dispatchEvent(new Event('freeze')));
    await page.getByRole('checkbox', { name: 'Installer LU-Alert' }).check();
    await expect(page.getByRole('status').filter({ hasText: 'noté comme fait' })).toBeVisible();
    await page.goto('./');
    await expect(page.getByRole('link', { name: 'Ranger dans ma réserve' })).toBeVisible();
  });

  test('un chargement bloqué s’explique et propose de recharger', async ({ page }) => {
    // Simule une base locale qui ne répond jamais.
    await page.addInitScript(() => {
      const never = () => ({}) as IDBOpenDBRequest;
      Object.defineProperty(indexedDB, 'open', { value: never });
    });
    await page.goto('./kits');
    await expect(page.getByText('Chargement de ton terrier…')).toBeVisible();
    const alert = page.getByRole('alert').filter({ hasText: 'Le chargement prend trop de temps' });
    await expect(alert).toBeVisible({ timeout: 8000 });
    await expect(alert.getByRole('button', { name: 'Recharger Kitzy' })).toBeVisible();
  });
});
