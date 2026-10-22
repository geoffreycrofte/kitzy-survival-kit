/**
 * Langues de Kitzy. Une langue n'est proposée qu'une fois entièrement
 * traduite et relue, pour ne jamais mélanger les langues dans l'interface.
 */

export type Locale = 'fr' | 'en' | 'lb' | 'de' | 'pt';

export interface LocaleInfo {
  code: Locale;
  /** Nom de la langue, écrit dans la langue elle-même. */
  label: string;
  /** Locale utilisée pour les dates et les nombres. */
  intl: string;
  enabled: boolean;
}

export const LOCALES: readonly LocaleInfo[] = [
  { code: 'fr', label: 'Français', intl: 'fr-LU', enabled: true },
  { code: 'en', label: 'English', intl: 'en-GB', enabled: true },
  { code: 'lb', label: 'Lëtzebuergesch', intl: 'lb-LU', enabled: true },
  { code: 'de', label: 'Deutsch', intl: 'de-LU', enabled: true },
  { code: 'pt', label: 'Português', intl: 'pt-PT', enabled: true },
];

export const DEFAULT_LOCALE: Locale = 'fr';

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.some((l) => l.code === value);
}

/** La première langue proposée parmi celles de l'appareil (« de-LU » → « de »), sinon le français. */
export function pickLocale(preferred: readonly string[]): Locale {
  for (const tag of preferred) {
    const code = tag.toLowerCase().split('-')[0];
    const found = enabledLocales().find((l) => l.code === code);
    if (found) return found.code;
  }
  return DEFAULT_LOCALE;
}

export function intlLocale(locale: Locale): string {
  return LOCALES.find((l) => l.code === locale)?.intl ?? 'fr-LU';
}

export function enabledLocales(): LocaleInfo[] {
  return LOCALES.filter((l) => l.enabled);
}
