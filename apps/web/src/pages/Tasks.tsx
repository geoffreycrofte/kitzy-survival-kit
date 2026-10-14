import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TASKS, tasksProgress, type TaskTemplate } from '@kitzy/core';
import { Meter } from '../components/Meter';
import { useKitzy } from '../data/derived';
import { toggleTask } from '../data/store';
import { announce } from '../lib/announce';
import { formatDate } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';

/** Les gestes de préparation (§ 2.14 du plan) : ce qui ne s'achète pas. */
export function Tasks() {
  const { t } = useTranslation();
  usePageTitle(t('tasks.title'));
  const data = useKitzy();
  if (!data) return <p>{t('app.loading')}</p>;
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

      <ul className="row-list task-list">
        {TASKS.map((task) => (
          <TaskRow
            key={`${task.id}-${data.tasks[task.id] ?? ''}`}
            task={task}
            doneOn={data.tasks[task.id]}
          />
        ))}
      </ul>
    </div>
  );
}

function TaskRow({ task, doneOn }: { task: TaskTemplate; doneOn: string | undefined }) {
  const { t } = useTranslation();
  // État local immédiat : la case change au clic, la base suit (la clé du composant resynchronise).
  const [done, setDone] = useState(Boolean(doneOn));
  const id = `task-${task.id}`;
  return (
    <li className={`row task${done ? ' task--done' : ''}`}>
      <div className="shop-row__check">
        <input
          id={id}
          type="checkbox"
          className="checkbox"
          checked={done}
          aria-describedby={`${id}-hint`}
          onChange={() => {
            setDone(!done);
            void toggleTask(task.id);
            announce(t(done ? 'tasks.unchecked' : 'tasks.checked', { title: task.title }));
          }}
        />
        <label htmlFor={id}>{task.title}</label>
      </div>
      <p id={`${id}-hint`} className="task__hint">
        {task.hint}
        {doneOn && (
          <span className="task__done"> {t('tasks.doneOn', { date: formatDate(doneOn) })}</span>
        )}
      </p>
      <div className="task__meta">
        <span className="tag">{t(`tasks.${task.source}`)}</span>
        {task.route && (
          <Link
            to={task.route}
            className="text-link"
            aria-label={t('tasks.goLabel', { title: task.title })}
          >
            {t('tasks.go')}
          </Link>
        )}
        {task.guide && (
          <Link
            to={`/guide/${task.guide}`}
            className="text-link"
            aria-label={t('tasks.guideLabel', { title: task.title })}
          >
            {t('tasks.guide')}
          </Link>
        )}
        {task.url && (
          <a
            href={task.url}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('tasks.siteLabel', { title: task.title })} ${t('guide.newWindow')}`}
          >
            {t('tasks.site')}
          </a>
        )}
      </div>
    </li>
  );
}
