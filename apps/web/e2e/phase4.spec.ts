import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations, setUpHousehold } from './helpers';

const QUIZ_ANSWERS = [
  /^Rien/,
  /^Le signal d’alerte/,
  /^Me mettre à l’abri au plus vite/,
  /^Allumer la radio ou ouvrir LU-Alert/,
  /^Le niveau violet/,
  /^À la radio/,
  /^Jamais/,
  /^Je vérifie auprès des sources officielles/,
  /^Seulement quand les autorités le demandent/,
  /^Ne pas cliquer/,
];

const SIMULATION_ANSWERS = [
  /^Je regarde LU-Alert/,
  /^Chacun rejoint le point de rendez-vous/,
  /^Lampe frontale/,
  /^Je bois ma réserve/,
  /^Je vérifie à la radio/,
  /^Je frappe chez elle/,
];

async function answer(page: Page, option: RegExp, validate: string) {
  await page.getByRole('radio', { name: option }).check();
  await page.getByRole('button', { name: validate }).click();
}

test.describe('Phase 4 : le côté fun', () => {
  test('les activités s’ouvrent depuis le menu', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page
      .getByRole('dialog', { name: 'Menu' })
      .getByRole('link', { name: /^Activités/ })
      .click();
    await expect(page.getByRole('heading', { level: 1, name: 'Activités' })).toBeFocused();
    for (const name of ['Les rituels', 'En famille', 'S’entraîner']) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
    for (const name of [
      'Rendez-vous du premier lundi',
      'Grand check-up',
      'Soirée conserves',
      'Défi soirée sans électricité',
      'Simulation 72 h',
      'Quiz des bons réflexes',
    ]) {
      await expect(page.getByRole('link', { name })).toBeVisible();
    }
  });

  test('mini-check : trois questions, la recharge notée, un succès', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./mini-check');
    await page
      .getByRole('group', { name: 'La lampe et la radio s’allument ?'.replace(' ?', ' ?') })
      .getByRole('radio', { name: 'Oui' })
      .check();
    await page
      .getByRole('group', { name: /^Les batteries sont chargées/ })
      .getByRole('radio', { name: 'Oui' })
      .check();
    await page
      .getByRole('group', { name: /^Rien n’a été pris/ })
      .getByRole('radio', { name: 'Pas encore' })
      .check();
    await page.getByRole('button', { name: 'C’est fait pour ce mois' }).click();
    const done = page.getByRole('region', { name: /C’est noté/ });
    await expect(done).toBeFocused();
    await expect(done.getByRole('link', { name: /Mets tes kits à jour/ })).toBeVisible();
    await expect(
      page.getByRole('status').filter({ hasText: /Succès débloqué\s! Rendez-vous de midi/ }),
    ).toBeVisible();
    await page.goto('./activites');
    await expect(page.getByText(/^Fait le /)).toHaveCount(1);
  });

  test('quiz : une question à la fois, expliquée, jusqu’au sans-faute', async ({ page }) => {
    await page.goto('./quiz');
    await page.getByRole('button', { name: 'Commencer' }).click();
    await expect(page.getByRole('group', { name: /^Premier lundi du mois/ })).toBeFocused();
    // Une mauvaise réponse : la bonne est donnée et expliquée.
    await answer(page, /^Je me mets à l’abri tout de suite/, 'Valider');
    const feedback = page.locator('.quiz__feedback');
    await expect(feedback).toBeFocused();
    await expect(feedback).toContainText('Pas tout à fait. La bonne réponse');
    await expect(
      feedback.getByRole('link', { name: 'En savoir plus dans le guide' }),
    ).toHaveAttribute('href', /\/guide\/sirenes$/);
    await expect(page.getByText('(bonne réponse)')).toBeVisible();
    await page.getByRole('button', { name: 'Question suivante' }).click();

    for (const option of QUIZ_ANSWERS.slice(1)) {
      await answer(page, option, 'Valider');
      await expect(page.getByText('Bonne réponse !'.replace(' !', ' !'))).toBeVisible();
      await page.getByRole('button', { name: /Question suivante|Voir mon score/ }).click();
    }
    await expect(page.getByRole('region', { name: 'Ton score' })).toContainText('9 sur 10');

    // Deuxième essai : sans faute.
    await page.getByRole('button', { name: 'Recommencer le quiz' }).click();
    for (const option of QUIZ_ANSWERS) {
      await answer(page, option, 'Valider');
      await page.getByRole('button', { name: /Question suivante|Voir mon score/ }).click();
    }
    await expect(page.getByRole('region', { name: 'Ton score' })).toContainText('10 sur 10');
    await expect(page.getByRole('status').filter({ hasText: /Sans faute/ })).toBeVisible();
  });

  test('simulation 72 h : six choix, puis ce qui aurait manqué part en courses', async ({
    page,
  }) => {
    await setUpHousehold(page);
    await page.goto('./simulation');
    await page.getByRole('button', { name: 'Commencer' }).click();
    await expect(page.getByText('Jour 1, 10 h')).toBeVisible();
    for (const [i, option] of SIMULATION_ANSWERS.entries()) {
      await answer(page, option, 'Valider mon choix');
      await expect(page.getByText('Bon réflexe.')).toBeVisible();
      if (i === 0) {
        // Chez toi : rien n'est encore prêt, chaque manque mène à sa page.
        await expect(
          page.getByRole('link', { name: 'Une radio à piles ou à manivelle' }),
        ).toBeVisible();
      }
      await page.getByRole('button', { name: /Étape suivante|Voir le bilan/ }).click();
    }
    await expect(page.getByRole('heading', { level: 2, name: 'Le courant revient' })).toBeFocused();
    await expect(page.getByText('6 bons réflexes sur 6')).toBeVisible();
    await page
      .getByRole('button', { name: 'Ajouter les objets manquants à ma liste de courses' })
      .click();
    await expect(page.getByRole('status').filter({ hasText: 'Ajouté à ta liste' })).toBeVisible();
    await page.goto('./courses');
    await expect(page.getByText('Une radio à piles ou à manivelle')).toBeVisible();
  });

  test('soirée conserves et défi sans électricité', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./recettes');
    await page.getByRole('link', { name: 'Chili express du terrier' }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Chili express du terrier' }),
    ).toBeFocused();
    await expect(page.getByRole('heading', { level: 2, name: 'Étapes' })).toBeVisible();
    await page.getByRole('button', { name: 'On l’a cuisinée !'.replace(' !', ' !') }).click();
    await expect(page.getByRole('region', { name: /C’est noté/ })).toBeFocused();

    await page.goto('./defi');
    await page.getByRole('checkbox', { name: /S’éclairer seulement/ }).check();
    await page
      .getByLabel('Qu’est-ce qui nous a manqué ?'.replace(' ?', ' ?'))
      .fill('Bougies chauffe-plat\n\nJeu de cartes\n');
    await page.getByRole('button', { name: 'Terminer le défi' }).click();
    const done = page.getByRole('region', { name: /C’est noté/ });
    await expect(done).toContainText('2 articles ajoutés');
    await done.getByRole('link', { name: 'Voir ma liste de courses' }).click();
    await expect(page.getByText('Bougies chauffe-plat')).toBeVisible();
    await expect(page.getByText('Jeu de cartes')).toBeVisible();
  });

  test('l’accueil propose le rituel du moment', async ({ page }) => {
    // Premier lundi de décembre, loin du changement d'heure : le mini-check du mois.
    await page.clock.setFixedTime(new Date('2026-12-07T12:30:00'));
    await setUpHousehold(page);
    await page.goto('./');
    const moment = page.getByRole('region', { name: 'Un moment pour le terrier' });
    await expect(moment).toContainText('Les sirènes ont sonné ce lundi');
    await moment.getByRole('link', { name: 'Faire le mini-check' }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Rendez-vous du premier lundi' }),
    ).toBeFocused();
  });

  test('les paliers sur la page des succès', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./succes');
    const tiers = page.getByRole('region', { name: 'Ton palier' });
    await expect(tiers).toContainText(/Palier 1 sur 5\s: Débutant/);
    await expect(tiers.locator('[aria-current="step"]')).toContainText('Débutant');
    await expect(page.getByRole('heading', { level: 2, name: 'Activités' })).toBeVisible();
  });

  test('aucune erreur axe sur les activités, dans les deux thèmes', async ({ page }) => {
    test.slow();
    await setUpHousehold(page);
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      for (const path of [
        './activites',
        './mini-check',
        './check-up',
        './recettes',
        './recettes/chili-express',
        './defi',
        './succes',
      ]) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expectNoAxeViolations(page);
      }
      // Une question validée, avec son retour.
      await page.goto('./quiz');
      await page.getByRole('button', { name: 'Commencer' }).click();
      await answer(page, /^Je me mets à l’abri/, 'Valider');
      await expectNoAxeViolations(page);
      // Une étape de simulation et son « Et chez toi ? ».
      await page.goto('./simulation');
      await page.getByRole('button', { name: 'Commencer' }).click();
      await answer(page, SIMULATION_ANSWERS[0]!, 'Valider mon choix');
      await expectNoAxeViolations(page);
    }
  });
});
