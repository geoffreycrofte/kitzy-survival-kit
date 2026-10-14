import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setUpHousehold } from './helpers';

test.describe('Phase 2 : plan, gestes, scan, notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plan d’urgence pré-rempli, enregistré automatiquement et imprimable', async ({ page }) => {
    await setUpHousehold(page);
    const nav = page.getByRole('navigation', { name: 'Navigation principale' });
    await nav.getByRole('link', { name: 'Mon plan' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Mon plan d’urgence' })).toBeFocused();
    await page.getByRole('link', { name: 'Commencer mon plan' }).click();

    // Le foyer saisi à l'accueil pré-remplit le plan : 2 adultes, 1 enfant, 1 chat.
    await expect(page.getByRole('heading', { level: 1, name: 'Les habitants' })).toBeFocused();
    await expect(page.getByLabel('Adultes')).toHaveValue('2');
    await expect(page.getByLabel('Enfants')).toHaveValue('1');
    await expect(page.getByRole('group', { name: /^Personne \d$/ })).toHaveCount(3);
    await expect(page.getByRole('group', { name: 'Animal 1' }).getByLabel('Espèce')).toHaveValue(
      'Chat',
    );

    // Les champs de santé n'apparaissent qu'avec le consentement.
    await expect(page.getByLabel('Groupe sanguin')).toHaveCount(0);
    await page.getByLabel(/J’accepte que Kitzy garde/).check();
    await expect(page.getByLabel('Groupe sanguin')).toHaveCount(3);

    const owner = page.getByRole('group', { name: 'Ce plan appartient à' });
    await owner.getByLabel('Nom et prénom').fill('Famille Muller');
    const first = page.getByRole('group', { name: 'Personne 1' });
    await first.getByLabel('Prénom').fill('Léa');
    await first.getByLabel('Allergies et intolérances').fill('Pénicilline');

    await page.getByRole('link', { name: 'Étape suivante' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'La maison' })).toBeFocused();
    await page
      .getByRole('group', { name: 'Le robinet d’arrivée d’eau' })
      .getByLabel('Emplacement')
      .fill('Cave, à gauche de la chaudière');

    // Rechargement : tout est resté.
    await page.waitForTimeout(800);
    await page.reload();
    await expect(
      page.getByRole('group', { name: 'Le robinet d’arrivée d’eau' }).getByLabel('Emplacement'),
    ).toHaveValue('Cave, à gauche de la chaudière');

    await page.goto('./plan');
    await expect(page.getByRole('listitem').filter({ hasText: 'Les habitants' })).toContainText(
      'Commencé',
    );

    await page.getByRole('link', { name: 'Voir et imprimer mon plan' }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Mon plan personnel d’urgence' }),
    ).toBeVisible();
    await expect(page.getByText('Famille Muller')).toBeVisible();
    await expect(page.getByText('Pénicilline')).toBeVisible();
    await expect(page.getByText('Ce plan contient des informations de santé')).toBeVisible();

    // Retrait du consentement : les données de santé sont effacées.
    await page.goto('./plan/foyer');
    page.once('dialog', (dialog) => void dialog.accept());
    await page.getByLabel(/J’accepte que Kitzy garde/).uncheck();
    await expect(
      page.getByRole('status').filter({ hasText: 'Informations de santé effacées.' }),
    ).toBeVisible();
    await page.waitForTimeout(800);
    await page.goto('./plan/imprimer');
    await expect(page.getByText('Pénicilline')).toHaveCount(0);
    await expect(page.getByText('Léa')).toBeVisible();
  });

  test('gestes cochés et conservés', async ({ page }) => {
    await page.goto('./gestes');
    await expect(page.getByText('0 sur 16 faits')).toBeVisible();
    await page.getByRole('checkbox', { name: 'Installer LU-Alert' }).check();
    await expect(page.getByRole('status').filter({ hasText: 'noté comme fait' })).toBeVisible();
    await expect(page.getByText('1 sur 16 faits')).toBeVisible();
    await page.reload();
    await expect(page.getByRole('checkbox', { name: 'Installer LU-Alert' })).toBeChecked();
  });

  test('scan d’un code-barres saisi à la main, puis reconnu', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./kits/home');
    await page.getByRole('button', { name: 'Scanner un code-barres' }).click();
    const dialog = page.getByRole('dialog', { name: 'Scanner un code-barres' });
    await expect(dialog).toBeVisible();
    // Sans caméra, la saisie manuelle reste possible.
    await expect(dialog.getByRole('status')).toContainText(/caméra/);
    await dialog.getByLabel('Ou tape le code').fill('12');
    await dialog.getByRole('button', { name: 'Valider le code' }).click();
    await expect(dialog.getByLabel('Ou tape le code')).toHaveAccessibleDescription(
      /ne ressemble pas/,
    );
    await dialog.getByLabel('Ou tape le code').fill('5 410000 123457');
    await dialog.getByRole('button', { name: 'Valider le code' }).click();

    await expect(
      page.getByRole('heading', { level: 1, name: 'Nouveau code-barres' }),
    ).toBeFocused();
    await page.getByLabel('Chercher un article').fill('eau potable');
    await page.getByRole('button', { name: /Eau potable en bouteille/ }).click();

    // Arrivée sur l'article, focus dans la quantité.
    await expect(page.getByText('Code-barres 5410000123457 reconnu')).toBeVisible();
    await expect(page.getByLabel(/Quantité/).first()).toBeFocused();

    // Deuxième scan : directement sur l'article.
    await page.goto('./kits/home');
    await page.getByRole('button', { name: 'Scanner un code-barres' }).click();
    await page.getByLabel('Ou tape le code').fill('5410000123457');
    await page.getByRole('button', { name: 'Valider le code' }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: /Eau potable en bouteille/ }),
    ).toBeVisible();
    await expect(page.getByLabel(/Quantité/).first()).toBeFocused();
  });

  test('notifications : activation et notification d’essai', async ({ page, context }) => {
    await context.grantPermissions(['notifications']);
    await setUpHousehold(page);
    await page.goto('./reglages');
    // Le service worker doit être actif pour afficher une notification.
    await page.evaluate(() => navigator.serviceWorker.ready);
    const toggle = page.getByRole('checkbox', { name: 'Me prévenir sur cet appareil' });
    await toggle.check();
    await expect(toggle).toBeChecked();
    await expect(page.getByRole('status').filter({ hasText: 'C’est activé' })).toBeVisible();
    // App non installée : vérification à l'ouverture seulement, et on le dit.
    await expect(toggle).toHaveAccessibleDescription(/C’est activé/);
    await page.getByRole('button', { name: 'Envoyer une notification d’essai' }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Notification d’essai envoyée.' }),
    ).toBeVisible();
    await toggle.uncheck();
    await expect(toggle).not.toBeChecked();
  });

  test('la sauvegarde contient le plan et les gestes', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./gestes');
    await page.getByRole('checkbox', { name: 'Installer LU-Alert' }).check();
    await expect(page.getByRole('status').filter({ hasText: 'noté comme fait' })).toBeVisible();
    await page.goto('./plan/foyer');
    await page
      .getByRole('group', { name: 'Ce plan appartient à' })
      .getByLabel('Nom et prénom')
      .fill('Famille Muller');
    await page.waitForTimeout(800);
    await page.goto('./reglages');
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Télécharger une sauvegarde' }).click();
    const file = await download;
    const json = JSON.parse(
      await (await file.createReadStream()).toArray().then((c) => Buffer.concat(c).toString()),
    );
    expect(json.schemaVersion).toBe(2);
    expect(json.plan.owner.name).toBe('Famille Muller');
    expect(Object.keys(json.tasks)).toEqual(['lu-alert']);
  });

  test('aucune erreur axe sur les écrans de la phase 2, dans les deux thèmes', async ({ page }) => {
    // Une vingtaine d'analyses axe : plus long que les autres tests.
    test.slow();
    await setUpHousehold(page);
    await page.goto('./plan/foyer');
    await page.getByLabel(/J’accepte que Kitzy garde/).check();
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      for (const path of [
        './plan',
        './plan/foyer',
        './plan/maison',
        './plan/quartier',
        './plan/urgence',
        './plan/numeros',
        './plan/imprimer',
        './gestes',
        './kits/home/scan/5410000123457',
        './reglages',
      ]) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expectNoAxeViolations(page);
      }
      await page.goto('./kits/home');
      await page.getByRole('button', { name: 'Scanner un code-barres' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expectNoAxeViolations(page);
    }
  });
});
