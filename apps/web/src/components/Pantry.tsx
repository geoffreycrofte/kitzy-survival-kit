import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  MEALS_TEMPLATE,
  pantryFor,
  pantryNeeds,
  pantryValue,
  resolveOffers,
  tx,
  type PantryItem,
  type Recipe,
} from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { addPantryToList } from '../data/store';
import { AFFILIATE } from '../lib/affiliate';
import { announce } from '../lib/announce';
import { useContent } from '../lib/content';
import { formatQuantity } from '../lib/format';
import { useLocale } from '../lib/locale';

const number = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);

/** Ce qu'apporte un produit, en clair : « 1 repas », « 1 L de lait UHT ou en poudre »… */
export function usePantryAmount() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const data = useKitzy();
  return (templateId: string, amount: number): string => {
    if (templateId === MEALS_TEMPLATE) {
      return t('pantry.meals', { count: amount, value: number(amount, locale) });
    }
    const template = data?.ctx.catalog.find((c) => c.id === templateId);
    const unit = template?.home?.unit;
    return t('pantry.fills', {
      quantity: formatQuantity(amount, unit),
      name: template ? tx(template.name, locale) : templateId,
    });
  };
}

/** Un produit du garde-manger : ce qu'il apporte, combien de temps il se garde, où l'acheter. */
function PantryRow({
  item,
  packs = 1,
  action,
}: {
  item: PantryItem;
  packs?: number;
  action?: ReactNode;
}) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const amount = usePantryAmount();
  const offers = resolveOffers(item.offers, AFFILIATE, locale);
  const years = item.keepsMonths / 12;
  const keeps =
    item.keepsMonths >= 12
      ? t('pantry.keepsYears', { count: years, value: number(years, locale) })
      : t('pantry.keepsMonths', { count: item.keepsMonths });

  return (
    <li className="pantry__item">
      <div className="pantry__head">
        <p className="pantry__name">
          {packs > 1 && (
            <span className="pantry__packs">{t('pantry.packs', { count: packs })}</span>
          )}
          {item.name} <span className="pantry__pack">({item.pack})</span>
        </p>
        <p className="pantry__value">{amount(item.fills.templateId, item.fills.amount * packs)}</p>
      </div>
      <p className="pantry__meta">
        {keeps}
        {item.readyToEat ? ` · ${t('pantry.ready')}` : ` · ${t('pantry.cook')}`}
      </p>
      <div className="pantry__actions">
        {offers.map((offer) => (
          <a
            key={offer.url}
            href={offer.url}
            className="buy__link"
            target="_blank"
            rel={offer.affiliate ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
            aria-label={`${t('buy.searchLabel', { name: item.name, merchant: offer.merchant.name })} ${t('guide.newWindow')}`}
          >
            {t('buy.search', { merchant: offer.merchant.name })}
          </a>
        ))}
        {action}
      </div>
    </li>
  );
}

/** La mention d'affiliation, dite là où il y a des liens. */
function Disclosure({ items }: { items: readonly PantryItem[] }) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const affiliate = items.some((i) =>
    resolveOffers(i.offers, AFFILIATE, locale).some((o) => o.affiliate),
  );
  return (
    <div className="buy__disclosure">
      {affiliate && <p>{t('buy.affiliate')}</p>}
      {affiliate && <p>{t('buy.amazon')}</p>}
      <Link to="/transparence" className="text-link">
        {t('buy.transparency')}
      </Link>
    </div>
  );
}

/**
 * Sur la page d'un article (« Nourriture non périssable », lait, compotes…) :
 * les produits courants qui le remplissent, à mettre sur la liste un par un.
 */
export function PantryShelf({ templateId }: { templateId: string }) {
  const { t } = useTranslation();
  const { pantry } = useContent();
  const items = pantryFor(templateId, pantry);
  if (items.length === 0) return null;

  return (
    <section className="card pantry" aria-labelledby="pantry-title">
      <h2 id="pantry-title" className="section-title">
        {t('pantry.title')}
      </h2>
      <p className="muted">{t('pantry.intro')}</p>
      <ul className="pantry__list">
        {items.map((item) => (
          <PantryRow
            key={item.id}
            item={item}
            action={
              <button
                type="button"
                className="button button--small button--ghost"
                aria-label={t('pantry.addOneLabel', { name: item.name })}
                onClick={async () => {
                  await addPantryToList([{ pantryId: item.id, packs: 1 }]);
                  announce(t('pantry.added'));
                }}
              >
                {t('pantry.addOne')}
              </button>
            }
          />
        ))}
      </ul>
      <Disclosure items={items} />
    </section>
  );
}

const MAX_TIMES = 10;

/**
 * En bas d'une recette : ce qu'il faut garder en réserve pour la faire une ou plusieurs fois,
 * ce que ces achats apportent, et un bouton pour tout mettre sur la liste de courses.
 */
export function RecipeReserve({ recipe }: { recipe: Recipe }) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { pantry } = useContent();
  const [times, setTimes] = useState(1);
  const [added, setAdded] = useState(false);
  const needs = pantryNeeds([{ recipe, times }]);
  if (needs.length === 0) return null;

  const value = pantryValue(needs, pantry);
  const rows = needs
    .map((need) => ({ need, item: pantry.find((p) => p.id === need.pantryId) }))
    .filter((r): r is { need: (typeof needs)[number]; item: PantryItem } => Boolean(r.item));
  const change = (delta: number) => {
    setTimes((n) => Math.min(MAX_TIMES, Math.max(1, n + delta)));
    setAdded(false);
  };

  return (
    <section className="card pantry" aria-labelledby="reserve-title">
      <h2 id="reserve-title" className="section-title">
        {t('pantry.recipeTitle')}
      </h2>
      <p className="muted">{t('pantry.recipeIntro')}</p>

      <div className="stepper">
        <span id="reserve-times" className="stepper__label">
          {t('pantry.times')}
        </span>
        <div className="stepper__controls" role="group" aria-labelledby="reserve-times">
          <button
            type="button"
            className="stepper__button"
            aria-label={t('pantry.lessTimes')}
            disabled={times <= 1}
            onClick={() => change(-1)}
          >
            −
          </button>
          <output className="stepper__input stepper__output" aria-live="polite">
            {t('pantry.timesValue', { count: times })}
          </output>
          <button
            type="button"
            className="stepper__button"
            aria-label={t('pantry.moreTimes')}
            disabled={times >= MAX_TIMES}
            onClick={() => change(1)}
          >
            +
          </button>
        </div>
      </div>

      <p className="pantry__gain">
        {t('pantry.gain', {
          count: value.meals,
          value: number(value.meals, locale),
          serves: recipe.serves * times,
        })}
      </p>

      <ul className="pantry__list">
        {rows.map(({ need, item }) => (
          <PantryRow key={item.id} item={item} packs={need.packs} />
        ))}
      </ul>
      <p className="muted small">{t('pantry.staples')}</p>

      {added ? (
        <p className="pantry__done" role="status">
          {t('pantry.addedAll')}{' '}
          <Link to="/courses" className="text-link">
            {t('pantry.seeList')}
          </Link>
        </p>
      ) : (
        <button
          type="button"
          className="button"
          onClick={async () => {
            await addPantryToList(
              needs.map((n) => ({ pantryId: n.pantryId, packs: n.packs, recipeIds: n.recipeIds })),
            );
            setAdded(true);
          }}
        >
          {t('pantry.addAll')}
        </button>
      )}
      <Disclosure items={rows.map((r) => r.item)} />
    </section>
  );
}
