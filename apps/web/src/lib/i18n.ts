import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, fr } from '@kitzy/core';

export function initI18n(): void {
  void i18n.use(initReactI18next).init({
    resources: { fr: { translation: fr } },
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}
