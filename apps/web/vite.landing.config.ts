import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { renderSVG } from 'uqr';
import { LANDING } from '../../packages/core/src/i18n/landing';
import { SITE_URL, ogImageName } from '../../packages/core/src/links';

/**
 * Page de présentation (kitzy.lu) : construite à la racine du site, à côté de l'app (`app/`).
 * Elle ne s'enregistre pas comme service worker ; son `sw.js` ne sert qu'à retirer
 * l'ancien service worker de la racine (voir landing/public/sw.js).
 */
const siteBase = process.env.KITZY_BASE ?? '/';
const outDir = resolve(import.meta.dirname, 'dist');

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

type Locale = keyof typeof LANDING;

/** La racine est en français (langue source) ; les autres langues ont leur dossier. */
const LOCALES: readonly Locale[] = ['fr', 'en', 'de', 'lb', 'pt'];
const pathOf = (locale: Locale) => (locale === 'fr' ? '' : `${locale}/`);
const OG_LOCALE: Record<Locale, string> = {
  fr: 'fr_LU',
  en: 'en_GB',
  de: 'de_LU',
  lb: 'lb_LU',
  pt: 'pt_PT',
};
const NAMES: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  de: 'Deutsch',
  lb: 'Lëtzebuergesch',
  pt: 'Português',
};

function lookup(locale: Locale, path: string): string {
  let value: unknown = LANDING[locale];
  for (const part of path.split('.')) {
    if (value === null || typeof value !== 'object') value = undefined;
    else value = (value as Record<string, unknown>)[part];
  }
  if (typeof value !== 'string') throw new Error(`Texte introuvable (${locale}) : ${path}`);
  return value;
}

/**
 * Référencement et aperçus de partage : adresse canonique, versions linguistiques (hreflang),
 * Open Graph, carte Twitter/X et données structurées (schema.org). Les adresses sont absolues
 * (kitzy.lu), comme l'exigent les réseaux sociaux ; l'image est générée par scripts/og-image.mjs.
 */
function seoTags(locale: Locale): string {
  const { title, description, ogImageAlt } = LANDING[locale];
  const url = `${SITE_URL}${pathOf(locale)}`;
  const image = `${SITE_URL}og/${ogImageName(locale)}`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#site`,
        name: 'Kitzy',
        url: SITE_URL,
        inLanguage: LOCALES,
        publisher: { '@id': `${SITE_URL}#studio` },
      },
      {
        '@type': 'WebPage',
        url,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { '@id': `${SITE_URL}#site` },
      },
      {
        '@type': 'WebApplication',
        name: 'Kitzy',
        url: `${SITE_URL}app/`,
        description,
        image,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Android, iOS, Windows, macOS, Linux',
        browserRequirements: 'JavaScript',
        inLanguage: LOCALES,
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
    `<link rel="canonical" href="${url}" />`,
    ...LOCALES.map(
      (l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}${pathOf(l)}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}" />`,
    meta('name', 'robots', 'index, follow, max-image-preview:large'),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', 'Kitzy'),
    meta('property', 'og:locale', OG_LOCALE[locale]),
    ...LOCALES.filter((l) => l !== locale).map((l) =>
      meta('property', 'og:locale:alternate', OG_LOCALE[l]),
    ),
    meta('property', 'og:url', url),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('property', 'og:image', image),
    meta('property', 'og:image:type', 'image/png'),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', ogImageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', image),
    meta('name', 'twitter:image:alt', ogImageAlt),
    `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

/**
 * Une page par langue, écrite au moment de la construction à partir du même gabarit :
 * elle se lit sans JavaScript, et le texte n'existe qu'à un seul endroit (core).
 */
function render(template: string, locale: Locale): string {
  let html = template
    .replace(/<html lang="fr"/, `<html lang="${locale}"`)
    .replace(
      /(<(\w+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)(<\/\2>)/g,
      (match, open: string, _tag: string, path: string, close: string) =>
        `${open}${escape(lookup(locale, path))}${close}`,
    )
    .replace(
      /data-i18n-label="([^"]+)" aria-label=""/g,
      (match, path: string) =>
        `data-i18n-label="${path}" aria-label="${escape(lookup(locale, path))}"`,
    )
    .replace(
      /data-i18n-content="([^"]+)" content=""/g,
      (match, path: string) =>
        `data-i18n-content="${path}" content="${escape(lookup(locale, path))}"`,
    )
    .replace(
      /(<span class="result__label" data-result-label="(\w+)">)(<\/span>)/g,
      (match, open: string, key: 'water' | 'meals' | 'pets' | 'bags', close: string) =>
        `${open}${escape(LANDING[locale].household.results[key].other)}${close}`,
    )
    .replace('<!-- kitzy:seo -->', seoTags(locale))
    // Le QR code vers le site, dessiné une fois pour toutes : il s'affiche sans JavaScript.
    .replace(
      '<!-- kitzy:qr -->',
      renderSVG(SITE_URL, { ecc: 'M', border: 2, whiteColor: '#FFFFFF', blackColor: '#12302B' }),
    )
    // Menu des langues : le nom de la langue de la page, et le lien vers la page en cours.
    .replace(/(<span data-lang-current>)[^<]*(<\/span>)/, `$1${NAMES[locale]}$2`)
    .replace(`data-locale="${locale}">`, `data-locale="${locale}" aria-current="page">`);
  // Les pages traduites sont un dossier plus bas : leurs adresses relatives remontent d'un cran.
  if (locale !== 'fr') {
    html = html
      .replace(/\b(href|src)="(?!https?:|#|\/|data:|mailto:)\.?\/?([^"]*)"/g, '$1="../$2"')
      .replace("location.replace('app/')", "location.replace('../app/')");
  }
  return html;
}

function landingPages(): Plugin {
  let template = '';
  return {
    name: 'kitzy-landing-pages',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        template = html;
        return render(html, 'fr');
      },
    },
    // Le gabarit n'est complet (scripts et styles du build) qu'à la fin : on écrit alors les traductions.
    closeBundle() {
      for (const locale of LOCALES) {
        if (locale === 'fr') continue;
        mkdirSync(resolve(outDir, locale), { recursive: true });
        writeFileSync(resolve(outDir, locale, 'index.html'), render(template, locale));
      }
    },
  };
}

export default defineConfig({
  root: resolve(import.meta.dirname, 'landing'),
  base: siteBase,
  plugins: [landingPages()],
  build: {
    outDir,
    // L'app est déjà dans dist/app : on ne vide pas le dossier.
    emptyOutDir: false,
  },
});
