import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
  ESSENTIALS,
  emptyEssentials,
  isOverdue,
  litCount,
  stageFor,
  upcoming,
  type Reminder,
} from '@kitzy/core';
import { Lantern } from '../components/Lantern';
import { Loading } from '../components/Loading';
import { useKitzy } from '../data/derived';
import { HOME_KIT_ID } from '../data/store';
import { formatDay, formatQuantity } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';

const INTRO_KEY = 'kitzy.intro';

/** L'histoire des lucioles ne se joue qu'une fois par session. */
function useIntroOnce(): boolean {
  const [play] = useState(() => {
    try {
      return sessionStorage.getItem(INTRO_KEY) !== 'vue';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, 'vue');
    } catch {
      // Stockage indisponible : l'animation se rejouera, ce n'est pas grave.
    }
  }, []);
  return play;
}

export function Home() {
  const { t } = useTranslation();
  usePageTitle(t('home.title'));
  const data = useKitzy();
  const introOnce = useIntroOnce();
  const intro = data && !data.household ? (introOnce ? 'play' : 'still') : undefined;

  const essentials = data?.household ? data.essentials : emptyEssentials();
  const count = litCount(essentials);
  const remaining = ESSENTIALS.length - count;
  const allLit = remaining === 0;

  return (
    <div className={`page home${intro === 'play' ? ' home--intro-play' : ''}`}>
      <section className="home__hero" aria-labelledby="home-title">
        <Lantern essentials={essentials} pose={allLit ? 'fete' : 'bonjour'} intro={intro} />
        <h1 id="home-title" tabIndex={-1}>
          <span className="home__hello">{t('home.hello')}</span>{' '}
          {t(`home.stage.${stageFor(count)}`)}
        </h1>
        {intro ? (
          <div className="home__story reveal">
            <p>{t('home.story.watch')}</p>
            <p>{t('home.story.fade')}</p>
            <p className="home__story-end">{t('home.story.allGood')}</p>
          </div>
        ) : (
          data && (
            <p className="home__status">
              {allLit ? t('home.allLit') : t('home.remaining', { count: remaining })}
            </p>
          )
        )}
      </section>

      {!data && <Loading />}

      {data && !data.household && (
        <section className="card reveal reveal--late" aria-labelledby="home-mission">
          <h2 id="home-mission" className="card__label">
            {t('home.firstMissionLabel')}
          </h2>
          <p className="card__text">{t('home.firstMission')}</p>
          <Link to="/foyer" className="button">
            {t('home.firstMissionCta')}
          </Link>
        </section>
      )}

      {data?.household && data.next && (
        <section className="card" aria-labelledby="home-mission">
          <h2 id="home-mission" className="card__label">
            {t('home.missionLabel', { essential: t(`essentials.${data.next.essential}`) })}
          </h2>
          <p className="card__text">
            {t('home.mission', {
              quantity: formatQuantity(data.next.missing, data.next.row.unit),
              name: data.next.row.name,
            })}
          </p>
          <Link to={`/kits/${HOME_KIT_ID}/${data.next.row.key}`} className="button">
            {t('home.missionCta')}
          </Link>
        </section>
      )}

      {data?.household && !data.next && (
        <section className="card" aria-labelledby="home-mission">
          <h2 id="home-mission" className="card__label">
            {t('home.doneLabel')}
          </h2>
          <p className="card__text">{t('home.done')}</p>
          <Link to="/kits" className="button">
            {t('home.doneCta')}
          </Link>
        </section>
      )}

      {data?.household && (
        <section className="timeline-section" aria-labelledby="home-upcoming">
          <h2 id="home-upcoming" className="section-title">
            {t('home.upcoming')}
          </h2>
          <Upcoming
            reminders={upcoming(data.reminders, data.today).slice(0, 4)}
            today={data.today}
          />
        </section>
      )}

      {data?.household && (
        <Link to="/foyer" className="text-link">
          {t('home.editHousehold')}
        </Link>
      )}
    </div>
  );
}

function reminderTitle(r: Reminder, t: TFunction): string {
  if (r.kind === 'expiry') return t(`reminder.expiry_${r.expiryType ?? 'ddm'}`, { name: r.title });
  if (r.kind === 'battery') return t('reminder.battery', { name: r.title });
  return t(`reminder.${r.kind}`);
}

function Upcoming({ reminders, today }: { reminders: Reminder[]; today: string }) {
  const { t } = useTranslation();
  if (reminders.length === 0) return <p className="muted">{t('home.upcomingEmpty')}</p>;
  return (
    <ol className="timeline">
      {reminders.map((r) => {
        const overdue = isOverdue(r, today);
        const title = reminderTitle(r, t);
        return (
          <li key={r.id} className={`timeline__item timeline__item--${r.kind}`}>
            <span className="timeline__date">
              {formatDay(r.date, today)}
              {overdue && <span className="timeline__overdue">, {t('home.overdue')}</span>}
            </span>
            {r.kind === 'plan-review' ? (
              <Link className="timeline__title" to="/plan">
                {title}
              </Link>
            ) : r.itemId && r.kitId ? (
              <Link className="timeline__title" to={`/kits/${r.kitId}/${itemKeyFor(r)}`}>
                {title}
              </Link>
            ) : (
              <span className="timeline__title">{title}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Les rappels pointent vers l'article ; la page d'article accepte aussi l'identifiant. */
function itemKeyFor(r: Reminder): string {
  return `article-${r.itemId ?? ''}`;
}
