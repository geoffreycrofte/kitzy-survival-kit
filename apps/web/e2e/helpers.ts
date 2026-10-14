import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

export async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(
    results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`),
  ).toEqual([]);
}

export async function setUpHousehold(page: Page) {
  await page.goto('./');
  await page.getByRole('link', { name: 'Présenter mon foyer' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Mon foyer' })).toBeFocused();
  // 1 adulte par défaut : on en ajoute un, plus un enfant et un chat.
  await page.getByRole('button', { name: 'Ajouter : Adultes' }).click();
  await page.getByRole('button', { name: 'Ajouter : Enfants' }).click();
  await page.getByRole('button', { name: 'Ajouter : Chats' }).click();
  await page.getByRole('button', { name: 'Enregistrer mon foyer' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Foyer enregistré.' })).toBeVisible();
}
