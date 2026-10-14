interface MeterProps {
  /** Entre 0 et 1 */
  value: number;
  label: string;
  /** Texte lisible de la valeur, annoncé et affiché à côté */
  valueText: string;
}

/** Jauge avec valeur textuelle visible : jamais de couleur seule (RAWeb 3.1). */
export function Meter({ value, label, valueText }: MeterProps) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div className="meter">
      <div
        className="meter__track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={valueText}
      >
        <div className="meter__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="meter__text">{valueText}</span>
    </div>
  );
}
