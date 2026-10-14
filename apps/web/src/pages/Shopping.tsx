import { useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { renderSVG } from 'uqr';
import { CATEGORIES, encodeShare, shoppingList, type ShoppingEntry } from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { addExtras, clearBought, removeExtra, toggleBought } from '../data/store';
import { announce } from '../lib/announce';
import { formatQuantity } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';

export function Shopping() {
  const { t } = useTranslation();
  usePageTitle(t('shopping.title'));
  const data = useKitzy();

  const entries = useMemo(
    () => (data ? shoppingList(data.kits, data.ctx, data.extras) : []),
    [data],
  );

  if (!data) return <p>{t('app.loading')}</p>;

  const toBuy = entries.filter((e) => !data.bought.includes(e.key));
  const groups = new Map<string, ShoppingEntry[]>();
  for (const entry of entries) {
    groups.set(entry.category, [...(groups.get(entry.category) ?? []), entry]);
  }
  const groupName = (id: string) =>
    id === 'extra' ? t('shopping.extras') : (CATEGORIES.find((c) => c.id === id)?.name.fr ?? id);

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
              <ul className="row-list">
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
  const quantity = formatQuantity(entry.quantity, entry.unit);
  const details = [
    entry.kitNames.length ? t('shopping.forKits', { kits: entry.kitNames.join(', ') }) : '',
    entry.replaces > 0
      ? t('shopping.replaces', { quantity: formatQuantity(entry.replaces, entry.unit) })
      : '',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <li className={`row shop-row${bought ? ' shop-row--bought' : ''}`}>
      <div className="shop-row__check">
        <input
          id={id}
          type="checkbox"
          className="checkbox"
          checked={bought}
          onChange={() => {
            setBought(!bought);
            void toggleBought(entry.key);
          }}
        />
        <label htmlFor={id}>
          {t('shopping.item', { label: entry.label, quantity })}
          {details && <span className="shop-row__details">{details}</span>}
        </label>
      </div>
      {entry.target && (
        <Link
          to={`/kits/${entry.target.kitId}/${entry.target.key}`}
          className="text-link"
          aria-label={t('shopping.storeLabel', { label: entry.label })}
        >
          {t('shopping.store')}
        </Link>
      )}
      {entry.category === 'extra' && (
        <button
          type="button"
          className="button button--small button--ghost"
          onClick={() => void removeExtra(entry.key.replace(/^extra-/, ''))}
        >
          {t('shopping.removeExtra', { label: entry.label })}
        </button>
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
