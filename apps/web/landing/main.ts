/**
 * Page de présentation de Kitzy (kitzy.lu). Statique et légère :
 * - textes dans la langue choisie, la même que dans l'app (clé `kitzy.locale`) ;
 * - thème et animations réglés comme dans l'app (clés `kitzy.theme`, `kitzy.motion`) ;
 * - installation : bouton quand le navigateur le propose, sinon les étapes de l'appareil.
 */
import '@fontsource/young-serif/400.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/600.css';
import '@fontsource/figtree/700.css';
import './landing.css';
import { LANDING, isLocale, pickLocale, themeToCssVars, themes, type Locale } from '@kitzy/core';

const root = document.documentElement;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/* ---------- Thème et animations ---------- */

function applyTheme(): void {
  const pref = read('kitzy.theme');
  const light = matchMedia('(prefers-color-scheme: light)').matches;
  const theme = pref === 'clair' || (pref !== 'sombre' && light) ? 'clair' : 'sombre';
  root.dataset.theme = theme;
  for (const [name, value] of Object.entries(themeToCssVars(themes[theme]))) {
    root.style.setProperty(name, value);
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themes[theme].bg);
  const motion = read('kitzy.motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.dataset.motion = motion === 'on' || (motion !== 'off' && !reduced) ? 'full' : 'reduced';
}

/* ---------- Langue ---------- */

function currentLocale(): Locale {
  const pref = read('kitzy.locale');
  if (isLocale(pref)) return pref;
  return pickLocale(navigator.languages?.length ? navigator.languages : [navigator.language]);
}

function lookup(texts: unknown, path: string): string | undefined {
  let value: unknown = texts;
  for (const part of path.split('.')) {
    if (value === null || typeof value !== 'object') return undefined;
    value = (value as Record<string, unknown>)[part];
  }
  return typeof value === 'string' ? value : undefined;
}

function applyLocale(locale: Locale): void {
  const texts = LANDING[locale];
  root.lang = locale;
  for (const el of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    const text = lookup(texts, el.dataset.i18n ?? '');
    if (text !== undefined) el.textContent = text;
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-i18n-content]')) {
    const text = lookup(texts, el.dataset.i18nContent ?? '');
    if (text !== undefined) el.setAttribute('content', text);
  }
  const select = document.querySelector<HTMLSelectElement>('#lang');
  if (select) select.value = locale;
}

function initLanguage(): void {
  applyLocale(currentLocale());
  document.querySelector<HTMLSelectElement>('#lang')?.addEventListener('change', (event) => {
    const value = (event.target as HTMLSelectElement).value;
    if (!isLocale(value)) return;
    try {
      // Même clé que l'app : la langue choisie ici suit dans Kitzy.
      localStorage.setItem('kitzy.locale', value);
    } catch {
      // Stockage indisponible : la langue vaut pour cette page.
    }
    applyLocale(value);
  });
}

/* ---------- Installation ---------- */

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function platform(): 'android' | 'ios' | 'desktop' {
  const ua = navigator.userAgent;
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ) {
    return 'ios';
  }
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

function initInstall(): void {
  // L'appareil de la personne passe en premier, signalé en toutes lettres.
  const mine = platform();
  const list = document.querySelector('.platforms');
  const card = document.querySelector<HTMLElement>(`.platform[data-platform="${mine}"]`);
  if (list && card) {
    card.classList.add('platform--yours');
    list.prepend(card);
  }

  const button = document.querySelector<HTMLButtonElement>('#install-now');
  const state = document.querySelector<HTMLElement>('#install-state');
  let deferred: InstallPromptEvent | null = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferred = event as InstallPromptEvent;
    if (button) button.hidden = false;
  });
  window.addEventListener('appinstalled', () => {
    if (button) button.hidden = true;
    if (state) state.textContent = LANDING[currentLocale()].install.installed;
  });
  button?.addEventListener('click', async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    button.hidden = true;
  });
}

applyTheme();
initLanguage();
initInstall();
matchMedia('(prefers-color-scheme: light)').addEventListener('change', applyTheme);
