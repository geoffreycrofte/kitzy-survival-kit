import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { renderSVG } from 'uqr';
import { LANDING } from '../../packages/core/src/i18n/landing';
import { SITE_URL } from '../../packages/core/src/links';

/**
 * Page de présentation (kitzy.lu) : construite à la racine du site, à côté de l'app (`app/`).
 * Elle ne s'enregistre pas comme service worker ; son `sw.js` ne sert qu'à retirer
 * l'ancien service worker de la racine (voir landing/public/sw.js).
 */
const siteBase = process.env.KITZY_BASE ?? '/';

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function lookup(path: string): string | undefined {
  let value: unknown = LANDING.fr;
  for (const part of path.split('.')) {
    if (value === null || typeof value !== 'object') return undefined;
    value = (value as Record<string, unknown>)[part];
  }
  return typeof value === 'string' ? value : undefined;
}

/**
 * Les textes français sont écrits dans le HTML au moment de la construction :
 * la page se lit sans JavaScript, et le texte n'existe qu'à un seul endroit (core).
 */
function frenchText(): Plugin {
  return {
    name: 'kitzy-landing-text',
    transformIndexHtml(html) {
      return (
        html
          .replace(
            /(<(\w+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)(<\/\2>)/g,
            (match, open: string, _tag: string, path: string, close: string) => {
              const text = lookup(path);
              if (text === undefined) throw new Error(`Texte introuvable : ${path}`);
              return `${open}${escape(text)}${close}`;
            },
          )
          .replace(/data-i18n-label="([^"]+)" aria-label=""/g, (match, path: string) => {
            const text = lookup(path);
            if (text === undefined) throw new Error(`Texte introuvable : ${path}`);
            return `data-i18n-label="${path}" aria-label="${escape(text)}"`;
          })
          // Le QR code vers le site, dessiné une fois pour toutes : il s'affiche sans JavaScript.
          .replace(
            '<!-- kitzy:qr -->',
            renderSVG(SITE_URL, {
              ecc: 'M',
              border: 2,
              whiteColor: '#FFFFFF',
              blackColor: '#12302B',
            }),
          )
          .replace(/data-i18n-content="([^"]+)" content=""/g, (match, path: string) => {
            const text = lookup(path);
            if (text === undefined) throw new Error(`Texte introuvable : ${path}`);
            return `data-i18n-content="${path}" content="${escape(text)}"`;
          })
          .replace(
            /(<span class="result__label" data-result-label="(\w+)">)(<\/span>)/g,
            (match, open: string, key: 'water' | 'meals' | 'pets' | 'bags', close: string) =>
              `${open}${escape(LANDING.fr.household.results[key].other)}${close}`,
          )
      );
    },
  };
}

export default defineConfig({
  root: resolve(import.meta.dirname, 'landing'),
  base: siteBase,
  plugins: [frenchText()],
  build: {
    outDir: resolve(import.meta.dirname, 'dist'),
    // L'app est déjà dans dist/app : on ne vide pas le dossier.
    emptyOutDir: false,
  },
});
