import { useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { isIsoDate, kitRows, lotState, sortLotsFifo, tx, type KitRow, type Lot } from '@kitzy/core';
import { useLocale } from '../lib/locale';
import { Meter } from '../components/Meter';
import { BuyingAdvice } from '../components/BuyingAdvice';
import { StatusChips } from '../components/StatusChips';
import { useKitzy } from '../data/derived';
import {
  addLotToItem,
  addLotToTemplate,
  consume,
  deleteItem,
  markCharged,
  removeLot,
  setTarget,
} from '../data/store';
import { announce } from '../lib/announce';
import { formatDate, formatQuantity } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import { NotFound } from './NotFound';
import { Loading } from '../components/Loading';

/** Lit « 4,5 » comme « 4.5 ». */
function parseQuantity(value: string): number {
  return Number.parseFloat(value.replace(',', '.').replace(/\s/g, ''));
}

export function Item() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { kitId, key } = useParams();
  const scanned = (useLocation().state as { scanned?: string } | null)?.scanned;
  const data = useKitzy();
  const kit = data?.kits.find((k) => k.id === kitId);

  let row: KitRow | undefined;
  if (data && kit && key) {
    const rows = kitRows(kit, data.ctx, 'complete');
    row = rows.find((r) => r.key === key);
    if (!row && key.startsWith('article-')) {
      const itemId = key.slice('article-'.length);
      row = rows.find((r) => r.item?.id === itemId);
    }
  }
  usePageTitle(row?.name ?? t('kits.title'));

  if (!data) return <Loading />;
  if (!kit || !row) return <NotFound />;

  const { template, item, status, unit } = row;
  const sourceLabel = template ? t(`item.${template.source}`) : t('item.custom');
  const targetText = t(kit.type === 'home' ? 'item.target' : 'item.targetBag', {
    quantity: formatQuantity(status.target, unit),
  });

  return (
    <div className="page item-page">
      <p className="breadcrumb">
        <Link to={`/kits/${kit.id}`}>{kit.name}</Link>
      </p>
      <h1 tabIndex={-1}>{row.name}</h1>
      {scanned && <p className="note">{t('scan.recognized', { code: scanned })}</p>}
      <p className="tag">{sourceLabel}</p>
      {template?.hint && <p className="lead">{tx(template.hint, locale)}</p>}
      {template?.safety && (
        <p className="note">
          <strong>{t('item.warning')}</strong> {tx(template.safety, locale)}
        </p>
      )}

      <section className="card" aria-labelledby="item-status">
        <h2 id="item-status" className="card__label">
          {targetText}
        </h2>
        <Meter
          value={status.coverage}
          label={t('item.coverage')}
          valueText={t('item.have', { quantity: formatQuantity(status.usable, unit) })}
        />
        <StatusChips status={status} unit={unit} />
        {template?.guide && (
          <Link to={`/guide/${template.guide}`} className="text-link">
            {t('item.guideLink')}
          </Link>
        )}
      </section>

      <AddLotForm row={row} kitId={kit.id} />

      <section aria-labelledby="item-lots" className="lots">
        <h2 id="item-lots" className="section-title">
          {t('item.lots')}
        </h2>
        {item && item.lots.length > 0 ? (
          <ul className="lot-list">
            {sortLotsFifo(item.lots).map((lot) => (
              <LotRow key={lot.id} lot={lot} itemId={item.id} row={row} today={data.today} />
            ))}
          </ul>
        ) : (
          <p className="muted">{t('item.noLots')}</p>
        )}
      </section>

      {item && status.usable > 0 && <UseForm itemId={item.id} row={row} />}

      {item?.battery && status.battery && (
        <section className="card" aria-labelledby="item-battery">
          <h2 id="item-battery" className="card__label">
            {t('item.battery')}
          </h2>
          <p>
            {t('item.batteryLast', { date: formatDate(item.battery.lastChargedAt) })}{' '}
            {t('item.batteryNext', { date: formatDate(status.battery.dueOn) })}
          </p>
          <button
            type="button"
            className="button"
            onClick={async () => {
              await markCharged(item.id);
              announce(t('item.chargedDone'));
            }}
          >
            {t('item.charged')}
          </button>
        </section>
      )}

      {template && <BuyingAdvice templateId={template.id} />}

      {!template && item && <CustomItemSettings itemId={item.id} row={row} kitId={kit.id} />}
    </div>
  );
}

