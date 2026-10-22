import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { productsFor } from '@kitzy/core';
import { useContent } from '../lib/content';
import { AFFILIATE } from '../lib/affiliate';
import { useOnline } from '../lib/useOnline';

const MARKER = { 1: '€', 2: '€€', 3: '€€€' } as const;

/**
 * Conseils d'achat d'un article, par palier de budget (§ 8).
 * Le symbole € est décoratif : le palier est dit en toutes lettres.
 */
export function BuyingAdvice({ templateId }: { templateId: string }) {
  const { t } = useTranslation();
  const online = useOnline();
  const { products } = useContent();
  const groups = productsFor(templateId, products, AFFILIATE);
  if (groups.length === 0) return null;

  const offers = groups.flatMap((g) => g.products.flatMap((p) => p.offers));
  const affiliate = offers.some((o) => o.affiliate);
  const amazon = offers.some((o) => o.affiliate && o.merchant.program);

  return (
    <section className="card buy" aria-labelledby="buy-title">
      <h2 id="buy-title" className="section-title">
        {t('buy.title')}
      </h2>
      <p className="muted">{t('buy.intro')}</p>
      {!online && <p className="note">{t('buy.offline')}</p>}

      {groups.map((group) => (
        <section key={group.tier} className="buy__tier" aria-labelledby={`buy-tier-${group.tier}`}>
          <h3 id={`buy-tier-${group.tier}`} className="buy__tier-title">
            <span className="buy__marker" aria-hidden="true">
              {MARKER[group.tier]}
            </span>
            {t(`buy.tiers.${group.tier}`)}
          </h3>
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
