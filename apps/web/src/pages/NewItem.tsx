import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Unit } from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { createCustomItem } from '../data/store';
import { usePageTitle } from '../lib/usePageTitle';
import { NotFound } from './NotFound';
import { Loading } from '../components/Loading';

const UNITS: Unit[] = ['piece', 'pack', 'set', 'portion', 'L'];

export function NewItem() {
  const { t } = useTranslation();
  usePageTitle(t('item.newTitle'));
  const { kitId } = useParams();
  const data = useKitzy();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<Unit>('piece');
  const [error, setError] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const kit = data?.kits.find((k) => k.id === kitId);

  if (!data) return <Loading />;
  if (!kit) return <NotFound />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('item.errorName'));
      ref.current?.focus();
      return;
    }
    const id = await createCustomItem(kit.id, name, unit, 1);
    navigate(`/kits/${kit.id}/perso-${id}`);
  };

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to={`/kits/${kit.id}`}>{kit.name}</Link>
      </p>
      <h1 tabIndex={-1}>{t('item.newTitle')}</h1>
      <form className="form card" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="new-name" className="field__label">
            {t('item.newName')}
          </label>
          {error && (
            <p id="new-name-error" className="field__error">
              {error}
            </p>
          )}
          <input
            ref={ref}
            id="new-name"
            className="input"
            maxLength={80}
            autoComplete="off"
            value={name}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'new-name-error' : undefined}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="new-unit" className="field__label">
            {t('item.newUnit')}
          </label>
          <select
            id="new-unit"
            className="select"
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {t(`units.${u}`, { count: 2 })}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="button">
          {t('item.newSubmit')}
        </button>
      </form>
    </div>
  );
}
