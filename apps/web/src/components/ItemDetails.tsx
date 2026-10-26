import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { lotState, sortLotsFifo, type KitRow, type Lot } from '@kitzy/core';
import { parseQuantity } from './AddLotForm';
import { BuyingAdvice } from './BuyingAdvice';
import { DateInput } from './DateInput';
import { PantryShelf } from './Pantry';
import { StatusChips } from './StatusChips';
import {
  consume,
  deleteItem,
  markCharged,
  removeLot,
  setLotExpiry,
  setTarget,
} from '../data/store';
import { announce } from '../lib/announce';
import { formatDate, formatQuantity } from '../lib/format';

interface ItemDetailsProps {
  row: KitRow;
  kitId: string;
  today: string;
  /** 2 sur la page de l'article, 3 dans le tiroir (sous le nom de l'article). */
  level?: 2 | 3;
  /** Le tiroir affiche lui-même les suggestions d'achat. */
  buying?: boolean;
}

/**
 * Tout ce qui suit le formulaire d'ajout : ce que tu as, retirer, recharger, pourquoi c'est utile,
 * garde-manger, où l'acheter, réglages d'un objet personnel. Sur la page et dans le tiroir déplié.
 */
export function ItemDetails({ row, kitId, today, level = 2, buying = true }: ItemDetailsProps) {
  const { t } = useTranslation();
  const H = level === 2 ? 'h2' : 'h3';
  const { template, item, status } = row;
  const lots = item ? sortLotsFifo(item.lots) : [];

  return (
    <>
      {/* Rien de rangé : pas de section vide. */}
      {item && lots.length > 0 && (
        <section aria-labelledby="item-lots" className="lots">
          <H id="item-lots" className="section-title">
            {t('item.lots')}
          </H>
          <StatusChips status={status} unit={row.unit} />
          <ul className="lot-list">
            {lots.map((lot) => (
              <LotRow key={lot.id} lot={lot} itemId={item.id} row={row} today={today} />
            ))}
          </ul>
        </section>
      )}

      {item && status.usable > 0 && <UseForm itemId={item.id} row={row} H={H} />}

      {item?.battery && status.battery && (
        <section className="card" aria-labelledby="item-battery">
          <H id="item-battery" className="card__label">
            {t('item.battery')}
          </H>
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

      {template?.guide && (
        <p>
          <Link to={`/guide/${template.guide}`} className="text-link">
            {t('item.guideLink')}
          </Link>
        </p>
      )}

      {template && <PantryShelf templateId={template.id} level={level} />}

      {template && buying && <BuyingAdvice templateId={template.id} level={level} />}

      {!template && item && <CustomItemSettings itemId={item.id} row={row} kitId={kitId} H={H} />}
    </>
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
  const tracking = row.template?.tracking.expiry ?? 'none';
  const needsDate = !lot.expiry && tracking !== 'none';
  return (
    <li className={`lot lot--${state}`}>
      <span className="lot__text">
        {label}
        {stateText && <strong className="lot__state">, {stateText}</strong>}
        {needsDate && <LotDate itemId={itemId} lot={lot} tracking={tracking} />}
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

/** Un lot rangé sans date (achat coché dans la liste) : on invite à ajouter celle de l'emballage. */
function LotDate({ itemId, lot, tracking }: { itemId: string; lot: Lot; tracking: 'dlc' | 'ddm' }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const id = `lot-date-${lot.id}`;
  if (!open) {
    return (
      <span className="lot__date">
        {t('item.addDateHint')}{' '}
        <button
          type="button"
          className="button button--small button--ghost"
          onClick={() => setOpen(true)}
        >
          {t('item.addDate')}
        </button>
      </span>
    );
  }
  return (
    <form
      className="lot__date-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!date) return;
        await setLotExpiry(itemId, lot.id, date, tracking);
        announce(t('item.dateAdded'));
      }}
    >
      <label htmlFor={id} className="field__label">
        {t('item.expiry')}
      </label>
      <DateInput id={id} value={date} onChange={(e) => setDate(e.target.value)} required />
      <button type="submit" className="button button--small">
        {t('item.saveDate')}
      </button>
    </form>
  );
}

function UseForm({ itemId, row, H }: { itemId: string; row: KitRow; H: 'h2' | 'h3' }) {
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
      <H id="use-lot" className="card__label">
        {t('item.use')}
      </H>
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
  H,
}: {
  itemId: string;
  row: KitRow;
  kitId: string;
  H: 'h2' | 'h3';
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [target, setTargetValue] = useState(String(row.status.target));
  return (
    <section className="card" aria-labelledby="custom-settings">
      <H id="custom-settings" className="card__label">
        {t('item.customTarget')}
      </H>
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
