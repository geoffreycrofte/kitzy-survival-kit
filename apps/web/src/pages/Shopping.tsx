import { useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { renderSVG } from 'uqr';
import {
  categoryName,
  encodeShare,
  shoppingList,
  type CategoryId,
  type ShoppingEntry,
} from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { BagIcon, BurrowIcon } from '../components/Icons';
import { addExtras, clearBought, removeExtra, toggleBought } from '../data/store';
import { usePantryAmount } from '../components/Pantry';
import { useContent } from '../lib/content';
import { announce } from '../lib/announce';
import { formatQuantity } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import { Loading } from '../components/Loading';

export function Shopping() {
  const { t } = useTranslation();
  usePageTitle(t('shopping.title'));
  const data = useKitzy();

  const entries = useMemo(
    () => (data ? shoppingList(data.kits, data.ctx, data.extras) : []),
    [data],
  );

  if (!data) return <Loading />;

  const toBuy = entries.filter((e) => !data.bought.includes(e.key));
  const groups = new Map<string, ShoppingEntry[]>();
  for (const entry of entries) {
    groups.set(entry.category, [...(groups.get(entry.category) ?? []), entry]);
  }
  const groupName = (id: string) =>
    id === 'extra' ? t('shopping.extras') : categoryName(id as CategoryId, data.ctx.locale);

  return (
    <div className="page">
      <h1 tabIndex={-1}>{t('shopping.title')}</h1>
      {!data.household ? (
        <div className="card">
          <p>{t('kits.noHousehold')}</p>
          <Link to="/foyer" className="button">
            {t('home.firstMissionCta')}
          </Link>
        </div>
      ) : (
        <>
          <p className="lead">
            {entries.length === 0
              ? t('shopping.empty')
              : t('shopping.intro', { count: toBuy.length })}
          </p>

          {[...groups.entries()].map(([group, items]) => (
            <section key={group} aria-labelledby={`shop-${group}`} className="kit-group">
              <h2 id={`shop-${group}`} className="section-title">
                {groupName(group)}
              </h2>
              <ul className="shop-list">
                {items.map((entry) => (
                  <ShoppingRow
                    key={`${entry.key}-${data.bought.includes(entry.key)}`}
                    entry={entry}
                    bought={data.bought.includes(entry.key)}
                  />
                ))}
              </ul>
            </section>
          ))}

          {data.bought.length > 0 && (
            <button
              type="button"
              className="button button--ghost"
              onClick={() => void clearBought()}
            >
              {t('shopping.clearBought')}
            </button>
          )}

          <AddExtraForm />
          {toBuy.length > 0 && <SharePanel entries={toBuy} />}
        </>
      )}
    </div>
  );
}

function ShoppingRow({ entry, bought: stored }: { entry: ShoppingEntry; bought: boolean }) {
  const { t } = useTranslation();
  // État local immédiat : la case change au clic, la base suit (la clé du composant resynchronise).
  const [bought, setBought] = useState(stored);
  const id = `buy-${entry.key}`;
  const { pantry, recipes } = useContent();
  const amount = usePantryAmount();
  // Produit du garde-manger : son nom dans la langue de l'app, et pour quelles recettes.
  const item = entry.extra?.pantryId
    ? pantry.find((p) => p.id === entry.extra?.pantryId)
    : undefined;
  const label = item ? `${item.name} (${item.pack})` : entry.label;
  const forRecipes = (entry.extra?.recipeIds ?? [])
    .map((rid) => recipes.find((r) => r.id === rid)?.title)
    .filter(Boolean)
    .join(', ');
  const quantity = formatQuantity(entry.quantity, entry.unit);

  return (
    <li className={`shop-card${bought ? ' shop-card--bought' : ''}`}>
      <div className="shop-card__main">
        <input
          id={id}
          type="checkbox"
          className="checkbox"
          checked={bought}
          // Nom et quantité en deux blocs visuels : on donne la phrase complète aux lecteurs d'écran.
          aria-label={t('shopping.item', { label, quantity })}
          onChange={() => {
            setBought(!bought);
            void toggleBought(entry.key);
          }}
        />
        <label htmlFor={id} className="shop-card__label">
          <span className="shop-card__name">{label}</span>
          <span className="shop-card__qty">{quantity}</span>
        </label>
        {entry.category === 'extra' && (
          <button
            type="button"
            className="button button--small button--ghost"
            aria-label={t('shopping.removeExtra', { label })}
            onClick={() => void removeExtra(entry.key.replace(/^extra-/, ''))}
          >
            {t('shopping.remove')}
          </button>
        )}
      </div>

      {forRecipes && (
        <p className="shop-card__note">{t('pantry.forRecipes', { recipes: forRecipes })}</p>
      )}
      {item && (
        <p className="shop-card__note">
          {bought
            ? t('pantry.stored', {
                amount: amount(item.fills.templateId, item.fills.amount * entry.quantity),
              })
            : t('pantry.willStore', {
                amount: amount(item.fills.templateId, item.fills.amount * entry.quantity),
              })}
        </p>
      )}

      {entry.replaces > 0 && (
        <p className="shop-card__note">
          {t('shopping.replaces', { quantity: formatQuantity(entry.replaces, entry.unit) })}
        </p>
      )}

      {entry.destinations.length > 0 && (
        <div className="shop-card__dest">
          <p id={`${id}-dest`} className="shop-card__dest-label">
            {bought ? t('shopping.storeNow') : t('shopping.storeIn')}
          </p>
          <ul aria-labelledby={`${id}-dest`} className="shop-card__dest-list">
            {entry.destinations.map((d) => {
              const place = d.kitType === 'home' ? t('shopping.home') : d.kitName;
              const Icon = d.kitType === 'home' ? BurrowIcon : BagIcon;
              const part = formatQuantity(d.quantity, entry.unit);
              return (
                <li key={d.kitId}>
                  <Link
                    to={`/kits/${d.kitId}/${d.key}`}
                    className="dest"
                    aria-label={t('shopping.storeLabel', {
                      quantity: part,
                      label: entry.label,
                      kit: d.kitName,
                    })}
                  >
                    <Icon width={18} height={18} />
                    <span className="dest__place">{place}</span>
                    {/* Une seule destination : la quantité est déjà dite en haut de la carte. */}
                    {entry.destinations.length > 1 && <span className="dest__qty">{part}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
}

function AddExtraForm() {
  const { t } = useTranslation();
  const [label, setLabel] = useState('');
  const [quantity, setQuantity] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const clean = label.trim();
    if (!clean) return ref.current?.focus();
    const q = Number.parseFloat(quantity.replace(',', '.'));
    await addExtras([{ label: clean, ...(q > 0 ? { quantity: q } : {}) }]);
    announce(t('shopping.extraAdded', { label: clean }));
    setLabel('');
    setQuantity('');
    ref.current?.focus();
  };
  return (
    <section className="card" aria-labelledby="add-extra">
      <h2 id="add-extra" className="card__label">
        {t('shopping.addExtra')}
      </h2>
      <form className="form form--inline" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="extra-label" className="field__label">
            {t('shopping.addExtraLabel')}
          </label>
          <input
            ref={ref}
            id="extra-label"
            className="input"
            maxLength={120}
            autoComplete="off"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="extra-quantity" className="field__label">
            {t('shopping.addExtraQuantity')}
          </label>
          <input
            id="extra-quantity"
            className="input input--short"
            inputMode="decimal"
            autoComplete="off"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <button type="submit" className="button button--ghost">
          {t('shopping.addExtraSubmit')}
        </button>
      </form>
    </section>
  );
}

function SharePanel({ entries }: { entries: ShoppingEntry[] }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');

  const create = () => {
    const encoded = encodeShare({
      v: 1,
      type: 'shopping',
      items: entries.map((e) => ({
        label: e.label,
        quantity: e.quantity,
        ...(e.unit ? { unit: e.unit } : {}),
      })),
    });
    setUrl(`${location.origin}${import.meta.env.BASE_URL}partage#${encoded}`);
  };

  const svg = useMemo(
    () =>
      url
        ? renderSVG(url, { ecc: 'L', border: 2, whiteColor: '#FFFFFF', blackColor: '#12302B' })
        : '',
    [url],
  );

  return (
    <section className="card" aria-labelledby="share-title">
      <h2 id="share-title" className="card__label">
        {t('shopping.share')}
      </h2>
      <p>{t('shopping.shareIntro')}</p>
      {!url ? (
        <button type="button" className="button" onClick={create}>
          {t('shopping.shareCreate')}
        </button>
      ) : (
        <div className="share">
          {url.length > 1800 && <p className="note">{t('shopping.tooBig')}</p>}
          <div
            className="share__qr"
            role="img"
            aria-label={t('shopping.shareQr')}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <div className="field">
            <label htmlFor="share-url" className="field__label">
              {t('shopping.shareLink')}
            </label>
            <input
              id="share-url"
              className="input"
              readOnly
              value={url}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div className="share__actions">
            <button
              type="button"
              className="button"
              onClick={async () => {
                await navigator.clipboard.writeText(url);
                announce(t('shopping.copied'));
              }}
            >
              {t('shopping.copy')}
            </button>
            <a
              className="button button--ghost"
              href={`mailto:?subject=${encodeURIComponent(t('shopping.emailSubject'))}&body=${encodeURIComponent(url)}`}
            >
              {t('shopping.email')}
            </a>
            {typeof navigator.share === 'function' && (
              <button
                type="button"
                className="button button--ghost"
                onClick={() =>
                  void navigator.share({ title: t('shopping.emailSubject'), url }).catch(() => {})
                }
              >
                {t('shopping.nativeShare')}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
