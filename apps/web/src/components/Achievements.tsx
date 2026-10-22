import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { newAchievements } from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { recordAchievements } from '../data/store';
import { CloseIcon, TrophyIcon } from './Icons';

/**
 * Surveille l'avancement et note les succès atteints.
 * Le bandeau reste dans le flux de la page (il ne masque rien) jusqu'à ce qu'on le ferme.
 */
export function AchievementWatcher() {
  const { t } = useTranslation();
  const data = useKitzy();
  const { pathname } = useLocation();
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const pending = useRef(new Set<string>());

  useEffect(() => {
    if (!data) return;
    const ids = newAchievements(
      {
        hasHousehold: Boolean(data.household),
        hasItems: data.items.some((i) => i.lots.some((l) => l.quantity > 0)),
        essentials: data.essentials,
        dashboard: data.dashboard,
        activities: data.activities,
      },
      data.achievements,
    ).filter((id) => !pending.current.has(id));
    if (ids.length === 0) return;
    ids.forEach((id) => pending.current.add(id));
    void recordAchievements(ids).then(() => setUnlocked((prev) => [...prev, ...ids]));
  }, [data]);

  // Sur la page des succès, le bandeau n'a plus lieu d'être.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (pathname === '/succes') setUnlocked([]);
  }

  const first = unlocked[0];
  return (
    <div role="status" className="unlock-region">
      {first && (
        <div className="unlock">
          <TrophyIcon className="unlock__icon" />
          <p className="unlock__text">
            {unlocked.length === 1
              ? t('achievements.toast', { title: t(`achievements.items.${first}.title`) })
              : t('achievements.toastMany', { count: unlocked.length })}
          </p>
          <div className="unlock__actions">
            <Link to="/succes" className="text-link">
              {t('achievements.see')}
            </Link>
            <button
              type="button"
              className="icon-button icon-button--small"
              aria-label={t('app.dismiss')}
              onClick={() => setUnlocked([])}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
