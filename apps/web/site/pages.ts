/**
 * Pages publiques du site, écrites au build à côté de la page d'accueil :
 * - /kit/ : la liste du kit 72 h, par rubrique ;
 * - /kit/<article>/ : une fiche par article qui a des conseils d'achat ;
 * - /guide/ et /guide/<page>/ : le guide, en langage clair ;
 * - /recettes/ et /recettes/<recette>/ : les recettes avec les conserves.
 * Le contenu vient de @kitzy/core, comme dans l'app : un texte n'existe qu'à un seul endroit.
 * Ces pages se lisent sans JavaScript ; le script de la page d'accueil ne règle que le thème
 * et la langue.
 */
import {
  CATEGORIES,
  tx,
  type ItemTemplate,
  type QuantityRule,
} from '../../../packages/core/src/catalog';
import { CATALOG, categoryName, contentFor, messagesFor } from '../../../packages/core/src/content';
import type { GuideBlock, GuidePage } from '../../../packages/core/src/guide';
import type { Recipe } from '../../../packages/core/src/recipes';
import { RECIPE_PHOTOS, recipePhotoPath } from './photos';
import { fill } from '../../../packages/core/src/i18n/fill';
import { LANDING } from '../../../packages/core/src/i18n/landing';
import { intlLocale, type Locale } from '../../../packages/core/src/i18n/locales';
import { SITE, type SiteTexts } from '../../../packages/core/src/i18n/site';
import { SITE_URL, ogImageName } from '../../../packages/core/src/links';
import { productsFor, type AffiliateConfig } from '../../../packages/core/src/products';

export const LOCALES: readonly Locale[] = ['fr', 'en', 'de', 'lb', 'pt'];
const NAMES: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  de: 'Deutsch',
  lb: 'Lëtzebuergesch',
  pt: 'Português',
};
const MARKER = { 1: '€', 2: '€€', 3: '€€€' } as const;

/** Deux-points : précédé d'une espace insécable en français seulement. */
const colon = (locale: Locale) => (locale === 'fr' ? '\u00a0:' : ':');
const LETZ_PREPARE = 'https://letzprepare.public.lu/fr/guide.html';

export interface SitePage {
  /** Chemin sans la langue ni la base, avec la barre finale (`kit/`, `guide/sirenes/`). */
  path: string;
  locale: Locale;
  html: string;
}

export interface SiteOptions {
  /** Base du site (`/` ou `/kitzy-survival-kit/`), pour les liens internes. */
  base: string;
  /** Balises du build (feuille de style et script de la page d'accueil). */
  assets: string;
  affiliate: AffiliateConfig;
}

export const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const prefix = (locale: Locale) => (locale === 'fr' ? '' : `${locale}/`);

/** Adresse absolue d'une page (canonique, hreflang, plan du site). */
export const absolute = (locale: Locale, path: string) => `${SITE_URL}${prefix(locale)}${path}`;

/** Les articles qui ont une fiche : ceux pour lesquels Kitzy a des conseils d'achat. */
export function itemsWithPage(): ItemTemplate[] {
  const products = contentFor('fr').products;
  return CATALOG.filter((item) => products.some((p) => p.templateIds.includes(item.id)));
}

/** Tous les chemins publics, dans le même ordre pour chaque langue. */
export function sitePaths(): string[] {
  return [
    'kit/',
    ...itemsWithPage().map((item) => `kit/${item.id}/`),
    'guide/',
    ...contentFor('fr').guide.map((page) => `guide/${page.slug}/`),
    'recettes/',
    ...contentFor('fr').recipes.map((recipe) => `recettes/${recipe.id}/`),
  ];
}

/* ---------- Morceaux de page ---------- */

function quantity(rule: QuantityRule, locale: Locale): string {
  const t = SITE[locale];
  const units = messagesFor(locale).units as Record<string, string>;
  const n = new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 1 }).format(
    rule.amount,
  );
  const form =
    new Intl.PluralRules(intlLocale(locale)).select(rule.amount) === 'one' ? 'one' : 'other';
  const q = `${n} ${units[`${rule.unit}_${form}`] ?? rule.unit}`;
  return fill(t.rules[rule.per], { q, n });
}

