import { useTranslation } from 'react-i18next';
import { ACHIEVEMENTS, type Achievement } from '@kitzy/core';
import { TrophyIcon } from '../components/Icons';
import { Loading } from '../components/Loading';
import { Meter } from '../components/Meter';
import { useKitzy } from '../data/derived';
import { formatDate } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';

const GROUPS: Achievement['group'][] = ['reserves', 'plan', 'gestes'];

/** Les succès : ceux qui sont acquis brillent, les autres disent comment les obtenir. */
export function Achievements() {
  const { t } = useTranslation();
  usePageTitle(t('achievements.title'));
  const data = useKitzy();
  if (!data) return <Loading />;
  const done = ACHIEVEMENTS.filter((a) => data.achievements[a.id]).length;
  const progress = t('achievements.progress', { done, total: ACHIEVEMENTS.length });

  return (
    <div className="page">
      <h1 tabIndex={-1}>{t('achievements.title')}</h1>
      <p className="lead">{t('achievements.intro')}</p>
      <Meter
        value={done / ACHIEVEMENTS.length}
        label={t('achievements.title')}
        valueText={progress}
      />

      {GROUPS.map((group) => (
        <section key={group} className="kit-group" aria-labelledby={`badges-${group}`}>
          <h2 id={`badges-${group}`} className="section-title">
            {t(`achievements.groups.${group}`)}
          </h2>
          <ul className="badges">
            {ACHIEVEMENTS.filter((a) => a.group === group).map((a) => {
              const on = data.achievements[a.id];
              return (
                <li key={a.id} className={`badge${on ? ' badge--on' : ''}`}>
                  <span className="badge__medal">
                    <TrophyIcon />
                  </span>
                  <span className="badge__body">
                    <span className="badge__title">{t(`achievements.items.${a.id}.title`)}</span>
                    <span className="badge__hint">{t(`achievements.items.${a.id}.hint`)}</span>
                    <span className="badge__state">
                      {on
                        ? t('achievements.unlocked', { date: formatDate(on) })
                        : t('achievements.locked')}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
