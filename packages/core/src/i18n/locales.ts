/**
 * Langues de Kitzy. Une langue n'est proposée qu'une fois entièrement
 * traduite et relue, pour ne jamais mélanger les langues dans l'interface.
 */

export interface LocaleInfo {
  code: 'fr' | 'en' | 'lb' | 'de' | 'pt';
  /** Nom de la langue, écrit dans la langue elle-même. */
  label: string;
  /** Locale utilisée pour les dates et les nombres. */
  intl: string;
  enabled: boolean;
}

export const LOCALES: readonly LocaleInfo[] = [
  { code: 'fr', label: 'Français', intl: 'fr-LU', enabled: true },
  { code: 'en', label: 'English', intl: 'en-GB', enabled: false },
  { code: 'lb', label: 'Lëtzebuergesch', intl: 'lb-LU', enabled: false },
  { code: 'de', label: 'Deutsch', intl: 'de-LU', enabled: false },
  { code: 'pt', label: 'Português', intl: 'pt-PT', enabled: false },
];

export const DEFAULT_LOCALE = 'fr';

export function enabledLocales(): LocaleInfo[] {
  return LOCALES.filter((l) => l.enabled);
}