function sourceLabel(item: ItemTemplate, locale: Locale): string {
  return messagesFor(locale).item[item.source];
}

interface Frame {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  h1: string;
  lead?: string;
  crumbs: Array<{ label: string; path?: string }>;
  body: string;
  /** Données structurées propres à la page, ajoutées au fil d'Ariane. */
  data?: Record<string, unknown>[];
  /** Image de partage propre à la page (sinon celle de la page d'accueil). */
  image?: { url: string; width: number; height: number; alt: string };
}

function page(frame: Frame, options: SiteOptions): string {
  const { locale, path } = frame;
  const landing = LANDING[locale];
  const t = SITE[locale];
  const href = (l: Locale, p: string) => `${options.base}${prefix(l)}${p}`;
  const url = absolute(locale, path);
  const image = frame.image?.url ?? `${SITE_URL}og/${ogImageName(locale)}`;
  const crumbs = [{ label: t.nav.home, path: '' }, ...frame.crumbs];
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.label,
          ...(crumb.path !== undefined ? { item: absolute(locale, crumb.path) } : { item: url }),
        })),
      },
      ...(frame.data ?? []),
    ],
  };
  const meta = (attr: string, key: string, value: string) =>
    `<meta ${attr}="${key}" content="${escape(value)}" />`;

  return `<!doctype html>
<html lang="${locale}" data-theme="sombre" data-motion="reduced">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${escape(frame.title)}</title>
    ${meta('name', 'description', frame.description)}
    <link rel="canonical" href="${url}" />
    ${LOCALES.map((l) => `<link rel="alternate" hreflang="${l}" href="${absolute(l, path)}" />`).join('\n    ')}
    <link rel="alternate" hreflang="x-default" href="${absolute('fr', path)}" />
    ${meta('name', 'robots', 'index, follow, max-image-preview:large')}
    ${meta('property', 'og:type', 'article')}
    ${meta('property', 'og:site_name', 'Kitzy')}
    ${meta('property', 'og:url', url)}
    ${meta('property', 'og:title', frame.title)}
    ${meta('property', 'og:description', frame.description)}
    ${meta('property', 'og:image', image)}
    ${meta('property', 'og:image:alt', frame.image?.alt ?? landing.ogImageAlt)}
    ${frame.image ? `${meta('property', 'og:image:width', String(frame.image.width))}\n    ${meta('property', 'og:image:height', String(frame.image.height))}` : ''}
    ${meta('name', 'twitter:card', 'summary_large_image')}
    <script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
    <meta name="theme-color" content="#12302B" />
    <meta name="color-scheme" content="dark light" />
    <link rel="icon" type="image/png" href="${options.base}app/icons/favicon-64.png" />
    <link rel="apple-touch-icon" href="${options.base}app/icons/apple-touch-icon.png" />
    ${options.assets}
  </head>
  <body>
    <a class="skip-link" href="#contenu">${escape(landing.skip)}</a>
    <header class="top">
      <a class="brand" href="${href(locale, '')}">Kitzy</a>
      <details class="lang">
        <summary class="lang__current">
          <span class="visually-hidden">${escape(landing.language)}</span>
          <span data-lang-current>${NAMES[locale]}</span>
        </summary>
        <ul class="lang__list">
          ${LOCALES.map(
            (l) =>
              `<li><a href="${href(l, path)}" hreflang="${l}" lang="${l}" data-locale="${l}"${l === locale ? ' aria-current="page"' : ''}>${NAMES[l]}</a></li>`,
          ).join('\n          ')}
        </ul>
      </details>
      <a class="button button--small top__open" href="${options.base}app/">${escape(landing.openApp)}</a>
    </header>
    <script>
      // Langue déjà choisie (ici ou dans l'app) : la page française mène à sa traduction.
      if (document.documentElement.lang === 'fr') {
        try {
          var chosen = localStorage.getItem('kitzy.locale');
          var link = chosen && chosen !== 'fr' && document.querySelector('[data-locale="' + chosen + '"]');
          if (link) location.replace(link.href);
        } catch (e) {}
      }
    </script>
    <p class="lang-hint" id="lang-hint" hidden></p>

    <main id="contenu" class="doc" tabindex="-1">
      <nav class="crumbs" aria-label="${escape(t.nav.crumbs)}">
        <ol>
          ${crumbs
            .map((crumb) =>
              crumb.path !== undefined
                ? `<li><a href="${href(locale, crumb.path)}">${escape(crumb.label)}</a></li>`
                : `<li><span aria-current="page">${escape(crumb.label)}</span></li>`,
            )
            .join('\n          ')}
        </ol>
      </nav>
      <h1 class="doc__title">${escape(frame.h1)}</h1>
      ${frame.lead ? `<p class="doc__lead">${escape(frame.lead)}</p>` : ''}
      ${frame.body}
      <section class="doc__cta" aria-labelledby="cta-title">
        <h2 id="cta-title">${escape(t.cta.title)}</h2>
        <p>${escape(t.cta.text)}</p>
        <p><a class="button" href="${options.base}app/">${escape(t.cta.button)}</a></p>
      </section>
    </main>

    <footer class="footer">
      <ul class="footer__links">
        <li><a href="${href(locale, 'kit/')}">${escape(t.nav.kit)}</a></li>
        <li><a href="${href(locale, 'guide/')}">${escape(t.nav.guide)}</a></li>
        <li><a href="${href(locale, 'recettes/')}">${escape(t.recipes.nav)}</a></li>
        <li><a href="${options.base}app/confidentialite">${escape(landing.footer.privacy)}</a></li>
        <li><a href="${options.base}app/transparence">${escape(landing.footer.transparency)}</a></li>
      </ul>
      <p class="footer__source">${escape(landing.footer.source)}</p>
    </footer>
  </body>
</html>
`;
}

