import type { ComponentProps } from 'react';
import { CalendarIcon } from './Icons';

/**
 * Champ date avec l'icône calendrier de Kitzy. Le sélecteur natif reste celui du navigateur :
 * sa propre icône est rendue transparente et couvre tout le champ, un appui n'importe où l'ouvre.
 */
export function DateInput({ className = '', ...props }: Omit<ComponentProps<'input'>, 'type'>) {
  return (
    <span className="date-input">
      <input {...props} type="date" className={`input input--short ${className}`.trim()} />
      <CalendarIcon className="date-input__icon" />
    </span>
  );
}
