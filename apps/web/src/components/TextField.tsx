import { useId } from 'react';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  multiline?: boolean;
  type?: 'text' | 'tel';
  autoComplete?: string;
  maxLength?: number;
  className?: string;
}

/** Champ texte libre avec étiquette visible et aide liée (RAWeb 11.1, 11.2). */
export function TextField({
  label,
  value,
  onChange,
  hint,
  multiline = false,
  type = 'text',
  autoComplete = 'off',
  maxLength = 300,
  className,
}: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const common = {
    id,
    className: multiline ? 'input input--area' : 'input',
    value,
    maxLength,
    'aria-describedby': hint ? hintId : undefined,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  };
  return (
    <div className={`field${className ? ` ${className}` : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea {...common} rows={3} />
      ) : (
        <input
          {...common}
          type={type}
          autoComplete={autoComplete}
          inputMode={type === 'tel' ? 'tel' : undefined}
        />
      )}
    </div>
  );
}
