import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { simulationReport, type SimulationCheck, type SimulationInput } from '@kitzy/core';
import { ChoiceQuestion } from '../components/ChoiceQuestion';
import { Loading } from '../components/Loading';
import { useKitzy } from '../data/derived';
import { addExtras, recordActivity } from '../data/store';
import { announce } from '../lib/announce';
import { useContent } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';

/** Simulation 72 h : le scénario du guide, une étape à la fois, relié aux données du foyer. */
export function Simulation() {
  const { t } = useTranslation();
  usePageTitle(t('simulation.title'));
  const { simulation: SIMULATION } = useContent();
  const data = useKitzy();
  const [index, setIndex] = useState<number | null>(null);
  const [good, setGood] = useState<Record<string, boolean>>({});
  if (!data) return <Loading />;

  const input: SimulationInput = {
    essentials: data.essentials,
    owned: data.owned,
    plan: data.plan ?? data.planInfo,
    tasks: data.tasks,
  };
  const finished = index !== null && index >= SIMULATION.length;

  return (
    <div className="page simulation">
      <p className="breadcrumb">
        <Link to="/activites">{t('activities.title')}</Link>
      </p>
      <h1 tabIndex={-1}>{t('simulation.title')}</h1>
      {index === null && (
        <>
          <p className="lead">{t('simulation.intro')}</p>
          <button type="button" className="button" onClick={() => setIndex(0)}>
            {t('simulation.start')}
          </button>
        </>
      )}
      {index !== null && !finished && (
        <SimulationStepView
          key={SIMULATION[index]!.id}
          index={index}
          input={input}
          onAnswer={(id, ok) => setGood((g) => ({ ...g, [id]: ok }))}
          onNext={() => setIndex(index + 1)}
        />
      )}
      {finished && (
        <SimulationReportView
          input={input}
          good={Object.values(good).filter(Boolean).length}
          existing={data.extras.map((e) => e.label)}
          onRestart={() => {
            setGood({});
            setIndex(0);
          }}
        />
      )}
    </div>
  );
}

function CheckList({
  checks,
  input,
}: {
  checks: readonly SimulationCheck[];
  input: SimulationInput;
}) {
  const { t } = useTranslation();
  return (
    <ul className="sim-checks">
      {checks.map((c) => {
        const ok = c.ok(input);
        return (
          <li key={c.id} className={`sim-check${ok ? ' sim-check--ok' : ''}`}>
            <span className="sim-check__state">
              {ok ? t('simulation.ready') : t('simulation.missing')}
            </span>
            {ok ? <span>{c.label}</span> : <Link to={c.route}>{c.label}</Link>}
          </li>
        );
      })}
    </ul>
  );
}

function SimulationStepView({
  index,
  input,
  onAnswer,
  onNext,
}: {
  index: number;
  input: SimulationInput;
  onAnswer: (id: string, ok: boolean) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  const { simulation: SIMULATION } = useContent();
  const step = SIMULATION[index]!;
  const good = step.choice.options.find((o) => o.good)!;
  const last = index === SIMULATION.length - 1;
  return (
    <>
      <div className="sim-story">
        <p className="sim-story__when">{step.when}</p>
        {step.story.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <ChoiceQuestion
        id={step.id}
        counter={t('simulation.step', { current: index + 1, total: SIMULATION.length })}
        prompt={step.choice.question}
        options={step.choice.options}
        correct={good.id}
        validateLabel={t('simulation.validate')}
        chooseLabel={t('simulation.choose')}
        onAnswer={(chosen) => onAnswer(step.id, chosen === good.id)}
        feedback={(chosen) => {
          const option = step.choice.options.find((o) => o.id === chosen)!;
          return (
            <>
              <p className={`quiz__verdict${option.good ? ' quiz__verdict--good' : ''}`}>
                {option.good ? t('simulation.good') : t('simulation.bad')}
              </p>
              <p>{option.feedback}</p>
              <h3 className="toc__label">{t('simulation.yourHome')}</h3>
              {step.checks.length > 0 ? (
                <CheckList checks={step.checks} input={input} />
              ) : (
                <p className="muted">{t('simulation.nothingToCheck')}</p>
              )}
            </>
          );
        }}
        next={
          <button type="button" className="button" onClick={onNext}>
            {last ? t('simulation.toReport') : t('simulation.next')}
          </button>
        }
      />
    </>
  );
}

function SimulationReportView({
  input,
  good,
  existing,
  onRestart,
}: {
  input: SimulationInput;
  good: number;
  existing: readonly string[];
  onRestart: () => void;
}) {
  const { t } = useTranslation();
  const { simulation: SIMULATION } = useContent();
  const ref = useRef<HTMLHeadingElement>(null);
  const [added, setAdded] = useState(false);
  const report = simulationReport(input, SIMULATION);
  const toBuy = report.missing
    .map((c) => c.shopping)
    .filter((label): label is string => Boolean(label && !existing.includes(label)));

  useEffect(() => {
    ref.current?.focus();
    void recordActivity('simulation');
  }, []);

  return (
    <section className="kit-group" aria-labelledby="sim-report">
      <h2 id="sim-report" ref={ref} tabIndex={-1} className="section-title">
        {t('simulation.report')}
      </h2>
      <p>{t('simulation.reportIntro')}</p>
      <p className="score">{t('simulation.score', { good, total: SIMULATION.length })}</p>
      {report.missing.length > 0 ? (
        <div className="card">
          <h3 className="card__label">{t('simulation.lacked')}</h3>
          <CheckList checks={report.missing} input={input} />
          {toBuy.length > 0 && !added && (
            <button
              type="button"
              className="button"
              onClick={async () => {
                await addExtras(toBuy.map((label) => ({ label })));
                setAdded(true);
                announce(t('simulation.added'));
              }}
            >
              {t('simulation.addMissing')}
            </button>
          )}
          {added && <p className="note">{t('simulation.added')}</p>}
        </div>
      ) : (
        <p className="note">{t('simulation.lackedNone')}</p>
      )}
      {report.ready.length > 0 && (
        <div className="card">
          <h3 className="card__label">{t('simulation.had')}</h3>
          <CheckList checks={report.ready} input={input} />
        </div>
      )}
      <div className="button-row">
        <button type="button" className="button button--ghost" onClick={onRestart}>
          {t('simulation.restart')}
        </button>
        <Link to="/activites" className="text-link">
          {t('activities.title')}
        </Link>
      </div>
    </section>
  );
}
