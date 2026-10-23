import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Racine du site (`KITZY_BASE`) : `/` avec kitzy.lu, `/survival-kit/` sur GitHub Pages sans domaine.
 * La page de présentation est à la racine ; l'app vit dans `app/` juste en dessous.
 */
const siteBase = process.env.KITZY_BASE ?? '/';
const base = `${siteBase}app/`;

/** Origine publique : kitzy.lu dès que le domaine est configuré, sinon GitHub Pages. */
const origin = process.env.KITZY_DOMAIN
  ? `https://${process.env.KITZY_DOMAIN}`
  : 'https://geoffreycrofte.github.io';

/**
 * GitHub Pages ne sait pas réécrire les URL : le 404.html du site relance l'app sur la bonne route.
 * Une ancienne adresse hors de `app/` (lien de partage, app installée avant le déménagement)
 * est renvoyée vers la même page dans `app/`.
 */
function spaFallback(): Plugin {
  return {
    name: 'kitzy-spa-fallback',
    apply: 'build',
    closeBundle() {
      const out = resolve(import.meta.dirname, 'dist/app');
      const html = readFileSync(resolve(out, 'index.html'), 'utf8');
      const redirect = `<script>(function(){var s=${JSON.stringify(siteBase)},a=${JSON.stringify(base)},p=location.pathname;if(p.indexOf(a)!==0){location.replace(a+p.slice(s.length)+location.search+location.hash);}})();</script>`;
      writeFileSync(
        resolve(out, '../404.html'),
        html.replace('<meta charset="utf-8" />', `<meta charset="utf-8" />\n    ${redirect}`),
      );
    },
  };
}

export default defineConfig({
  base,
  build: { outDir: 'dist/app', emptyOutDir: true },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      strategies: 'injectManifest',
      srcDir: 'src/sw',
      filename: 'sw.ts',
      includeAssets: ['icons/*.png', 'mascot/*.webp'],
      manifest: {
        // Identité stable de l'app installée : la racine du site, inchangée depuis la première
        // version. L'app installée garde ainsi son identité alors que start_url passe à `app/`.
        id: siteBase,
        name: 'Kitzy',
        short_name: 'Kitzy',
        description: 'Ta réserve d’urgence de 72 heures, prête et à jour.',
        lang: 'fr',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#12302B',
        theme_color: '#12302B',
        // Permet à la page de savoir si Kitzy est déjà installée (Chrome Android).
        related_applications: [{ platform: 'webapp', url: `${origin}${base}manifest.webmanifest` }],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,woff2,webp,png,svg,wasm}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      devOptions: { enabled: false, type: 'module' },
    }),
    spaFallback(),
  ],
  server: { port: 5173 },
  preview: { port: 4173, strictPort: true },
});
