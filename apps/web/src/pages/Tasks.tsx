import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TASK_GROUPS, tasksProgress, type TaskTemplate } from '@kitzy/core';
import { useContent } from '../lib/content';
import { ArrowIcon, BookIcon, ExternalIcon } from '../components/Icons';
import { Meter } from '../components/Meter';
import { useKitzy } from '../data/derived';
import { toggleTask } from '../data/store';
import { announce } from '../lib/announce';
import { formatDate } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import { Loading } from '../components/Loading';

/** Les gestes de préparation (§ 2.14 du plan) : ce qui ne s'achète pas. */
export function Tasks() {
  const { t } = useTranslation();
  usePageTitle(t('tasks.title'));
  const { tasks: TASKS } = useContent();
  const data = useKitzy();
  if (!data) return <Loading />;
  const progress = tasksProgress(data.tasks);

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/plan">{t('plan.title')}</Link>
      </p>
      <h1 tabIndex={-1}>{t('tasks.title')}</h1>
      <p className="lead">{t('tasks.intro')}</p>
      <Meter
        label={t('tasks.title')}
        value={progress.done / progress.total}
        valueText={t('tasks.progress', progress)}
      />

      {TASK_GROUPS.map((group) => (
        <section key={group} className="task-group" aria-labelledby={`tasks-${group}`}>
          <h2 id={`tasks-${group}`} className="section-title">
            {t(`tasks.groups.${group}`)}
          </h2>
          <ul className="task-list">
            {TASKS.filter((task) => task.group === group).map((task) => (
              <TaskRow
                key={`${task.id}-${data.tasks[task.id] ?? ''}`}
                task={task}
                doneOn={data.tasks[task.id]}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Le domaine affiché sur le lien externe : on sait où l'on va avant de cliquer. */
function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Une carte par geste :
 * 1. la case, le titre et l'origine du conseil ;
 * 2. l'explication (et la date si c'est fait) ;
 * 3. « Pour passer à l'action » : les liens, en pastilles, avec ce qui les attend.
 */
function TaskRow({ task, doneOn }: { task: TaskTemplate; doneOn: string | undefined }) {
  const { t } = useTranslation();
  // État local immédiat : la case change au clic, la base suit (la clé du composant resynchronise).
  const [done, setDone] = useState(Boolean(doneOn));
  const id = `task-${task.id}`;
  const hasActions = Boolean(task.route || task.guide || task.url);
  return (
    <li className={`task-card${done ? ' task-card--done' : ''}`}>
      <div className="task-card__main">
        <input
          id={id}
          type="checkbox"
          className="checkbox"
          checked={done}
          aria-describedby={`${id}-hint`}
          onChange={() => {
            setDone(!done);
            // Annoncé une fois l'écriture faite : rien n'est perdu si l'on quitte la page aussitôt.
            void toggleTask(task.id).then((now) =>
              announce(t(now ? 'tasks.checked' : 'tasks.unchecked', { title: task.title })),
            );
          }}
        />
        <div className="task-card__head">
          <label htmlFor={id} className="task-card__title">
            {task.title}
          </label>
          <span className={`tag tag--${task.source}`}>{t(`tasks.${task.source}`)}</span>
        </div>
      </div>
      <p id={`${id}-hint`} className="task-card__hint">
        {task.hint}
        {doneOn && (
          <span className="task-card__done">
            {' '}
            {t('tasks.doneOn', { date: formatDate(doneOn) })}
          </span>
        )}
      </p>
      {hasActions && (
        <div className="task-card__actions">
          <p id={`${id}-actions`} className="task-card__actions-label">
            {t('tasks.actions')}
          </p>
          <ul className="pill-list" aria-labelledby={`${id}-actions`}>
            {task.route && (
              <li>
                <Link
                  to={task.route}
                  className="pill"
                  aria-label={t('tasks.goLabel', { title: task.title })}
                >
                  <ArrowIcon className="pill__icon" />
                  {t('tasks.go')}
                </Link>
              </li>
            )}
            {task.guide && (
              <li>
                <Link
                  to={`/guide/${task.guide}`}
                  className="pill"
                  aria-label={t('tasks.guideLabel', { title: task.title })}
                >
                  <BookIcon className="pill__icon" />
                  {t('tasks.guide')}
                </Link>
              </li>
            )}
            {task.url && (
              <li>
                <a
                  href={task.url}
                  className="pill"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('tasks.siteLabel', { title: task.title })}, ${domainOf(task.url)} ${t('guide.newWindow')}`}
                >
                  <ExternalIcon className="pill__icon" />
                  {domainOf(task.url)}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </li>
  );
}
