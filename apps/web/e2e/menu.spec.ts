import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setUpHousehold } from './helpers';

test.describe('Tableau de bord, menu et succès', () => {
  test('l’accueil montre où j’en suis : courses, plan, gestes', async ({ page }) => {
    await setUpHousehold(page);
    // Premier succès, annoncé dans un bandeau qui ne masque rien.
    await expect(
      page.getByRole('status').filter({ hasText: /Succès débloqué\s! Bienvenue au terrier/ }),
    ).toBeVisible();
    await page.goto('./');
    const dash = page.getByRole('region', { name: 'Où j’en suis' });
    await expect(dash.getByRole('meter')).toHaveCount(3);
    await expect(dash.getByRole('meter', { name: /^Courses/ })).toHaveAttribute(
      'aria-valuetext',
      /^0 sur \d+ articles réunis$/,
    );
    await expect(dash.getByRole('meter', { name: /^Mes gestes/ })).toHaveAttribute(
      'aria-valuetext',
      '0 sur 16 faits',
    );
    await dash.getByRole('link', { name: 'Mes gestes' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Mes gestes' })).toBeFocused();
    await page.getByRole('checkbox', { name: 'Installer LU-Alert' }).check();
    await expect(
      page.getByRole('status').filter({ hasText: /Succès débloqué\s! Premier geste/ }),
    ).toBeVisible();
    await page.goto('./');
    await expect(dash.getByRole('meter', { name: /^Mes gestes/ })).toHaveAttribute(
      'aria-valuetext',
      '1 sur 16 faits',
    );
    await expect(dash.getByRole('link', { name: /Mes succès\s: 2 sur 18/ })).toBeVisible();
  });

  test('le menu plein écran : thème, pages, Échap rend le focus', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    const button = page.getByRole('button', { name: 'Menu', exact: true });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    const menu = page.getByRole('dialog', { name: 'Menu' });
    await expect(menu).toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    for (const name of [/^Succès/, /^Guide/, /^Mes gestes/]) {
      await expect(menu.getByRole('link', { name })).toBeVisible();
    }
    // Réglages, partage et sauvegarde : des icônes, avec leur nom pour les lecteurs d'écran.
    await expect(menu.getByRole('link', { name: 'Réglages', exact: true })).toBeVisible();
    await expect(menu.getByRole('button', { name: 'Partager Kitzy', exact: true })).toBeVisible();
    await expect(
      menu.getByRole('link', { name: 'Sauvegarde et données', exact: true }),
    ).toBeVisible();
    await expectNoAxeViolations(page);
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();

    await button.click();
    await menu.getByRole('link', { name: /^Guide/ }).click();
    await expect(menu).toBeHidden();
    await expect(page.getByRole('heading', { level: 1, name: 'Guide' })).toBeFocused();
    await expect(button).toHaveClass(/bottom-nav__link--active/);

    await button.click();
    await menu.getByRole('link', { name: 'Sauvegarde et données', exact: true }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Sauvegarde et données' }),
    ).toBeFocused();
    await expect(page.getByRole('region', { name: 'Protéger mon plan' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Mes données', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tout effacer' })).toBeVisible();
  });

  test('faire un don depuis le menu ; le nom de l’app seulement sur l’accueil', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await expect(page.getByRole('link', { name: 'Kitzy, accueil' })).toBeVisible();
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const menu = page.getByRole('dialog', { name: 'Menu' });
    const donate = menu.getByRole('button', { name: 'Faire un don' });
    await donate.click();
    const drawer = page.getByRole('dialog', { name: 'Faire un don' });
    await expect(drawer).toBeFocused();
    await expect(drawer.getByText(/financer ses prochaines évolutions/)).toBeVisible();
    await expect(drawer.getByRole('link', { name: /PayPal/ })).toHaveAttribute(
      'href',
      /paypal\.me/,
    );
    await expect(drawer.getByRole('link', { name: /Revolut/ })).toHaveAttribute(
      'href',
      /revolut\.me/,
    );
    await expectNoAxeViolations(page);
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(donate).toBeFocused();

    await page.keyboard.press('Escape');
    await page.goto('./guide');
    await expect(page.getByRole('heading', { level: 1, name: 'Guide' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Kitzy, accueil' })).toHaveCount(0);
  });

  test('la page des succès : acquis datés, les autres disent comment faire', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./succes');
    await expect(page.getByRole('heading', { level: 1, name: 'Mes succès' })).toBeVisible();
    await expect(page.getByRole('meter', { name: 'Mes succès' })).toHaveAttribute(
      'aria-valuetext',
      '1 sur 18 débloqués',
    );
    const welcome = page.getByRole('listitem').filter({ hasText: 'Bienvenue au terrier' });
    await expect(welcome).toContainText('Débloqué le');
    const water = page.getByRole('listitem').filter({ hasText: 'Source fraîche' });
    await expect(water).toContainText('À débloquer');
    await expect(water).toContainText('Réunir toute l’eau de la réserve maison.');
  });

  test('gestes : les liens d’action sont regroupés et disent où ils mènent', async ({ page }) => {
    await page.goto('./gestes');
    const card = page.getByRole('listitem').filter({ hasText: 'Installer LU-Alert' });
    const actions = card.getByRole('list', { name: 'Pour passer à l’action' });
    await expect(actions.getByRole('link')).toHaveCount(2);
    await expect(
      actions.getByRole('link', { name: 'Lire le guide : Installer LU-Alert' }),
    ).toBeVisible();
    await expect(
      actions.getByRole('link', { name: /Ouvrir le site\s: Installer LU-Alert, lu-alert\.lu/ }),
    ).toHaveText('lu-alert.lu');
  });

  test('réglages : des groupes titrés, avec un sommaire', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./reglages');
    const toc = page.getByRole('navigation', { name: 'Sur cette page' });
    const groups = ['Affichage', 'Kits et rappels', 'Cet appareil', 'Kitzy'];
    for (const name of groups) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
      await expect(toc.getByRole('link', { name })).toBeVisible();
    }
    await expect(
      page
        .getByRole('region', { name: 'Kits et rappels' })
        .getByRole('group', { name: 'Niveau du kit' }),
    ).toBeVisible();
    await toc.getByRole('link', { name: 'Kitzy' }).click();
    await expect(page.getByRole('heading', { level: 3, name: 'Soutenir Kitzy' })).toBeInViewport();
  });

  test('aucune erreur axe sur les nouveaux écrans, dans les deux thèmes', async ({ page }) => {
    test.slow();
    await setUpHousehold(page);
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      for (const path of ['./', './succes', './gestes', './reglages']) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expectNoAxeViolations(page);
      }
    }
  });
});
