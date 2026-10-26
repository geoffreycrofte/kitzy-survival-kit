import { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { productsFor } from '@kitzy/core';
import { useContent } from '../lib/content';
import { AFFILIATE } from '../lib/affiliate';
import { useLocale } from '../lib/locale';
import { useOnline } from '../lib/useOnline';

const MARKER = { 1: '€', 2: '€€', 3: '€€€' } as const;

interface BuyingAdviceProps {
  templateId: string;
  /** Niveau du titre : 2 sur la page de l'article, 3 dans le tiroir (sous le nom de l'article). */
  level?: 2 | 3;
  /** Aperçu : la première suggestion seulement, et un bouton pour voir le reste. */
  preview?: boolean;
  onMore?: () => void;
  /** En quittant l'aperçu, le focus va sur ce qui vient d'apparaître (par défaut). */
  focusReveal?: boolean;
}

/**
 * Conseils d'achat d'un article, par palier de budget (§ 8).
 * Le symbole € est décoratif : le palier est dit en toutes lettres.
 */
export function BuyingAdvice({
  templateId,
  level = 2,
  preview = false,
  onMore,
  focusReveal = true,
}: BuyingAdviceProps) {
  const { t } = useTranslation();
  const online = useOnline();
  const { products } = useContent();
  const { locale } = useLocale();
  const id = useId();
  const revealed = useRef<HTMLHeadingElement>(null);
  const wasPreview = useRef(preview);
  const all = productsFor(templateId, products, AFFILIATE, undefined, locale);

  // En passant de l'aperçu à la liste complète, le focus va sur ce qui vient d'apparaître.
  useEffect(() => {
    if (wasPreview.current && !preview && focusReveal) revealed.current?.focus();
    wasPreview.current = preview;
  }, [preview, focusReveal]);

  if (all.length === 0) return null;
  const groups = preview
    ? all.slice(0, 1).map((g) => ({ ...g, products: g.products.slice(0, 1) }))
    : all;
  const hidden =
    all.reduce((n, g) => n + g.products.length, 0) -
    groups.reduce((n, g) => n + g.products.length, 0);
  const Title = level === 2 ? 'h2' : 'h3';
  const Tier = level === 2 ? 'h3' : 'h4';

  const offers = groups.flatMap((g) => g.products.flatMap((p) => p.offers));
  const affiliate = offers.some((o) => o.affiliate);
  const amazon = offers.some((o) => o.affiliate && o.merchant.program);

  return (
    <section className="card buy" aria-labelledby={`${id}-title`}>
      <Title id={`${id}-title`} className="section-title">
        {t('buy.title')}
      </Title>
      <p className="muted">{t('buy.intro')}</p>
      {!online && <p className="note">{t('buy.offline')}</p>}

      {groups.map((group, i) => (
        <section
          key={group.tier}
          className="buy__tier"
          aria-labelledby={`${id}-tier-${group.tier}`}
        >
          <Tier
            id={`${id}-tier-${group.tier}`}
            className="buy__tier-title"
            ref={i === 1 ? revealed : undefined}
            tabIndex={i === 1 ? -1 : undefined}
          >
            <span className="buy__marker" aria-hidden="true">
              {MARKER[group.tier]}
            </span>
            {t(`buy.tiers.${group.tier}`)}
          </Tier>
          {group.products.map(({ product, offers: productOffers }) => (
            <div key={product.id} className="buy__product">
              <p className="buy__name">{product.name}</p>
              <p className="buy__why">{product.why}</p>
              {productOffers.length > 0 ? (
                <ul className="buy__offers">
                  {productOffers.map((offer) => (
                    <li key={offer.url}>
                      <a
                        href={offer.url}
                        className="buy__link"
                        target="_blank"
                        rel={
                          offer.affiliate ? 'sponsored noopener noreferrer' : 'noopener noreferrer'
                        }
                        aria-label={`${t('buy.searchLabel', { name: product.name, merchant: offer.merchant.name })} ${t('guide.newWindow')}`}
                      >
                        {t('buy.search', { merchant: offer.merchant.name })}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted small">{t('buy.noOffer')}</p>
              )}
            </div>
          ))}
        </section>
      ))}

      {preview && hidden > 0 && onMore && (
        <button type="button" className="button button--ghost" onClick={onMore}>
          {t('buy.more', { count: hidden })}
        </button>
      )}

      <div className="buy__disclosure">
        {affiliate && <p>{t('buy.affiliate')}</p>}
        {amazon && <p>{t('buy.amazon')}</p>}
        <Link to="/transparence" className="text-link">
          {t('buy.transparency')}
        </Link>
      </div>
    </section>
  );
}
