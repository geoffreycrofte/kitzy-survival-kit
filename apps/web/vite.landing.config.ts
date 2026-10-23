import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/**
 * Page de présentation (kitzy.lu) : construite à la racine du site, à côté de l'app (`app/`).
 * Elle ne s'enregistre pas comme service worker ; son `sw.js` ne sert qu'à retirer
 * l'ancien service worker de la racine (voir landing/public/sw.js).
 */
const siteBase = process.env.KITZY_BASE ?? '/';

export default defineConfig({
  root: resolve(import.meta.dirname, 'landing'),
  base: siteBase,
  build: {
    outDir: resolve(import.meta.dirname, 'dist'),
    // L'app est déjà dans dist/app : on ne vide pas le dossier.
    emptyOutDir: false,
  },
});
