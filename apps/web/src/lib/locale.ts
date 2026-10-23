import { useSyncExternalStore } from 'react';
import i18n from 'i18next';
import { DEFAULT_LOCALE, intlLocale, isLocale, pickLocale, type Locale } from '@kitzy/core';
import { setMeta } from '../data/load';

/**
 * Langue de l'interface et des contenus. Par défaut, celle de l'appareil si Kitzy la parle.
 * Le choix est gardé dans le navigateur, et copié dans la base locale pour le service worker
 * (qui écrit les notifications dans la même langue).
 */

export type LocalePref = 'auto' | Locale;

const KEY = 'kitzy.locale';

function readPref(): LocalePref {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'auto' || isLocale(value) ? (value as LocalePref) : 'auto';
  } catch {
    return 'auto';
  }
}

function deviceLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  return pickLocale(navigator.languages?.length ? navigator.languages : [navigator.language]);
}

interface LocaleState {
  pref: LocalePref;
  locale: Locale;
}

let pref = readPref();
let state: LocaleState = { pref, locale: pref === 'auto' ? deviceLocale() : pref };
const listeners = new Set<() => void>();

function apply(): void {
  document.documentElement.lang = state.locale;
  if (i18n.language !== state.locale) void i18n.changeLanguage(state.locale);
  // Pour le service worker ; sans base disponible, les notifications restent en français.
  void setMeta('locale', state.locale).catch(() => undefined);
}

export function initialLocale(): Locale {
  return state.locale;
}

export function initLocale(): void {
  apply();
  window.addEventListener('languagechange', () => {
    if (pref !== 'auto') return;
    state = { pref, locale: deviceLocale() };
    apply();
    listeners.forEach((l) => l());
  });
}

export function setLocalePref(value: LocalePref): void {
  pref = value;
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Stockage indisponible : le choix vaut pour la session.
  }
  state = { pref, locale: value === 'auto' ? deviceLocale() : value };
  apply();
  listeners.forEach((l) => l());
}

/** La langue affichée, hors de React (formats de dates et de nombres). */
export function currentLocale(): Locale {
  return state.locale;
}

export function currentIntl(): string {
  return intlLocale(state.locale);
}

export function useLocale(): LocaleState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}
