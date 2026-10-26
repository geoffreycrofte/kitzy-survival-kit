import { useId, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { isIsoDate, type KitRow } from '@kitzy/core';
import { addLotToItem, addLotToTemplate } from '../data/store';
import { announce } from '../lib/announce';
import { formatQuantity } from '../lib/format';

/** Lit « 4,5 » comme « 4.5 ». */
export function parseQuantity(value: string): number {
  return Number.parseFloat(value.replace(',', '.').replace(/\s/g, ''));
}

interface AddLotFormProps {
  row: KitRow;
  kitId: string;
  /** Sac ou maison : « pour ton foyer » ou « dans ce sac ». */
  bag: boolean;
  /** Quantité déjà saisie (ex. ce qui vient d'être acheté). */
  initialQuantity?: number;
  /** Sans carte ni titre : dans le tiroir, le titre est le nom de l'article. */
  bare?: boolean;
  onAdded?: () => void;
}

/**
 * Ranger un lot : la quantité (avec, juste à côté, ce qu'il en faut et ce que tu as déjà),
 * puis la date de l'emballage. Utilisé sur la page de l'article et dans le tiroir.
 */
export function AddLotForm({ row, kitId, bag, initialQuantity, bare, onAdded }: AddLotFormProps) {
  const { t } = useTranslation();
  const id = useId();
  const tracking = row.template?.tracking.expiry ?? 'ddm';
  const [quantity, setQuantity] = useState(
    initialQuantity ? String(initialQuantity).replace('.', ',') : '',
  );
  const [expiry, setExpiry] = useState('');
  const [expiryType, setExpiryType] = useState<'dlc' | 'ddm'>(tracking === 'dlc' ? 'dlc' : 'ddm');
  const [errors, setErrors] = useState<{ quantity?: string; expiry?: string }>({});
  const quantityRef = useRef<HTMLInputElement>(null);
  const expiryRef = useRef<HTMLInputElement>(null);
  const showDate = tracking !== 'none';
  const { status, unit } = row;

  const need = t(bag ? 'item.targetBag' : 'item.target', {
    quantity: formatQuantity(status.target, unit),
  });
  const have =
    status.usable > 0 ? t('item.have', { quantity: formatQuantity(status.usable, unit) }) : '';

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
    if (row.template) await addLotToTemplate(kitId, row.template.id, unit, lot);
    else if (row.item) await addLotToItem(row.item.id, lot);
    setQuantity('');
    setExpiry('');
    onAdded?.();
    announce(t('item.added', { quantity: formatQuantity(q, unit) }));
  };

  const form = (
    <form className="form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor={`${id}-quantity`} className="field__label">
          {t('item.quantity', { unit: t(`units.${unit}`, { count: 2 }) })}
        </label>
        <p id={`${id}-need`} className="field__hint add-lot__need">
          {need} {have}
        </p>
        {errors.quantity && (
          <p id={`${id}-quantity-error`} className="field__error">
            {errors.quantity}
          </p>
        )}
        <input
          ref={quantityRef}
          id={`${id}-quantity`}
          className="input input--short add-lot__quantity"
          inputMode="decimal"
          autoComplete="off"
          value={quantity}
          aria-invalid={errors.quantity ? true : undefined}
          aria-describedby={errors.quantity ? `${id}-need ${id}-quantity-error` : `${id}-need`}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      {showDate && (
        <>
          <div className="field">
            <label htmlFor={`${id}-expiry`} className="field__label">
              {t('item.expiry')}
            </label>
            <p id={`${id}-expiry-hint`} className="field__hint">
              {t('item.expiryHint')}
            </p>
            {errors.expiry && (
              <p id={`${id}-expiry-error`} className="field__error">
                {errors.expiry}
              </p>
            )}
            <input
              ref={expiryRef}
              id={`${id}-expiry`}
              className="input input--short"
              type="date"
              value={expiry}
              aria-invalid={errors.expiry ? true : undefined}
              aria-describedby={
                errors.expiry ? `${id}-expiry-hint ${id}-expiry-error` : `${id}-expiry-hint`
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
                    name={`${id}-expiry-type`}
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
  );

  if (bare) return form;
  return (
    <section className="card" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="card__label">
        {t('item.add')}
      </h2>
      {form}
    </section>
  );
}
