import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ESSENTIALS, emptyEssentials, litCount, stageFor } from '@kitzy/core';
import { Lantern } from '../components/Lantern';
import { usePageTitle } from '../lib/usePageTitle';

export function Home() {
  const { t } = useTranslation();
  usePageTitle(t('home.title'));

  // Phase 0 : l'inventaire n'existe pas encore, toutes les lucioles sont éteintes.
  const essentials = emptyEssentials();
  const count = litCount(essentials);
  const remaining = ESSENTIALS.length - count;

  return (
    <div className="page home">
      <section className="home__hero" aria-labelledby="home-title">
        <Lantern essentials={essentials} />
        <h1 id="home-title" tabIndex={-1}>
          <span className="home__hello">{t('home.hello')}</span>{' '}
          {t(`home.stage.${stageFor(count)}`)}
        </h1>
        <p className="home__status">{t('home.remaining', { count: remaining })}</p>
      </section>

      <section className="card" aria-labelledby="home-mission">
        <h2 id="home-mission" className="card__label">
          {t('home.firstMissionLabel')}
        </h2>
        <p className="card__text">{t('home.firstMission')}</p>
        <Link to="/foyer" className="button">
          {t('home.firstMissionCta')}
        </Link>
      </section>
    </div>
  );
}
