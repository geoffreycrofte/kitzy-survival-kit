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

const LANGUAGES = ['fr', 'en', 'de', 'lb', 'pt'];

/**
 * Référencement et aperçus de partage : adresse canonique, Open Graph, carte Twitter/X et
 * données structurées (schema.org). Les adresses sont absolues (kitzy.lu), comme l'exigent
 * les réseaux sociaux ; l'image est générée par scripts/og-image.mjs.
 */
function seoTags(): string {
  const { title, description } = LANDING.fr;
  const image = `${SITE_URL}og/kitzy-og.png`;
  const imageAlt =
    'Kitzy le hérisson tient une lanterne allumée, à côté du titre « Trois jours d’avance sur l’imprévu. »';
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#site`,
        name: 'Kitzy',
        url: SITE_URL,
        inLanguage: LANGUAGES,
        description,
        publisher: { '@id': `${SITE_URL}#studio` },
      },
      {
        '@type': 'WebApplication',
        name: 'Kitzy',
        url: `${SITE_URL}app/`,
        description,
        image,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Android, iOS, Windows, macOS, Linux',
        browserRequirements: 'Navigateur récent avec JavaScript',
        inLanguage: LANGUAGES,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        areaServed: { '@type': 'Country', name: 'Luxembourg' },
        publisher: { '@id': `${SITE_URL}#studio` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}#studio`,
        name: 'Crofte Studio',
        url: 'https://geoffreycrofte.com',
      },
    ],
  };
  const meta = (attr: string, key: string, value: string) =>
    `<meta ${attr}="${key}" content="${escape(value)}" />`;
  return [
    `<link rel="canonical" href="${SITE_URL}" />`,
    meta('name', 'robots', 'index, follow, max-image-preview:large'),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', 'Kitzy'),
    meta('property', 'og:locale', 'fr_FR'),
    meta('property', 'og:url', SITE_URL),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('property', 'og:image', image),
    meta('property', 'og:image:type', 'image/png'),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', imageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', image),
    meta('name', 'twitter:image:alt', imageAlt),
    `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
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
          .replace('<!-- kitzy:seo -->', seoTags())
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
