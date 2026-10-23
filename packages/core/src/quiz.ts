/**
 * Quiz des bons réflexes (§ 4 du plan) : court, sans chronomètre.
 * Chaque réponse est expliquée et renvoie à la page du guide.
 */

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  answer: string;
  explanation: string;
  /** Page du guide qui en parle. */
  guide: string;
}

/** Nombre de bonnes réponses. */
export function quizScore(
  questions: readonly QuizQuestion[],
  answers: Readonly<Record<string, string>>,
): number {
  return questions.filter((q) => answers[q.id] === q.answer).length;
}
