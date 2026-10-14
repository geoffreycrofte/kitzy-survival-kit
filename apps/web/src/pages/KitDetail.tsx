import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CATEGORIES, kitRows, type KitRow } from '@kitzy/core';
import { StatusChips } from '../components/StatusChips';
import { useKitzy } from '../data/derived';
import { renameKit } from '../data/store';
import { announce } from '../lib/announce';
import { formatProgress } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import { NotFound } from './NotFound';

export function KitDetail() {
  const { t } = useTranslation();
  const { kitId } = useParams();
  const data = useKitzy();
  const kit = data?.kits.find((k) => k.id === kitId);
  usePageTitle(kit?.name ?? t('kits.title'));

  if (!data) return <p>{t('app.loading')}</p>;
  if (!kit) return <NotFound />;

  const rows = kitRows(kit, data.ctx);
  const groups = new Map<string, KitRow[]>();
  for (const row of rows) {
    const group = row.template ? row.category : 'custom';
    groups.set(group, [...(groups.get(group) ?? []), row]);
  }
  const groupName = (id: string) =>
    id === 'custom'
      ? t('kits.customCategory')
      : (CATEGORIES.find((c) => c.id === id)?.name.fr ?? id);

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/kits">{t('kits.title')}</Link>
      </p>
      <h1 tabIndex={-1}>{kit.name}</h1>

      {[...groups.entries()].map(([group, items]) => (
        <section key={group} aria-labelledby={`group-${group}`} className="kit-group">
          <h2 id={`group-${group}`} className="section-title">
            {groupName(group)}
          </h2>
          <ul className="row-list">
            {items.map((row) => (
              <li key={row.key} className="row">
                <Link to={`/kits/${kit.id}/${row.key}`} className="row__name">
                  {row.name}
                </Link>
                <span className="row__quantity">
                  {formatProgress(row.status.usable, row.status.target, row.unit)}
                </span>
                <StatusChips status={row.status} unit={row.unit} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <Link to={`/kits/${kit.id}/nouveau`} className="button button--ghost">
        {t('kits.addCustom')}
      </Link>

      {kit.type === 'go-bag' && <RenameKit kitId={kit.id} current={kit.name} />}
    </div>
  );
}

function RenameKit({ kitId, current }: { kitId: string; current: string }) {
  const { t } = useTranslation();
  const [name, setName] = useState(current);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await renameKit(kitId, name);
    announce(t('kits.renamed'));
  };
  return (
    <details className="card disclosure">
      <summary>{t('kits.rename')}</summary>
      <form className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="kit-name" className="field__label">
            {t('kits.renameLabel')}
          </label>
          <input
            id="kit-name"
            className="input"
            value={name}
            maxLength={40}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit" className="button">
          {t('kits.renameSave')}
        </button>
      </form>
    </details>
  );
}
