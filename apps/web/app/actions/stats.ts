import { Question } from "./questions";

const STATS_KEY = "quiz_stats";

interface UserAnswer {
  questionId: number;
  answerId: number;
}

interface Quiz {
  questions: Question[];
  endDate: Date;
  userAnswers: UserAnswer[];
  correctAnswers: number;
  totalAnswers: number;
}
interface QuizStats {
  quizzes: Quiz[];
  totalQuizzes: number;
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
    totalQuizzes: 0,
    totalCorrectAnswers: 0,
    totalAnswers: 0,
  };
}

function saveQuizStats(quiz: Quiz): void {
  const stats = getQuizStats();
  stats.quizzes.push(quiz);
  stats.totalQuizzes += 1;
  stats.totalCorrectAnswers += quiz.correctAnswers;
  stats.totalAnswers += quiz.totalAnswers;
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
    totalQuizzes: stats.totalQuizzes,
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

export function saveLastQuiz(
  questions: Question[],
  correctAnswers: number,
  totalAnswers: number
): void {
  const quiz: Quiz = {
    questions,
    userAnswers: [],
    endDate: new Date(),
    correctAnswers,
    totalAnswers,
  };
  saveQuizStats(quiz);
}

export function UpdateLastQuiz(questionId: number, answerId: number): void {
  const stats = getQuizStats();
  if (stats.quizzes.length > 0) {
    const lastQuiz = stats.quizzes[stats.quizzes.length - 1];
    if (lastQuiz) {
      lastQuiz.userAnswers.push({ questionId, answerId });
      if (answerId == 1) {
        // Assuming answerId 1 is the correct answer
        lastQuiz.correctAnswers += 1;
        lastQuiz.totalAnswers += 1;
      }
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
  }
}
