import { useId } from 'react';
import { useTranslation } from 'react-i18next';

interface StepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  hint?: string;
}

/** Champ numérique avec boutons − et +, utilisable au clavier et au lecteur d'écran. */
export function Stepper({ label, value, onChange, min = 0, max = 20, hint }: StepperProps) {
  const { t } = useTranslation();
  const id = useId();
  const hintId = `${id}-hint`;
  const set = (next: number) => onChange(Math.min(max, Math.max(min, next)));

  return (
    <div className="stepper">
      <label htmlFor={id} className="stepper__label">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      <div className="stepper__controls">
        <button
          type="button"
          className="stepper__button"
          aria-label={t('household.less', { label })}
          aria-controls={id}
          disabled={value <= min}
          onClick={() => set(value - 1)}
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          id={id}
          className="stepper__input"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          aria-describedby={hint ? hintId : undefined}
          onChange={(e) => {
            const n = Number.parseInt(e.target.value, 10);
            set(Number.isNaN(n) ? min : n);
          }}
        />
        <button
          type="button"
          className="stepper__button"
          aria-label={t('household.more', { label })}
          aria-controls={id}
          disabled={value >= max}
          onClick={() => set(value + 1)}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}