/* ---------- La liste du kit ---------- */

function rulesList(item: ItemTemplate, locale: Locale, className: string): string {
  const t = SITE[locale];
  const rows = [
    item.home ? [t.kit.home, quantity(item.home, locale)] : null,
    item.bag ? [t.kit.bag, quantity(item.bag, locale)] : null,
  ].filter((row): row is string[] => row !== null);
  if (rows.length === 0) return '';
  return `<dl class="${className}">${rows
    .map(
      ([where, what]) =>
        `<div><dt>${escape(where!)}${colon(locale)}</dt><dd>${escape(what!)}</dd></div>`,
    )
    .join('')}</dl>`;
}

function kitIndex(locale: Locale, options: SiteOptions): string {
  const t = SITE[locale];
  const withPage = new Set(itemsWithPage().map((item) => item.id));
  const href = (p: string) => `${options.base}${prefix(locale)}${p}`;
  const sections = CATEGORIES.map((category) => {
    const items = CATALOG.filter((item) => item.category === category.id);
    if (items.length === 0) return '';
    const name = categoryName(category.id, locale);
    return `<section class="kit-group" aria-labelledby="cat-${category.id}">
        <h2 id="cat-${category.id}">${escape(name)}</h2>
        <ul class="kit-list">
          ${items
            .map((item) => {
              const label = tx(item.name, locale);
              const title = withPage.has(item.id)
                ? `<a href="${href(`kit/${item.id}/`)}">${escape(label)}</a>`
                : escape(label);
              return `<li class="kit-item">
            <h3 class="kit-item__name">${title}</h3>
            <p class="kit-item__source kit-item__source--${item.source}">${escape(sourceLabel(item, locale))}</p>
            ${item.hint ? `<p class="kit-item__hint">${escape(tx(item.hint, locale))}</p>` : ''}
            ${rulesList(item, locale, 'kit-item__rules')}
          </li>`;
            })
            .join('\n          ')}
        </ul>
      </section>`;
  }).join('\n      ');

  return page(
    {
      locale,
      path: 'kit/',
      title: t.kit.metaTitle,
      description: t.kit.description,
      h1: t.kit.title,
      lead: t.kit.lead,
      crumbs: [{ label: t.nav.kit }],
      body: `<p class="doc__note">${escape(t.kit.legend)}</p>
      ${sections}`,
    },
    options,
  );
}

