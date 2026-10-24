/**
 * Conseils d'achat et affiliation (§ 8 du plan).
 *
 * Règles :
 * - aucun prix affiché, seulement un palier (€, €€, €€€) choisi à la main par catégorie ;
 * - la recommandation ne dépend jamais de l'affiliation : l'article reste conseillé sans offre ;
 * - un lien n'est affilié que si l'identifiant du marchand est configuré au build ;
 * - les offres signalées cassées ou indisponibles par la surveillance des liens sont masquées.
 */
import linkStatus from './data/link-status.json';

export type Tier = 1 | 2 | 3;
export const TIERS: readonly Tier[] = [1, 2, 3];

export type MerchantId = 'amazon-fr' | 'amazon-de' | 'decathlon-fr';

export interface Merchant {
  id: MerchantId;
  /** Nom affiché dans le lien (« Voir sur Amazon.fr »). */
  name: string;
  /** Page de résultats pour une recherche. */
  search: (query: string) => string;
  /** Programme d'affiliation, s'il existe pour ce marchand. */
  program?: 'amazon-fr' | 'amazon-de';
}

export const MERCHANTS: Record<MerchantId, Merchant> = {
  'amazon-fr': {
    id: 'amazon-fr',
    name: 'Amazon.fr',
    search: (q) => `https://www.amazon.fr/s?k=${encodeURIComponent(q)}`,
    program: 'amazon-fr',
  },
  'amazon-de': {
    id: 'amazon-de',
    name: 'Amazon.de',
    search: (q) => `https://www.amazon.de/s?k=${encodeURIComponent(q)}`,
    program: 'amazon-de',
  },
  'decathlon-fr': {
    id: 'decathlon-fr',
    name: 'Decathlon.fr',
    search: (q) => `https://www.decathlon.fr/search?Ntt=${encodeURIComponent(q)}`,
  },
};

export interface Offer {
  merchant: MerchantId;
  /** Recherche chez le marchand (par défaut) … */
  query?: string;
  /** … ou page produit précise, quand elle a été choisie et vérifiée. */
  url?: string;
}

export interface Product {
  id: string;
  /** Modèles du catalogue concernés. */
  templateIds: string[];
  tier: Tier;
  /** Ce qu'il faut chercher, décrit par ses caractéristiques (pas de marque imposée). */
  name: string;
  /** Pourquoi ce choix, en une phrase. */
  why: string;
  offers: Offer[];
}

/** Identifiants d'affiliation, fournis au build. Absents : liens directs, non affiliés. */
export interface AffiliateConfig {
  amazonTagFr?: string;
  amazonTagDe?: string;
}

export type LinkState = 'ok' | 'unavailable' | 'broken' | 'unknown';

export interface LinkStatus {
  status: LinkState;
  lastChecked: string;
  /** Échecs consécutifs : une page n'est déclarée cassée qu'au deuxième. */
  failures: number;
}

export type LinkStatusMap = Record<string, LinkStatus>;

export const LINK_STATUS = linkStatus as LinkStatusMap;

/** Adresse sans identifiant d'affiliation : c'est elle qui est surveillée. */
export function offerBaseUrl(offer: Offer): string {
  if (offer.url) return offer.url;
  return MERCHANTS[offer.merchant].search(offer.query ?? '');
}

export interface ResolvedOffer {
  merchant: Merchant;
  url: string;
  affiliate: boolean;
}

/** Ajoute l'identifiant d'affiliation quand il est configuré pour ce marchand. */
export function resolveOffer(offer: Offer, config: AffiliateConfig): ResolvedOffer {
  const merchant = MERCHANTS[offer.merchant];
  const base = offerBaseUrl(offer);
  const tag =
    merchant.program === 'amazon-fr'
      ? config.amazonTagFr
      : merchant.program === 'amazon-de'
        ? config.amazonTagDe
        : undefined;
  if (!tag) return { merchant, url: base, affiliate: false };
  // Pas de `URL` ici : le cœur reste sans dépendance au DOM (app Expo).
  const url = `${base}${base.includes('?') ? '&' : '?'}tag=${encodeURIComponent(tag)}`;
  return { merchant, url, affiliate: true };
}

/**
 * Un seul Amazon à la fois : Amazon.fr quand l'app est en français, Amazon.de sinon
 * (les deux livrent au Luxembourg). L'autre ne sert que si le premier manque.
 * Les autres marchands restent.
 */
export function preferredOffers(offers: readonly Offer[], locale: string): Offer[] {
  const wanted: MerchantId = locale === 'fr' ? 'amazon-fr' : 'amazon-de';
  const hasWanted = offers.some((o) => o.merchant === wanted);
  return offers.filter((o) => {
    if (!o.merchant.startsWith('amazon-')) return true;
    return o.merchant === wanted || !hasWanted;
  });
}

/** Les offres à montrer, avec l'identifiant d'affiliation : visibles, puis le bon Amazon. */
export function resolveOffers(
  offers: readonly Offer[],
  config: AffiliateConfig,
  locale: string,
  status: LinkStatusMap = LINK_STATUS,
): ResolvedOffer[] {
  return preferredOffers(
    offers.filter((o) => isOfferVisible(o, status)),
    locale,
  ).map((o) => resolveOffer(o, config));
}

/** Une offre est montrée tant qu'elle n'a pas été déclarée cassée ou indisponible. */
export function isOfferVisible(offer: Offer, status: LinkStatusMap = LINK_STATUS): boolean {
  const state = status[offerBaseUrl(offer)]?.status;
  return state !== 'broken' && state !== 'unavailable';
}

export interface TierGroup {
  tier: Tier;
  products: Array<{ product: Product; offers: ResolvedOffer[] }>;
}

/** Les conseils d'achat d'un modèle, par palier, sans les offres masquées. */
export function productsFor(
  templateId: string,
  products: readonly Product[],
  config: AffiliateConfig,
  status: LinkStatusMap = LINK_STATUS,
  locale = 'de',
): TierGroup[] {
  return TIERS.map((tier) => ({
    tier,
    products: products
      .filter((p) => p.tier === tier && p.templateIds.includes(templateId))
      .map((product) => ({
        product,
        offers: resolveOffers(product.offers, config, locale, status),
      })),
  })).filter((group) => group.products.length > 0);
}

/** Toutes les adresses à surveiller (sans identifiant d'affiliation). */
export function productUrls(products: readonly Product[]): string[] {
  return [...new Set(products.flatMap((p) => p.offers.map(offerBaseUrl)))];
}
