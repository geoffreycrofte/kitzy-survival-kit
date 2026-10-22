import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, LOCALES, messagesFor } from '@kitzy/core';
import { initialLocale } from './locale';

export function initI18n(): void {
  void i18n.use(initReactI18next).init({
    resources: Object.fromEntries(
      LOCALES.map((l) => [l.code, { translation: messagesFor(l.code) }]),
    ),
    lng: initialLocale(),
    fallbackLng: DEFAULT_LOCALE,
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}
