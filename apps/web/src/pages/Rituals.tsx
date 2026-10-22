import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CATALOG, addDays, tx } from '@kitzy/core';
import { Loading } from '../components/Loading';
import { useKitzy } from '../data/derived';
import { chargeAll, recordActivity } from '../data/store';
import { announce } from '../lib/announce';
import { formatDate, formatQuantity } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';

type Answer = 'yes' | 'no';
const QUESTIONS = ['light', 'charge', 'stock'] as const;
type Question = (typeof QUESTIONS)[number];

const FIX_ROUTES: Record<Question, string> = {
  light: '/kits/home',
  charge: '/kits',
  stock: '/kits',
};

/** Une question oui / pas encore, en boutons radio. */
function YesNo({
  name,
  legend,
  help,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  help?: string;
  value: Answer | undefined;
  onChange: (value: Answer) => void;
}) {
  const { t } = useTranslation();
  return (
    <fieldset className="card choice" aria-describedby={help ? `${name}-help` : undefined}>
      <legend className="choice__legend">{legend}</legend>
      {help && (
        <p id={`${name}-help`} className="choice__help">
          {help}
        </p>
      )}
      <div className="yes-no">
        {(['yes', 'no'] as const).map((v) => (
          <label key={v} className="choice__option">
            <input
              type="radio"
              name={name}
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
            />
            {t(v === 'yes' ? 'activities.yes' : 'activities.notYet')}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Breadcrumb() {
  const { t } = useTranslation();
  return (
    <p className="breadcrumb">
      <Link to="/activites">{t('activities.title')}</Link>
    </p>
  );
}

/** Rendez-vous du premier lundi : trois questions pendant le test des sirènes. */
export function MiniCheck() {
  const { t } = useTranslation();
  const title = t('activities.items.mini-check.title');
  usePageTitle(title);
  const [answers, setAnswers] = useState<Partial<Record<Question, Answer>>>({});
  const [done, setDone] = useState(false);

  const todo = QUESTIONS.filter((q) => answers[q] === 'no');

  const submit = async () => {
    if (answers.charge === 'yes') await chargeAll();
    await recordActivity('mini-check');
    setDone(true);
    announce(t('miniCheck.saved'));
  };

  return (
    <div className="page">
      <Breadcrumb />
      <h1 tabIndex={-1}>{title}</h1>
      <p className="lead">{t('miniCheck.intro')}</p>
      {QUESTIONS.map((q) => (
        <YesNo
          key={q}
          name={`mini-${q}`}
          legend={t(`miniCheck.questions.${q}`)}
          help={q === 'charge' ? t('miniCheck.chargeHelp') : undefined}
          value={answers[q]}
          onChange={(v) => setAnswers((a) => ({ ...a, [q]: v }))}
        />
      ))}
      {done ? (
        <DonePanel>
          {todo.length > 0 && (
            <>
              <h2 className="card__label">{t('activities.toDo')}</h2>
              <ul className="plain-list">
                {todo.map((q) => (
                  <li key={q}>
                    <Link to={FIX_ROUTES[q]}>{t(`miniCheck.fixes.${q}`)}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </DonePanel>
      ) : (
        <button type="button" className="button" onClick={() => void submit()}>
          {t('miniCheck.submit')}
        </button>
      )}
    </div>
  );
}

/** Le panneau de fin d'une activité : il reçoit le focus pour être lu tout de suite. */
export function DonePanel({ children }: { children?: ReactNode }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <section ref={ref} className="card done-panel" aria-labelledby="done-title" tabIndex={-1}>
      <p id="done-title" className="card__text">
        {t('activities.finished')}
      </p>
      {children}
      <Link to="/activites" className="text-link">
        {t('activities.title')}
      </Link>
    </section>
  );
}

const CHECKLIST = ['household', 'clothes', 'smoke', 'documents', 'meds', 'plan'] as const;
const CHECKLIST_ROUTES: Partial<Record<(typeof CHECKLIST)[number], string>> = {
  household: '/foyer',
  plan: '/plan',
};

/** Grand check-up de saison : les dates à venir, les batteries, puis le tour du kit. */
export function CheckUp() {
  const { t } = useTranslation();
  const title = t('activities.items.check-up.title');
  usePageTitle(title);
  const data = useKitzy();
  const [checked, setChecked] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  if (!data) return <Loading />;

  const horizon = addDays(data.today, 183);
  const expiring = data.reminders.filter((r) => r.kind === 'expiry' && r.date <= horizon);
  const batteries = data.items.filter((i) => i.battery);
  const nameOf = (templateId: string | undefined, custom: string | undefined) => {
    const template = CATALOG.find((c) => c.id === templateId);
    return template ? tx(template.name, data.ctx.locale) : (custom ?? '');
  };

  return (
    <div className="page">
      <Breadcrumb />
      <h1 tabIndex={-1}>{title}</h1>
      <p className="lead">{t('checkUp.intro')}</p>

      <section className="kit-group" aria-labelledby="checkup-dates">
        <h2 id="checkup-dates" className="section-title">
          {t('checkUp.dates')}
        </h2>
        {expiring.length === 0 ? (
          <p className="muted">{t('checkUp.datesEmpty')}</p>
        ) : (
          <ul className="row-list">
            {expiring.map((r) => (
              <li key={r.id} className="row">
                <Link to={`/kits/${r.kitId}/article-${r.itemId}`} className="row__name">
                  {r.title}
                </Link>
                <span className="row__quantity">
                  {r.quantity !== undefined && `${formatQuantity(r.quantity)} · `}
                  {formatDate(r.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {batteries.length > 0 && (
        <section className="card" aria-labelledby="checkup-batteries">
          <h2 id="checkup-batteries" className="card__label">
            {t('checkUp.batteries')}
          </h2>
          <p className="card__text">{t('checkUp.batteriesHelp')}</p>
          <ul className="plain-list">
            {batteries.map((i) => (
              <li key={i.id}>{nameOf(i.templateId, i.customName)}</li>
            ))}
          </ul>
          <button
            type="button"
            className="button button--ghost"
            onClick={async () => {
              await chargeAll();
              announce(t('checkUp.charged'));
            }}
          >
            {t('checkUp.chargeAll')}
          </button>
        </section>
      )}

      <section className="kit-group" aria-labelledby="checkup-list">
        <h2 id="checkup-list" className="section-title">
          {t('checkUp.checklist')}
        </h2>
        <ul className="task-list">
          {CHECKLIST.map((key) => {
            const id = `checkup-${key}`;
            const route = CHECKLIST_ROUTES[key];
            return (
              <li key={key} className="task-card">
                <div className="task-card__main">
                  <input
                    id={id}
                    type="checkbox"
                    className="checkbox"
                    checked={checked.includes(key)}
                    onChange={() =>
                      setChecked((c) =>
                        c.includes(key) ? c.filter((k) => k !== key) : [...c, key],
                      )
                    }
                  />
                  <label htmlFor={id} className="task-card__title">
                    {t(`checkUp.list.${key}`)}
                  </label>
                </div>
                {route && (
                  <Link to={route} className="text-link task-card__hint">
                    {t(key === 'plan' ? 'plan.title' : 'household.title')}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {done ? (
        <DonePanel />
      ) : (
        <button
          type="button"
          className="button"
          onClick={async () => {
            await recordActivity('check-up');
            setDone(true);
            announce(t('checkUp.saved'));
          }}
        >
          {t('checkUp.submit')}
        </button>
      )}
    </div>
  );
}
