import { Question } from "./questions";

const STATS_KEY = "quiz_stats";

export interface UserAnswer {
  questionId: number;
  answerText: string;
  isCorrect: boolean;
}

interface Quiz {
  questions: Question[];
  startDate: Date;
  userAnswers: UserAnswer[];
}
interface QuizStats {
  quizzes: Quiz[];
  totalCorrectAnswers: number;
  totalAnswers: number;
}
function getQuizStats(): QuizStats {
  const stats = localStorage.getItem(STATS_KEY);
  if (stats) {
    return JSON.parse(stats);
  }
  return {
    quizzes: [],
    totalCorrectAnswers: 0,
    totalAnswers: 0,
  };
}

function saveQuizStats(quiz: Quiz): void {
  const stats = getQuizStats();
  stats.quizzes.push(quiz);
  stats.totalCorrectAnswers += quiz.userAnswers.filter(
    (answer) => answer.isCorrect
  ).length;
  stats.totalAnswers += quiz.userAnswers.length;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function clearQuizStats(): void {
  localStorage.removeItem(STATS_KEY);
}

export function getQuizStatsSummary(): {
  totalQuizzes: number;
  totalCorrectAnswers: number;
  totalAnswers: number;
} {
  const stats = getQuizStats();
  return {
    totalQuizzes: stats.quizzes.length,
    totalCorrectAnswers: stats.totalCorrectAnswers,
    totalAnswers: stats.totalAnswers,
  };
}

export function getLastQuiz(): Quiz | null {
  const stats = getQuizStats();
  return stats.quizzes.length > 0
    ? stats.quizzes[stats.quizzes.length - 1]!
    : null;
}

export function saveLastQuiz(questions: Question[]): Quiz {
  const quiz: Quiz = {
    questions,
    userAnswers: [],
    startDate: new Date(),
  };
  saveQuizStats(quiz);
  return quiz;
}

export function updateLastQuiz(userAnswers: UserAnswer[]): void {
  const stats = getQuizStats();
  if (stats.quizzes.length > 0) {
    const lastQuiz = stats.quizzes[stats.quizzes.length - 1];
    if (lastQuiz) {
      lastQuiz.userAnswers = userAnswers;
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
  }
}