function lotLabel(lot: Lot, unit: KitRow['unit'], t: TFunction): string {
  const quantity = formatQuantity(lot.quantity, unit);
  if (!lot.expiry) return t('item.lotNoDate', { quantity });
  return t(lot.expiryType === 'dlc' ? 'item.lotDlc' : 'item.lotDdm', {
    quantity,
    date: formatDate(lot.expiry),
  });
}

function LotRow({
  lot,
  itemId,
  row,
  today,
}: {
  lot: Lot;
  itemId: string;
  row: KitRow;
  today: string;
}) {
  const { t } = useTranslation();
  const label = lotLabel(lot, row.unit, t);
  const state = lotState(lot, today);
  const stateText =
    state === 'expired'
      ? t('item.lotExpired')
      : state === 'soon'
        ? t('item.lotSoon')
        : state === 'past-best-before'
          ? t('item.lotPast')
          : '';
  return (
    <li className={`lot lot--${state}`}>
      <span>
        {label}
        {stateText && <strong className="lot__state">, {stateText}</strong>}
      </span>
      <button
        type="button"
        className="button button--small button--ghost"
        aria-label={t('item.removeLot', { label })}
        onClick={() => void removeLot(itemId, lot.id)}
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" />
        </svg>
      </button>
    </li>
  );
}

function AddLotForm({ row, kitId }: { row: KitRow; kitId: string }) {
  const { t } = useTranslation();
  const tracking = row.template?.tracking.expiry ?? 'ddm';
  const [quantity, setQuantity] = useState('');
  const [expiry, setExpiry] = useState('');
  const [expiryType, setExpiryType] = useState<'dlc' | 'ddm'>(tracking === 'dlc' ? 'dlc' : 'ddm');
  const [errors, setErrors] = useState<{ quantity?: string; expiry?: string }>({});
  const quantityRef = useRef<HTMLInputElement>(null);
  const expiryRef = useRef<HTMLInputElement>(null);
  const showDate = tracking !== 'none';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const q = parseQuantity(quantity);
    const next: typeof errors = {};
    if (!(q > 0)) next.quantity = t('item.errorQuantity');
    if (expiry && !isIsoDate(expiry)) next.expiry = t('item.errorDate');
    setErrors(next);
    if (next.quantity) return quantityRef.current?.focus();
    if (next.expiry) return expiryRef.current?.focus();

    const lot = {
      quantity: q,
      ...(showDate && expiry ? { expiry, expiryType } : {}),
    };
    if (row.template) await addLotToTemplate(kitId, row.template.id, row.unit, lot);
    else if (row.item) await addLotToItem(row.item.id, lot);
    announce(t('item.added', { quantity: formatQuantity(q, row.unit) }));
    setQuantity('');
    setExpiry('');
  };

  return (
    <section className="card" aria-labelledby="add-lot">
      <h2 id="add-lot" className="card__label">
        {t('item.add')}
      </h2>
      <form className="form" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="lot-quantity" className="field__label">
            {t('item.quantity', { unit: t(`units.${row.unit}`, { count: 2 }) })}
          </label>
          {errors.quantity && (
            <p id="lot-quantity-error" className="field__error">
              {errors.quantity}
            </p>
          )}
          <input
            ref={quantityRef}
            id="lot-quantity"
            className="input input--short"
            inputMode="decimal"
            autoComplete="off"
            value={quantity}
            aria-invalid={errors.quantity ? true : undefined}
            aria-describedby={errors.quantity ? 'lot-quantity-error' : undefined}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        {showDate && (
          <>
            <div className="field">
              <label htmlFor="lot-expiry" className="field__label">
                {t('item.expiry')}
              </label>
              <p id="lot-expiry-hint" className="field__hint">
                {t('item.expiryHint')}
              </p>
              {errors.expiry && (
                <p id="lot-expiry-error" className="field__error">
                  {errors.expiry}
                </p>
              )}
              <input
                ref={expiryRef}
                id="lot-expiry"
                className="input input--short"
                type="date"
                value={expiry}
                aria-invalid={errors.expiry ? true : undefined}
                aria-describedby={
                  errors.expiry ? 'lot-expiry-hint lot-expiry-error' : 'lot-expiry-hint'
                }
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
            {expiry && (
              <fieldset className="choice">
                <legend className="field__label">{t('item.expiryType')}</legend>
                {(['ddm', 'dlc'] as const).map((type) => (
                  <label key={type} className="choice__option">
                    <input
                      type="radio"
                      name="expiry-type"
                      value={type}
                      checked={expiryType === type}
                      onChange={() => setExpiryType(type)}
                    />
                    {t(`item.${type}`)}
                  </label>
                ))}
              </fieldset>
            )}
          </>
        )}
        <button type="submit" className="button">
          {t('item.addSubmit')}
        </button>
      </form>
    </section>
  );
}

