import { expect, test } from '@playwright/test';

test.describe('Installer Kitzy', () => {
  test('le manifeste a une identité stable et se déclare comme app liée', async ({ request }) => {
    const manifest = await (await request.get('./manifest.webmanifest')).json();
    // Identité inchangée depuis la première version (racine du site), l'app démarre dans app/.
    expect(manifest.id).toBe('/');
    expect(manifest.start_url).toBe('/app/');
    expect(manifest.scope).toBe('/app/');
    expect(manifest.related_applications).toEqual([
      { platform: 'webapp', url: expect.stringMatching(/\/manifest\.webmanifest$/) },
    ]);
  });

  test('propose le bouton quand le navigateur le permet', async ({ page }) => {
    await page.goto('./reglages');
    const section = page.getByRole('region', { name: 'Installer Kitzy' });
    await expect(section).toBeVisible();
    // Simule l'événement que Chrome envoie quand l'installation est possible.
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      };
      event.prompt = async () => undefined;
      event.userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(event);
    });
    await section.getByRole('button', { name: 'Installer Kitzy' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Kitzy s’installe.' })).toBeVisible();
  });

  test('dit quand Kitzy est déjà installée sur l’appareil', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'getInstalledRelatedApps', {
        value: async () => [{ platform: 'webapp', url: location.origin + '/manifest.webmanifest' }],
      });
    });
    await page.goto('./reglages');
    await expect(page.getByRole('region', { name: 'Installer Kitzy' })).toContainText(
      'Kitzy est déjà installée sur cet appareil',
    );
  });
});
