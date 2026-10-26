/** Liens externes fixes de l'app, surveillés comme les autres. */
export const DONATION_LINKS = {
  paypal: 'https://paypal.me/Crofte',
  revolut: 'https://revolut.me/crofte?note=Donation%20Kitzy.lu',
} as const;

/** Adresse publique du site : c'est elle qu'on partage, et que le QR code ouvre. */
export const SITE_URL = 'https://kitzy.lu/';

/** Image de partage d'une langue (dans `og/`) : le français garde le nom d'origine. */
export function ogImageName(locale: string): string {
  return locale === 'fr' ? 'kitzy-og.png' : `kitzy-og-${locale}.png`;
}

/** Questions et remarques : les discussions du dépôt public. */
export const PROJECT_ISSUES_URL = 'https://github.com/geoffreycrofte/kitzy-survival-kit/issues';