function UseForm({ itemId, row }: { itemId: string; row: KitRow }) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const q = parseQuantity(quantity);
    let message = '';
    if (!(q > 0)) message = t('item.errorQuantity');
    else if (q > row.status.quantity)
      message = t('item.errorTooMuch', { quantity: formatQuantity(row.status.quantity, row.unit) });
    setError(message);
    if (message) return ref.current?.focus();
    await consume(itemId, q);
    announce(t('item.used', { quantity: formatQuantity(q, row.unit) }));
    setQuantity('1');
  };

  return (
    <section className="card" aria-labelledby="use-lot">
      <h2 id="use-lot" className="card__label">
        {t('item.use')}
      </h2>
      <form className="form form--inline" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="use-quantity" className="field__label">
            {t('item.quantity', { unit: t(`units.${row.unit}`, { count: 2 }) })}
          </label>
          {error && (
            <p id="use-quantity-error" className="field__error">
              {error}
            </p>
          )}
          <input
            ref={ref}
            id="use-quantity"
            className="input input--short"
            inputMode="decimal"
            autoComplete="off"
            value={quantity}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'use-quantity-error' : undefined}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <button type="submit" className="button button--ghost">
          {t('item.useSubmit')}
        </button>
      </form>
    </section>
  );
}

function CustomItemSettings({
  itemId,
  row,
  kitId,
}: {
  itemId: string;
  row: KitRow;
  kitId: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [target, setTargetValue] = useState(String(row.status.target));
  return (
    <section className="card" aria-labelledby="custom-settings">
      <h2 id="custom-settings" className="card__label">
        {t('item.customTarget')}
      </h2>
      <form
        className="form form--inline"
        onSubmit={async (e) => {
          e.preventDefault();
          const q = parseQuantity(target);
          if (q > 0) {
            await setTarget(itemId, q);
            announce(t('item.customTargetSave'));
          }
        }}
      >
        <div className="field">
          <label htmlFor="custom-target" className="field__label">
            {t('item.quantity', { unit: t(`units.${row.unit}`, { count: 2 }) })}
          </label>
          <input
            id="custom-target"
            className="input input--short"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTargetValue(e.target.value)}
          />
        </div>
        <button type="submit" className="button button--ghost">
          {t('item.customTargetSave')}
        </button>
      </form>
      <button
        type="button"
        className="button button--danger"
        onClick={async () => {
          await deleteItem(itemId);
          announce(t('item.deleted'));
          navigate(`/kits/${kitId}`);
        }}
      >
        {t('item.delete')}
      </button>
    </section>
  );
}
