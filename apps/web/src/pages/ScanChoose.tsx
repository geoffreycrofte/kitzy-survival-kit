import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { kitRows } from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { linkBarcode } from '../data/store';
import { announce } from '../lib/announce';
import { usePageTitle } from '../lib/usePageTitle';
import { NotFound } from './NotFound';

/** Code inconnu : on choisit l'article une fois, Kitzy le reconnaîtra ensuite. */
export function ScanChoose() {
  const { t } = useTranslation();
  const { kitId, code } = useParams();
  const navigate = useNavigate();
  const data = useKitzy();
  const [filter, setFilter] = useState('');
  usePageTitle(t('scan.chooseTitle'));

  if (!data) return <p>{t('app.loading')}</p>;
  const kit = data.kits.find((k) => k.id === kitId);
  if (!kit || !code) return <NotFound />;

  const query = filter.trim().toLocaleLowerCase('fr');
  const rows = kitRows(kit, data.ctx).filter(
    (r) => !query || r.name.toLocaleLowerCase('fr').includes(query),
  );

  const choose = async (key: string, name: string) => {
    await linkBarcode({ code, kitId: kit.id, key });
    announce(t('scan.linked', { name }));
    navigate(`/kits/${kit.id}/${key}`, { state: { focus: '#lot-quantity', scanned: code } });
  };

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to={`/kits/${kit.id}`}>{kit.name}</Link>
      </p>
      <h1 tabIndex={-1}>{t('scan.chooseTitle')}</h1>
      <p className="lead">{t('scan.chooseIntro', { code })}</p>
      <div className="field">
        <label htmlFor="scan-filter" className="field__label">
          {t('scan.filter')}
        </label>
        <input
          id="scan-filter"
          className="input"
          type="search"
          autoComplete="off"
          value={filter}
          aria-describedby="scan-count"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <p id="scan-count" className="muted" role="status">
        {t('scan.count', { count: rows.length })}
      </p>
      <ul className="row-list">
        {rows.map((row) => (
          <li key={row.key}>
            <button
              type="button"
              className="row row--button"
              onClick={() => void choose(row.key, row.name)}
            >
              {row.name}
            </button>
          </li>
        ))}
      </ul>
      <Link to={`/kits/${kit.id}/nouveau`} className="button button--ghost">
        {t('kits.addCustom')}
      </Link>
    </div>
  );
}