/* ---------- La fiche d'un article ---------- */

function itemPage(item: ItemTemplate, locale: Locale, options: SiteOptions): string {
  const t = SITE[locale];
  const m = messagesFor(locale);
  const content = contentFor(locale);
  const name = tx(item.name, locale);
  const href = (p: string) => `${options.base}${prefix(locale)}${p}`;
  const groups = productsFor(item.id, content.products, options.affiliate, undefined, locale);
  const offers = groups.flatMap((g) => g.products.flatMap((p) => p.offers));
  const affiliate = offers.some((o) => o.affiliate);
  const amazon = offers.some((o) => o.affiliate && o.merchant.program);

  const buy = `<section class="doc__section" aria-labelledby="buy-title">
        <h2 id="buy-title">${escape(m.buy.title)}</h2>
        <p>${escape(m.buy.intro)}</p>
        ${groups
          .map(
            (group) => `<section class="buy-tier" aria-labelledby="tier-${group.tier}">
          <h3 id="tier-${group.tier}"><span class="buy-tier__mark" aria-hidden="true">${MARKER[group.tier]}</span> ${escape(m.buy.tiers[String(group.tier) as '1' | '2' | '3'])}</h3>
          ${group.products
            .map(
              ({ product, offers: productOffers }) => `<div class="buy-product">
            <p class="buy-product__name">${escape(product.name)}</p>
            <p class="buy-product__why">${escape(product.why)}</p>
            ${
              productOffers.length > 0
                ? `<ul class="buy-product__offers">${productOffers
                    .map(
                      (offer) =>
                        `<li><a href="${escape(offer.url)}" target="_blank" rel="${offer.affiliate ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}" aria-label="${escape(`${fill(m.buy.searchLabel, { name: product.name, merchant: offer.merchant.name })} ${m.guide.newWindow}`)}">${escape(fill(m.buy.search, { merchant: offer.merchant.name }))}</a></li>`,
                    )
                    .join('')}</ul>`
                : `<p class="buy-product__none">${escape(m.buy.noOffer)}</p>`
            }
          </div>`,
            )
            .join('\n          ')}
        </section>`,
          )
          .join('\n        ')}
        <div class="buy-disclosure">
          ${affiliate ? `<p>${escape(m.buy.affiliate)}</p>` : ''}
          ${amazon ? `<p>${escape(m.buy.amazon)}</p>` : ''}
          <p><a href="${options.base}app/transparence">${escape(m.buy.transparency)}</a></p>
        </div>
      </section>`;

  const guidePage = item.guide ? content.guide.find((p) => p.slug === item.guide) : undefined;
  const related = itemsWithPage().filter(
    (other) => other.category === item.category && other.id !== item.id,
  );

  const body = `<p class="doc__tags"><span>${escape(categoryName(item.category, locale))}</span><span class="kit-item__source kit-item__source--${item.source}">${escape(sourceLabel(item, locale))}</span></p>
      ${item.safety ? `<p class="doc__warning"><strong>${escape(m.item.warning)}</strong> ${escape(tx(item.safety, locale))}</p>` : ''}
      <section class="doc__section" aria-labelledby="qty-title">
        <h2 id="qty-title">${escape(t.item.quantity)}</h2>
        ${rulesList(item, locale, 'doc__rules')}
      </section>
      ${buy}
      ${
        guidePage
          ? `<section class="doc__section" aria-labelledby="read-title">
        <h2 id="read-title">${escape(t.item.readAlso)}</h2>
        <p><a href="${href(`guide/${guidePage.slug}/`)}">${escape(guidePage.title)}</a>${colon(locale)} ${escape(guidePage.summary)}</p>
      </section>`
          : ''
      }
      ${
        related.length > 0
          ? `<section class="doc__section" aria-labelledby="related-title">
        <h2 id="related-title">${escape(t.item.related)}</h2>
        <ul class="doc__links">${related.map((other) => `<li><a href="${href(`kit/${other.id}/`)}">${escape(tx(other.name, locale))}</a></li>`).join('')}</ul>
      </section>`
          : ''
      }
      <p><a href="${href('kit/')}">${escape(t.item.back)}</a></p>`;

  return page(
    {
      locale,
      path: `kit/${item.id}/`,
      title: fill(t.item.metaTitle, { name }),
      description: fill(t.item.description, { name }),
      h1: name,
      ...(item.hint ? { lead: tx(item.hint, locale) } : {}),
      crumbs: [{ label: t.nav.kit, path: 'kit/' }, { label: name }],
      body,
    },
    options,
  );
}

