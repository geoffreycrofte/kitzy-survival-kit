import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { QUIZ, quizScore } from '@kitzy/core';
import { ChoiceQuestion } from '../components/ChoiceQuestion';
import { recordActivity } from '../data/store';
import { usePageTitle } from '../lib/usePageTitle';

/** Quiz des bons réflexes : une question à la fois, sans chronomètre, chaque réponse expliquée. */
export function Quiz() {
  const { t } = useTranslation();
  usePageTitle(t('quiz.title'));
  const [index, setIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const finished = index !== null && index >= QUIZ.length;
  const score = quizScore(QUIZ, answers);

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/activites">{t('activities.title')}</Link>
      </p>
      <h1 tabIndex={-1}>{t('quiz.title')}</h1>
      {index === null && (
        <>
          <p className="lead">{t('quiz.intro')}</p>
          <button type="button" className="button" onClick={() => setIndex(0)}>
            {t('quiz.start')}
          </button>
        </>
      )}
      {index !== null && !finished && (
        <QuizStep
          key={QUIZ[index]!.id}
          index={index}
          onAnswer={(id, chosen) => setAnswers((a) => ({ ...a, [id]: chosen }))}
          onNext={() => setIndex(index + 1)}
        />
      )}
      {finished && (
        <QuizResult
          score={score}
          onRestart={() => {
            setAnswers({});
            setIndex(0);
          }}
        />
      )}
    </div>
  );
}

function QuizStep({
  index,
  onAnswer,
  onNext,
}: {
  index: number;
  onAnswer: (id: string, chosen: string) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  const q = QUIZ[index]!;
  const answer = q.options.find((o) => o.id === q.answer)!.text;
  const last = index === QUIZ.length - 1;
  return (
    <ChoiceQuestion
      id={q.id}
      counter={t('quiz.question', { current: index + 1, total: QUIZ.length })}
      prompt={q.prompt}
      options={q.options}
      correct={q.answer}
      validateLabel={t('quiz.validate')}
      chooseLabel={t('quiz.choose')}
      onAnswer={(chosen) => onAnswer(q.id, chosen)}
      feedback={(chosen) => (
        <>
          <p className={`quiz__verdict${chosen === q.answer ? ' quiz__verdict--good' : ''}`}>
            {chosen === q.answer ? t('quiz.good') : t('quiz.bad', { answer })}
          </p>
          <p>{q.explanation}</p>
          <Link to={`/guide/${q.guide}`} className="text-link">
            {t('quiz.readMore')}
          </Link>
        </>
      )}
      next={
        <button type="button" className="button" onClick={onNext}>
          {last ? t('quiz.finish') : t('quiz.next')}
        </button>
      }
    />
  );
}

function QuizResult({ score, onRestart }: { score: number; onRestart: () => void }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const perfect = score === QUIZ.length;
  useEffect(() => {
    ref.current?.focus();
    void recordActivity('quiz').then(() => (perfect ? recordActivity('quiz-parfait') : undefined));
  }, [perfect]);
  return (
    <section ref={ref} tabIndex={-1} className="card done-panel" aria-labelledby="quiz-result">
      <h2 id="quiz-result" className="card__label">
        {t('quiz.result')}
      </h2>
      <p className="score">{t('quiz.score', { score, total: QUIZ.length })}</p>
      <p className="card__text">{perfect ? t('quiz.perfect') : t('quiz.well')}</p>
      <div className="button-row">
        <button type="button" className="button button--ghost" onClick={onRestart}>
          {t('quiz.restart')}
        </button>
        <Link to="/activites" className="text-link">
          {t('activities.title')}
        </Link>
      </div>
    </section>
  );
}
