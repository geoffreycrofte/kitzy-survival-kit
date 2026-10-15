import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { kitRows } from '@kitzy/core';
import { Meter } from '../components/Meter';
import { useKitzy } from '../data/derived';
import { usePageTitle } from '../lib/usePageTitle';
import { Loading } from '../components/Loading';

export function Kits() {
  const { t } = useTranslation();
  usePageTitle(t('kits.title'));
  const data = useKitzy();

  if (!data) return <Loading />;

  return (
    <div className="page">
      <h1 tabIndex={-1}>{t('kits.title')}</h1>
      {!data.household ? (
        <div className="card">
          <p>{t('kits.noHousehold')}</p>
          <Link to="/foyer" className="button">
            {t('home.firstMissionCta')}
          </Link>
        </div>
      ) : (
        <>
          <p className="lead">{t('kits.intro')}</p>
          <ul className="kit-list">
            {data.kits.map((kit) => {
              const rows = kitRows(kit, data.ctx);
              const complete = rows.filter((r) => r.status.state === 'complete').length;
              const attention = rows.filter((r) => r.status.needsAttention).length;
              const coverage = rows.length
                ? rows.reduce((s, r) => s + r.status.coverage, 0) / rows.length
                : 0;
              const completeText = t('kits.complete', { count: complete, total: rows.length });
              return (
                <li key={kit.id} className="card kit-card">
                  <h2 className="kit-card__title">
                    <Link to={`/kits/${kit.id}`}>{kit.name}</Link>
                  </h2>
                  <Meter value={coverage} label={kit.name} valueText={completeText} />
                  {attention > 0 && (
                    <p className="kit-card__attention">
                      {t('kits.attention', { count: attention })}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="muted">
            {t('kits.level', { level: t(`levels.${data.level}`) })}{' '}
            <Link to="/reglages#niveau" className="text-link">
              {t('kits.changeLevel')}
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
