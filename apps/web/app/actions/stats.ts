const STATS_KEY = "quiz_stats";

interface Argument {
  title: string;
  totalCorrectAnswers: number;
  totalAnswers: number;
}

export interface QuizStat {
  date: Date;
  arguments: Argument[];
  totalCorrectAnswers: number;
  totalAnswers: number;
}

// Helper to serialize/deserialize Date
function reviveQuizStat(key: string, value: any) {
  if (key === "date" && typeof value === "string") {
    return new Date(value);
  }
  return value;
}

export const statsStorage = {
  get(): QuizStat[] {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) return [];
    return JSON.parse(data, reviveQuizStat);
  },
  set(stats: QuizStat[]) {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  },
  add(stat: QuizStat) {
    const stats = statsStorage.get();
    stats.push(stat);
    statsStorage.set(stats);
  },
  clear() {
    localStorage.removeItem(STATS_KEY);
  }
};
