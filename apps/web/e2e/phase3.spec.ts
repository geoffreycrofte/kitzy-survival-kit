import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setUpHousehold } from './helpers';

test.describe('Phase 3 : conseils d’achat, transparence, hiérarchie', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('conseils d’achat par palier, sans prix, liens explicites', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./kits/home/headlamp');
    const buy = page.getByRole('region', { name: 'Où l’acheter' });
    await expect(buy).toBeVisible();

    // Le palier est dit en toutes lettres ; le symbole € est décoratif.
    await expect(buy.getByRole('heading', { level: 3, name: 'Budget essentiel' })).toBeVisible();
    await expect(buy.getByRole('heading', { level: 3, name: 'Budget équilibré' })).toBeVisible();

    const link = buy.getByRole('link', {
      name: /Chercher «\sLampe frontale à piles AAA, 200 lumens environ\s» sur Amazon\.fr \(nouvelle fenêtre\)/,
    });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('href', /^https:\/\/www\.amazon\.fr\/s\?k=/);
    // Sans identifiant configuré au build : lien direct, non affilié, et aucune mention trompeuse.
    await expect(link).not.toHaveAttribute('href', /tag=/);
    await expect(buy).not.toContainText('Partenaire Amazon');
    await expect(buy).not.toContainText(/\d+[,.]\d{2}/);

    await buy.getByRole('link', { name: 'Comment Kitzy choisit ces conseils' }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Liens d’achat et transparence' }),
    ).toBeFocused();
    await page.getByRole('link', { name: 'Lire la politique de confidentialité' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Confidentialité' })).toBeFocused();
    // Chaque bloc dit où vont les données, et le contact mène au projet.
    await expect(page.locator('.privacy__where')).toHaveCount(8);
    await expect(page.getByRole('region', { name: 'Données de santé et matricule' })).toContainText(
      'Uniquement sur ton appareil',
    );
    await expect(
      page.getByRole('link', { name: /Écris-nous sur la page du projet sur GitHub/ }),
    ).toHaveAttribute('href', 'https://github.com/geoffreycrofte/survival-kit/issues');
  });

  test('pas de bloc d’achat pour ce qui ne s’achète pas', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./kits/home/cash');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Où l’acheter' })).toHaveCount(0);
  });

  test('le guide découpe la page en sections et met les termes en avant', async ({ page }) => {
    await page.goto('./guide/coupure-electricite');
    await expect(page.locator('.prose-section')).toHaveCount(4);
    await expect(page.locator('.prose-list strong').first()).toHaveText('Logement');
    await expect(page.locator('.story__day').first()).toHaveText('Jour 1.');
  });

  test('courses : nom et quantité, puis où ranger, kit par kit', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./courses');
    const water = page.getByRole('listitem').filter({ hasText: 'Eau potable en bouteille' });
    await expect(
      water.getByRole('checkbox', { name: /^Eau potable en bouteille, \d/ }),
    ).toBeVisible();
    const places = water.getByRole('list', { name: 'Où le ranger' }).getByRole('link');
    // 2 adultes, 1 enfant, 1 chat : la maison et trois sacs.
    await expect(places).toHaveCount(4);
    await expect(places.first()).toHaveAccessibleName(
      /^Ranger 27,9\sL de «\sEau potable en bouteille\s» dans Réserve maison$/,
    );
    // Une fois acheté, la liste des destinations devient l'action à faire.
    await water.getByRole('checkbox').check();
    const storeNow = water.getByRole('list', { name: /Acheté\s! Range-le pour suivre ses dates/ });
    await expect(storeNow).toBeVisible();
    await storeNow.getByRole('link').nth(1).click();
    await expect(page).toHaveURL(/\/kits\/bag-1\/drinking-water$/);
  });

  test('les gestes sont regroupés par thème', async ({ page }) => {
    await page.goto('./gestes');
    for (const name of ['Être alerté', 'Chez moi', 'Avec mes proches']) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
    await expect(
      page.getByRole('region', { name: 'Être alerté' }).getByRole('checkbox'),
    ).toHaveCount(4);
  });

  test('aucune erreur axe sur les écrans de la phase 3, dans les deux thèmes', async ({ page }) => {
    test.slow();
    await setUpHousehold(page);
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      for (const path of [
        './',
        './kits/home/headlamp',
        './kits/home/crank-radio',
        './transparence',
        './confidentialite',
        './guide/coupure-electricite',
        './gestes',
        './courses',
      ]) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expectNoAxeViolations(page);
      }
    }
  });
});