/* ---------- Le guide ---------- */

function block(b: GuideBlock): string {
  switch (b.type) {
    case 'p':
      return `<p>${escape(b.text)}</p>`;
    case 'h2':
      return `<h2>${escape(b.text)}</h2>`;
    case 'note':
      return `<p class="doc__note">${escape(b.text)}</p>`;
    case 'list':
      return `<ul>${b.items.map((i) => `<li>${escape(i)}</li>`).join('')}</ul>`;
    case 'steps':
      return `<ol>${b.items.map((i) => `<li>${escape(i)}</li>`).join('')}</ol>`;
  }
}

function guideIndex(locale: Locale, options: SiteOptions): string {
  const t = SITE[locale];
  const m = messagesFor(locale);
  const pages = contentFor(locale).guide;
  const href = (p: string) => `${options.base}${prefix(locale)}${p}`;
  const chapters = (Object.keys(m.guide.chapters) as GuidePage['chapter'][])
    .map((chapter) => {
      const list = pages.filter((p) => p.chapter === chapter);
      if (list.length === 0) return '';
      return `<section class="doc__section" aria-labelledby="ch-${chapter}">
        <h2 id="ch-${chapter}">${escape(m.guide.chapters[chapter])}</h2>
        <ul class="guide-list">
          ${list
            .map(
              (p) =>
                `<li><a href="${href(`guide/${p.slug}/`)}">${escape(p.title)}</a><p>${escape(p.summary)}</p></li>`,
            )
            .join('\n          ')}
        </ul>
      </section>`;
    })
    .join('\n      ');
  return page(
    {
      locale,
      path: 'guide/',
      title: t.guide.metaTitle,
      description: t.guide.description,
      h1: t.guide.title,
      lead: m.guide.intro,
      crumbs: [{ label: t.nav.guide }],
      body: chapters,
    },
    options,
  );
}

function guideArticle(p: GuidePage, locale: Locale, options: SiteOptions): string {
  const t = SITE[locale];
  const m = messagesFor(locale);
  const href = (path: string) => `${options.base}${prefix(locale)}${path}`;
  const links = p.links?.length
    ? `<section class="doc__section" aria-labelledby="links-title">
        <h2 id="links-title">${escape(m.guide.links)}</h2>
        <ul class="doc__links">${p.links
          .map(
            (l) =>
              `<li><a href="${escape(l.url)}" target="_blank" rel="noopener noreferrer">${escape(l.label)}<span class="visually-hidden"> ${escape(m.guide.newWindow)}</span></a></li>`,
          )
          .join('')}</ul>
      </section>`
    : '';
  return page(
    {
      locale,
      path: `guide/${p.slug}/`,
      title: fill(t.guide.metaTitleArticle, { title: p.title }),
      description: p.summary,
      h1: p.title,
      lead: p.summary,
      crumbs: [{ label: t.nav.guide, path: 'guide/' }, { label: p.title }],
      body: `<div class="doc__prose">${p.blocks.map(block).join('\n        ')}</div>
      ${links}
      <p class="doc__source">${escape(m.guide.source)}</p>
      <p><a href="${href('guide/')}">${escape(m.guide.back)}</a></p>`,
      data: [
        {
          '@type': 'Article',
          headline: p.title,
          description: p.summary,
          inLanguage: locale,
          url: absolute(locale, `guide/${p.slug}/`),
          isBasedOn: LETZ_PREPARE,
          publisher: {
            '@type': 'Organization',
            name: 'Crofte Studio',
            url: 'https://geoffreycrofte.com',
          },
        },
      ],
    },
    options,
  );
}

/* ---------- Les recettes ---------- */

