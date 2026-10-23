import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface ChoiceOption {
  id: string;
  text: string;
}

interface ChoiceQuestionProps {
  /** Identifiant unique de la question (noms des champs). */
  id: string;
  /** « Question 2 sur 10 », au-dessus de l'intitulé. */
  counter: string;
  prompt: string;
  options: readonly ChoiceOption[];
  correct: string;
  validateLabel: string;
  chooseLabel: string;
  /** Contenu du retour une fois la réponse validée. */
  feedback: (chosen: string) => ReactNode;
  onAnswer: (chosen: string) => void;
  /** Bouton pour passer à la suite, affiché après la réponse. */
  next: ReactNode;
}

/**
 * Une question à choix unique : on choisit, on valide, puis le retour s'affiche
 * et reçoit le focus. Pas de chronomètre, et la réponse reste visible.
 */
export function ChoiceQuestion({
  id,
  counter,
  prompt,
  options,
  correct,
  validateLabel,
  chooseLabel,
  feedback,
  onAnswer,
  next,
}: ChoiceQuestionProps) {
  const { t } = useTranslation();
  const [chosen, setChosen] = useState('');
  const [answered, setAnswered] = useState(false);
  const [error, setError] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLFieldSetElement>(null);

  // Nouvelle question : le focus va sur le groupe, annoncé avec son intitulé.
  useEffect(() => {
    groupRef.current?.focus();
  }, [id]);

  useEffect(() => {
    if (answered) feedbackRef.current?.focus();
  }, [answered]);

  return (
    <form
      className="quiz"
      onSubmit={(e) => {
        e.preventDefault();
        if (answered) return;
        if (!chosen) {
          setError(true);
          return;
        }
        setError(false);
        setAnswered(true);
        onAnswer(chosen);
      }}
    >
      <p className="quiz__counter">{counter}</p>
      <fieldset
        ref={groupRef}
        tabIndex={-1}
        className="card choice quiz__question"
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <legend className="quiz__prompt">{prompt}</legend>
        {options.map((option) => {
          const state = !answered
            ? ''
            : option.id === correct
              ? ' quiz__option--correct'
              : option.id === chosen
                ? ' quiz__option--wrong'
                : '';
          return (
            <label key={option.id} className={`choice__option quiz__option${state}`}>
              <input
                type="radio"
                name={id}
                value={option.id}
                checked={chosen === option.id}
                disabled={answered && chosen !== option.id}
                onChange={() => {
                  setChosen(option.id);
                  setError(false);
                }}
              />
              <span>
                {option.text}
                {answered && option.id === correct && (
                  <span className="quiz__mark"> {t('quizMarks.correct')}</span>
                )}
                {answered && option.id === chosen && option.id !== correct && (
                  <span className="quiz__mark"> {t('quizMarks.chosen')}</span>
                )}
              </span>
            </label>
          );
        })}
        {error && (
          <p id={`${id}-error`} className="field__error" role="alert">
            {chooseLabel}
          </p>
        )}
      </fieldset>
      {answered ? (
        <div ref={feedbackRef} tabIndex={-1} className="quiz__feedback">
          {feedback(chosen)}
          {next}
        </div>
      ) : (
        <button type="submit" className="button">
          {validateLabel}
        </button>
      )}
    </form>
  );
}
