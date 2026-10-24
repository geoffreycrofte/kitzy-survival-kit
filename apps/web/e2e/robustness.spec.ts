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

  test('une sauvegarde piégée est refusée sans toucher aux données', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./reglages');
    const backup = {
      app: 'kitzy',
      schemaVersion: 2,
      exportedAt: '2026-10-24T10:00:00.000Z',
      household: null,
      kits: [{ id: 'home', type: 'home', name: 'Maison' }],
      items: [{ ...CORRUPT_ITEM }],
      extras: [],
      bought: [],
      level: 'essential',
    };
    page.on('dialog', (dialog) => void dialog.accept());
    await page.locator('input[type=file]').setInputFiles({
      name: 'piege.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(backup)),
    });
    await expect(page.getByText('ne ressemble pas à une sauvegarde Kitzy')).toBeVisible();
    await page.goto('./foyer');
    await expect(page.getByRole('heading', { level: 1, name: 'Mon foyer' })).toBeVisible();
  });

  test('des données abîmées laissent toujours sauver et repartir', async ({ page }) => {
    await setUpHousehold(page);
    // Écrit directement en base ce qu'aucun import ne laisse plus passer.
    await page.evaluate(
      (item) =>
        new Promise<void>((resolve, reject) => {
          const open = indexedDB.open('kitzy');
          open.onerror = () => reject(open.error);
          open.onsuccess = () => {
            const tx = open.result.transaction('items', 'readwrite');
            tx.objectStore('items').put(item);
            tx.oncomplete = () => {
              open.result.close();
              resolve();
            };
          };
        }),
      CORRUPT_ITEM,
    );
    await page.goto('./');
    const alert = page.getByRole('alert').filter({ hasText: 'n’arrive pas à afficher' });
    await expect(alert).toBeVisible();
    const download = page.waitForEvent('download');
    await alert.getByRole('button', { name: 'Télécharger une sauvegarde' }).click();
    expect((await download).suggestedFilename()).toMatch(/^kitzy-sauvegarde-.*\.json$/);
    page.on('dialog', (dialog) => void dialog.accept());
    await alert.getByRole('button', { name: 'Tout effacer et repartir' }).click();
    await expect(page.getByRole('link', { name: 'Présenter mon foyer' })).toBeVisible();
  });
});

/** Un intervalle de recharge démesuré : les dates calculées sortent du calendrier. */
const CORRUPT_ITEM = {
  id: 'piege',
  kitId: 'home',
  templateId: 'power-bank',
  unit: 'piece',
  lots: [],
  battery: { lastChargedAt: '2026-01-01', intervalDays: 2_000_000_000 },
  updatedAt: '2026-10-24T10:00:00.000Z',
};
