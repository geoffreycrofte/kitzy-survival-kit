import type { ComponentType, SVGProps } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { dueRitual, type ActivityId } from '@kitzy/core';
import {
  BellIcon,
  ClockIcon,
  LanternIcon,
  PotIcon,
  QuestionIcon,
  StoryIcon,
} from '../components/Icons';
import { Loading } from '../components/Loading';
import { COUNTRY, useKitzy } from '../data/derived';
import { formatDate } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export const ACTIVITY_ROUTES: Record<ActivityId, string> = {
  'mini-check': '/mini-check',
  'check-up': '/check-up',
  recettes: '/recettes',
  defi: '/defi',
  simulation: '/simulation',
  quiz: '/quiz',
};

const GROUPS: Array<{ id: string; items: Array<[ActivityId, Icon]> }> = [
  {
    id: 'rituals',
    items: [
      ['mini-check', BellIcon],
      ['check-up', ClockIcon],
    ],
  },
  {
    id: 'together',
    items: [
      ['recettes', PotIcon],
      ['defi', LanternIcon],
    ],
  },
  {
    id: 'learn',
    items: [
      ['simulation', StoryIcon],
      ['quiz', QuestionIcon],
    ],
  },
];

/** Les activités du côté fun (§ 4 du plan), regroupées : rituels, en famille, s'entraîner. */
export function Activities() {
  const { t } = useTranslation();
  usePageTitle(t('activities.title'));
  const data = useKitzy();
  if (!data) return <Loading />;
  const due = dueRitual(data.today, data.activities, COUNTRY)?.id;

  return (
    <div className="page">
      <h1 tabIndex={-1}>{t('activities.title')}</h1>
      <p className="lead">{t('activities.intro')}</p>
      {GROUPS.map((group) => (
        <section key={group.id} className="kit-group" aria-labelledby={`act-${group.id}`}>
          <h2 id={`act-${group.id}`} className="section-title">
            {t(`activities.${group.id}`)}
          </h2>
          <ul className="dash__list">
            {group.items.map(([id, Icon]) => {
              const last = data.activities[id];
              return (
                <li key={id} className={`dash__row${due === id ? ' dash__row--due' : ''}`}>
                  <span className="dash__icon">
                    <Icon />
                  </span>
                  <div className="dash__body">
                    <h3 className="dash__title">
                      <Link to={ACTIVITY_ROUTES[id]} className="dash__link">
                        {t(`activities.items.${id}.title`)}
                      </Link>
                    </h3>
                    <p className="activity__summary">{t(`activities.items.${id}.summary`)}</p>
                    <p className="activity__meta">
                      {due === id && <span className="tag tag--due">{t('activities.due')}</span>}
                      <span>
                        {last
                          ? t('activities.lastDone', { date: formatDate(last) })
                          : t('activities.never')}
                      </span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
