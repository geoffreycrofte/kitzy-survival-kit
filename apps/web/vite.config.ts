import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Chemin de publication. GitHub Pages sans domaine : `/survival-kit/`.
 * Avec kitzy.lu : `/`.
 */
const base = process.env.KITZY_BASE ?? '/';

/** GitHub Pages ne sait pas réécrire les URL : 404.html relance l'app sur la bonne route. */
function spaFallback(): Plugin {
  return {
    name: 'kitzy-spa-fallback',
    apply: 'build',
    closeBundle() {
      const dist = resolve(import.meta.dirname, 'dist');
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
    },
  };
}

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*.png', 'mascot/*.webp'],
      manifest: {
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
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,webp,png,svg}'],
        globIgnores: ['404.html'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
    spaFallback(),
  ],
  server: { port: 5173 },
  preview: { port: 4173, strictPort: true },
});