/** Durée, cuisson, eau et nombre de personnes, comme dans l'app. */
function recipeFacts(recipe: Recipe, locale: Locale): string[] {
  const m = messagesFor(locale).recipes;
  const liters = new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 1 }).format(
    recipe.water,
  );
  return [
    fill(m.minutes, { count: recipe.minutes }),
    recipe.cooking === 'none' ? m.none : m.stove,
    recipe.water > 0 ? fill(m.water, { quantity: `${liters} L` }) : m.noWater,
    fill(m.serves, { count: recipe.serves }),
  ];
}

function recipeIndex(locale: Locale, options: SiteOptions): string {
  const t = SITE[locale];
  const href = (p: string) => `${options.base}${prefix(locale)}${p}`;
  const list = contentFor(locale)
    .recipes.map(
      (recipe) => `<li class="recipe-card${RECIPE_PHOTOS[recipe.id] ? ' recipe-card--photo' : ''}">
            ${RECIPE_PHOTOS[recipe.id] ? `<img class="recipe-card__photo" src="${options.base}${recipePhotoPath(recipe.id)}" alt="" width="${RECIPE_PHOTOS[recipe.id]!.width}" height="${RECIPE_PHOTOS[recipe.id]!.height}" loading="lazy" decoding="async" />` : ''}
            <a href="${href(`recettes/${recipe.id}/`)}">${escape(recipe.title)}</a>
            <p>${escape(recipe.summary)}</p>
            <p class="recipe-facts">${recipeFacts(recipe, locale)
              .map((fact) => `<span>${escape(fact)}</span>`)
              .join('')}</p>
          </li>`,
    )
    .join('\n          ');
  return page(
    {
      locale,
      path: 'recettes/',
      title: t.recipes.metaTitle,
      description: t.recipes.description,
      h1: t.recipes.title,
      lead: t.recipes.lead,
      crumbs: [{ label: t.recipes.nav }],
      body: `<ul class="guide-list recipe-list">
          ${list}
        </ul>`,
    },
    options,
  );
}

