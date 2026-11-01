import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './helpers';

test.describe('Pages publiques : la liste du kit, les fiches, le guide', () => {
  test('la page d’accueil mène à la liste, la liste à la fiche d’un article', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Voir la liste complète du kit' }).click();
    await expect(page).toHaveURL(/\/kit\/$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'La liste du kit d’urgence 72 heures' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Eau' })).toBeVisible();

    await page.getByRole('link', { name: 'Lampe frontale', exact: true }).click();
    await expect(page).toHaveURL(/\/kit\/headlamp\/$/);
    await expect(page).toHaveTitle(
      'Lampe frontale : bien le choisir pour ton kit d’urgence | Kitzy',
    );
    await expect(page.getByRole('heading', { level: 2, name: 'Combien en prévoir' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Où l’acheter' })).toBeVisible();
    // Liens marchands : nouvelle fenêtre annoncée, jamais de suivi de la page d'origine.
    const offer = page.getByRole('link', { name: /sur Amazon\.fr \(nouvelle fenêtre\)$/ }).first();
    await expect(offer).toHaveAttribute('target', '_blank');
    await expect(offer).toHaveAttribute('rel', /noopener noreferrer/);
  });

  test('une fiche se lit dans chaque langue, reliée à ses traductions', async ({ page }) => {
    await page.goto('/de/kit/headlamp/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stirnlampe');
    const head = page.locator('head');
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://kitzy.lu/de/kit/headlamp/',
    );
    await expect(head.locator('link[hreflang="fr"]')).toHaveAttribute(
      'href',
      'https://kitzy.lu/kit/headlamp/',
    );
    // Le menu des langues mène à la même fiche, pas à la page d'accueil.
    await expect(page.locator('[data-locale="pt"]')).toHaveAttribute('href', '/pt/kit/headlamp/');
  });

  test('le guide : la liste des pages et une page complète', async ({ page }) => {
    await page.goto('/guide/');
    await page.getByRole('link', { name: 'Grande coupure d’électricité' }).click();
    await expect(page).toHaveURL(/\/guide\/coupure-electricite\/$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Grande coupure d’électricité' }),
    ).toBeVisible();
    await expect(page.getByText(/Lëtz prepare!, Gouvernement du Grand-Duché/)).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Fil d’Ariane' })).toContainText('Le guide');
  });

  test('les recettes : la liste, une recette et les articles du kit qu’elle utilise', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Les recettes' }).click();
    await expect(page).toHaveURL(/\/recettes\/$/);
    await page.getByRole('link', { name: 'Chili express du terrier' }).click();
    await expect(page).toHaveURL(/\/recettes\/chili-express\/$/);
    // Photo libre : créditée sous l'image, avec un lien vers sa licence.
    await expect(page.locator('.recipe-photo figcaption')).toContainText('Photo :');
    await expect(page.locator('.recipe-photo a[rel~="license"]')).toHaveText('CC0');
    await expect(page.getByRole('heading', { level: 2, name: 'Ingrédients' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Étapes' })).toBeVisible();
    // Données structurées « Recipe », pour les résultats de recherche.
    const data = await page.locator('script[type="application/ld+json"]').textContent();
    expect(
      JSON.parse(data ?? '{}')['@graph'].map((n: { '@type': string }) => n['@type']),
    ).toContain('Recipe');
    await page
      .getByRole('link', { name: /^Dans le kit :/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/kit\/#cat-food$/);
  });

  test('le plan du site liste les pages publiques dans toutes les langues', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    for (const url of [
      'https://kitzy.lu/kit/',
      'https://kitzy.lu/en/kit/headlamp/',
      'https://kitzy.lu/pt/guide/sirenes/',
      'https://kitzy.lu/de/recettes/chili-express/',
    ]) {
      expect(sitemap).toContain(`<loc>${url}</loc>`);
    }
  });

  for (const path of [
    '/kit/',
    '/kit/headlamp/',
    '/guide/coupure-electricite/',
    '/recettes/chili-express/',
  ]) {
    for (const scheme of ['dark', 'light'] as const) {
      test(`aucune erreur axe : ${path} (${scheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expectNoAxeViolations(page);
      });
    }
  }
});
