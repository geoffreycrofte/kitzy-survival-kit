import type { AffiliateConfig } from '@kitzy/core';

/**
 * Identifiants d'affiliation, fournis au build par les variables de dépôt
 * (`KITZY_AMAZON_TAG_FR`, `KITZY_AMAZON_TAG_DE`). Sans eux, les liens sont directs.
 */
export const AFFILIATE: AffiliateConfig = {
  amazonTagFr: (import.meta.env.VITE_KITZY_AMAZON_TAG_FR as string | undefined) || undefined,
  amazonTagDe: (import.meta.env.VITE_KITZY_AMAZON_TAG_DE as string | undefined) || undefined,
};

export const amazonAffiliate = Boolean(AFFILIATE.amazonTagFr || AFFILIATE.amazonTagDe);