function recipePage(recipe: Recipe, locale: Locale, options: SiteOptions): string {
  const t = SITE[locale];
  const m = messagesFor(locale).recipes;
  const href = (p: string) => `${options.base}${prefix(locale)}${p}`;
  const withPage = new Set(itemsWithPage().map((item) => item.id));
  // Les articles du kit qu'utilise la recette, une fois chacun : vers leur fiche quand elle existe,
  // sinon vers leur rubrique dans la liste du kit.
  const kitItems = [...new Set(recipe.ingredients.map((i) => i.templateId))]
    .map((id) => CATALOG.find((item) => item.id === id))
    .filter((item): item is ItemTemplate => item !== undefined);
  const kitHref = (item: ItemTemplate) =>
    withPage.has(item.id) ? href(`kit/${item.id}/`) : `${href('kit/')}#cat-${item.category}`;
  const photo = RECIPE_PHOTOS[recipe.id];
  // Photo d'illustration : le titre dit déjà de quel plat il s'agit (alternative vide),
  // la légende crédite l'auteur et la licence, comme elle l'exige.
  const figure = photo
    ? `<figure class="recipe-photo">
        <img src="${options.base}${recipePhotoPath(recipe.id)}" alt="" width="${photo.width}" height="${photo.height}" decoding="async" />
        <figcaption>${fill(escape(t.recipes.photo), {
          author: `<a href="${escape(photo.source)}" rel="noopener noreferrer">${escape(photo.author)}</a>`,
          license: photo.licenseUrl
            ? `<a href="${escape(photo.licenseUrl)}" rel="license noopener noreferrer">${escape(photo.license)}</a>`
            : escape(photo.license),
        })}</figcaption>
      </figure>`
    : '';
  const body = `${figure}
      <p class="recipe-facts">${recipeFacts(recipe, locale)
        .map((fact) => `<span>${escape(fact)}</span>`)
        .join('')}</p>
      <section class="doc__section" aria-labelledby="ingredients-title">
        <h2 id="ingredients-title">${escape(m.ingredients)}</h2>
        <ul class="doc__links">${recipe.ingredients.map((i) => `<li>${escape(i.text)}</li>`).join('')}</ul>
        ${
          kitItems.length > 0
            ? `<ul class="recipe-kit">${kitItems
                .map(
                  (item) =>
                    `<li><a href="${kitHref(item)}">${escape(fill(t.recipes.inKit, { name: tx(item.name, locale) }))}</a></li>`,
                )
                .join('')}</ul>`
            : ''
        }
      </section>
      <section class="doc__section" aria-labelledby="steps-title">
        <h2 id="steps-title">${escape(m.steps)}</h2>
        <ol class="doc__links">${recipe.steps.map((step) => `<li>${escape(step)}</li>`).join('')}</ol>
        ${recipe.tip ? `<p class="doc__note">${escape(recipe.tip)}</p>` : ''}
        ${recipe.cooking === 'stove' ? `<p class="doc__warning">${escape(m.safety)}</p>` : ''}
      </section>
      <p><a href="${href('recettes/')}">${escape(m.back)}</a></p>`;
  return page(
    {
      locale,
      path: `recettes/${recipe.id}/`,
      title: fill(t.recipes.metaTitleRecipe, { title: recipe.title }),
      description: recipe.summary,
      h1: recipe.title,
      lead: recipe.summary,
      crumbs: [{ label: t.recipes.nav, path: 'recettes/' }, { label: recipe.title }],
      body,
      ...(photo
        ? {
            image: {
              url: `${SITE_URL}${recipePhotoPath(recipe.id)}`,
              width: photo.width,
              height: photo.height,
              alt: recipe.title,
            },
          }
        : {}),
      data: [
        {
          '@type': 'Recipe',
          name: recipe.title,
          description: recipe.summary,
          inLanguage: locale,
          url: absolute(locale, `recettes/${recipe.id}/`),
          totalTime: `PT${recipe.minutes}M`,
          recipeYield: String(recipe.serves),
          recipeIngredient: recipe.ingredients.map((i) => i.text),
          recipeInstructions: recipe.steps.map((text) => ({ '@type': 'HowToStep', text })),
          author: { '@type': 'Organization', name: 'Kitzy', url: SITE_URL },
          ...(photo ? { image: [`${SITE_URL}${recipePhotoPath(recipe.id)}`] } : {}),
        },
      ],
    },
    options,
  );
}

/** Toutes les pages publiques, dans toutes les langues. */
export function sitePages(options: SiteOptions): SitePage[] {
  const out: SitePage[] = [];
  for (const locale of LOCALES) {
    out.push({ path: 'kit/', locale, html: kitIndex(locale, options) });
    for (const item of itemsWithPage()) {
      out.push({ path: `kit/${item.id}/`, locale, html: itemPage(item, locale, options) });
    }
    out.push({ path: 'guide/', locale, html: guideIndex(locale, options) });
    for (const p of contentFor(locale).guide) {
      out.push({ path: `guide/${p.slug}/`, locale, html: guideArticle(p, locale, options) });
    }
    out.push({ path: 'recettes/', locale, html: recipeIndex(locale, options) });
    for (const recipe of contentFor(locale).recipes) {
      out.push({
        path: `recettes/${recipe.id}/`,
        locale,
        html: recipePage(recipe, locale, options),
      });
    }
  }
  return out;
}

/** Le plan du site : la page d'accueil, l'app et toutes les pages publiques, avec leurs traductions. */
export function sitemap(): string {
  const entry = (path: string, priority: string) =>
    LOCALES.map(
      (locale) => `  <url>
    <loc>${absolute(locale, path)}</loc>
${LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${absolute(l, path)}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute('fr', path)}" />
    <changefreq>monthly</changefreq>
    <priority>${locale === 'fr' ? priority : (Number(priority) - 0.1).toFixed(1)}</priority>
  </url>`,
    ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Une page par langue, chacune liée à ses traductions (hreflang). Écrit au build. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entry('', '1.0')}
  <url>
    <loc>${SITE_URL}app/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
${sitePaths()
  .map((path) => entry(path, path.split('/').length > 2 ? '0.6' : '0.8'))
  .join('\n')}
</urlset>
`;
}

export type { SiteTexts };
