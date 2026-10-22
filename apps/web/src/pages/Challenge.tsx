import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { addExtras, recordActivity } from '../data/store';
import { announce } from '../lib/announce';
import { usePageTitle } from '../lib/usePageTitle';
import { DonePanel } from './Rituals';

const MISSIONS = ['light', 'meal', 'radio', 'phone', 'water', 'find', 'game'] as const;
const MISSION_LINKS: Partial<Record<(typeof MISSIONS)[number], string>> = {
  meal: '/recettes',
  find: '/plan/maison',
};

/** Défi « soirée sans électricité » : des missions, puis ce qui a manqué part dans les courses. */
export function Challenge() {
  const { t } = useTranslation();
  usePageTitle(t('challenge.title'));
  const [checked, setChecked] = useState<string[]>([]);
  const [missing, setMissing] = useState('');
  const [added, setAdded] = useState<number | null>(null);

  const submit = async () => {
    const lines = [
      ...new Set(
        missing
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean),
      ),
    ].slice(0, 30);
    if (lines.length > 0) await addExtras(lines.map((label) => ({ label: label.slice(0, 120) })));
    await recordActivity('defi');
    setAdded(lines.length);
    announce(
      lines.length > 0 ? t('challenge.saved', { count: lines.length }) : t('challenge.savedNone'),
    );
  };

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/activites">{t('activities.title')}</Link>
      </p>
      <h1 tabIndex={-1}>{t('challenge.title')}</h1>
      <p className="lead">{t('challenge.intro')}</p>
      <p className="note note--warning">{t('challenge.safety')}</p>

      <section className="kit-group" aria-labelledby="challenge-missions">
        <h2 id="challenge-missions" className="section-title">
          {t('challenge.missions')}
        </h2>
        <ul className="task-list">
          {MISSIONS.map((key) => {
            const id = `mission-${key}`;
            const link = MISSION_LINKS[key];
            const isDone = checked.includes(key);
            return (
              <li key={key} className={`task-card${isDone ? ' task-card--done' : ''}`}>
                <div className="task-card__main">
                  <input
                    id={id}
                    type="checkbox"
                    className="checkbox"
                    checked={isDone}
                    onChange={() =>
                      setChecked((c) => (isDone ? c.filter((k) => k !== key) : [...c, key]))
                    }
                  />
                  <label htmlFor={id} className="task-card__title">
                    {t(`challenge.list.${key}`)}
                  </label>
                </div>
                {link && (
                  <Link to={link} className="text-link task-card__hint">
                    {t(key === 'meal' ? 'recipes.title' : 'plan.steps.maison')}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {added === null ? (
        <>
          <div className="field">
            <label htmlFor="challenge-missing" className="field__label">
              {t('challenge.missing')}
            </label>
            <p id="challenge-missing-help" className="field__hint">
              {t('challenge.missingHelp')}
            </p>
            <textarea
              id="challenge-missing"
              className="input input--area"
              rows={4}
              value={missing}
              aria-describedby="challenge-missing-help"
              onChange={(e) => setMissing(e.target.value)}
            />
          </div>
          <button type="button" className="button" onClick={() => void submit()}>
            {t('challenge.submit')}
          </button>
        </>
      ) : (
        <DonePanel>
          <p>{added > 0 ? t('challenge.saved', { count: added }) : t('challenge.savedNone')}</p>
          {added > 0 && (
            <Link to="/courses" className="button button--ghost">
              {t('challenge.toShopping')}
            </Link>
          )}
        </DonePanel>
      )}
    </div>
  );
}
