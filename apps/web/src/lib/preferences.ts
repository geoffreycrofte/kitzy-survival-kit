import { useSyncExternalStore } from 'react';
import { themes, themeToCssVars, type ThemeName } from '@kitzy/core';

/**
 * Préférences d'affichage : thème et animations d'ambiance.
 * Stockées dans le navigateur ; tout fonctionne aussi si le stockage est bloqué.
 */

export type ThemePref = 'system' | ThemeName;
export type MotionPref = 'auto' | 'on' | 'off';

export interface Preferences {
  themePref: ThemePref;
  motionPref: MotionPref;
  /** Thème réellement affiché */
  theme: ThemeName;
  /** Animations d'ambiance actives */
  motion: boolean;
}

const THEME_KEY = 'kitzy.theme';
const MOTION_KEY = 'kitzy.motion';

function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Stockage indisponible (navigation privée…) : le choix vaut pour la session.
  }
}

const media = (query: string) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query)
    : null;

const lightQuery = media('(prefers-color-scheme: light)');
const reducedQuery = media('(prefers-reduced-motion: reduce)');

let themePref: ThemePref = read(THEME_KEY, ['system', 'sombre', 'clair'], 'system');
let motionPref: MotionPref = read(MOTION_KEY, ['auto', 'on', 'off'], 'auto');
let snapshot = compute();
const listeners = new Set<() => void>();

function compute(): Preferences {
  // La Veillée est sombre par défaut ; le thème clair suit la préférence du système.
  const theme: ThemeName =
    themePref === 'system' ? (lightQuery?.matches ? 'clair' : 'sombre') : themePref;
  const motion = motionPref === 'on' || (motionPref === 'auto' && !reducedQuery?.matches);
  return { themePref, motionPref, theme, motion };
}

function apply(): void {
  const root = document.documentElement;
  root.dataset.theme = snapshot.theme;
  root.dataset.motion = snapshot.motion ? 'full' : 'reduced';
  for (const [name, value] of Object.entries(themeToCssVars(themes[snapshot.theme]))) {
    root.style.setProperty(name, value);
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', themes[snapshot.theme].bg);
}

function update(): void {
  snapshot = compute();
  apply();
  listeners.forEach((l) => l());
}

export function initPreferences(): void {
  apply();
  lightQuery?.addEventListener('change', update);
  reducedQuery?.addEventListener('change', update);
}

export function setThemePref(value: ThemePref): void {
  themePref = value;
  write(THEME_KEY, value);
  update();
}

export function setMotionPref(value: MotionPref): void {
  motionPref = value;
  write(MOTION_KEY, value);
  update();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePreferences(): Preferences {
  return useSyncExternalStore(subscribe, () => snapshot);
}
