const STATS_KEY = "quiz_stats";

interface Topic {
  title: string;
  totalCorrectAnswers: number;
  totalAnswers: number;
}

export interface QuizStats {
  date: Date;
  topics: Topic[];
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
  get(): QuizStats[] {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) return [];
    return JSON.parse(data, reviveQuizStat);
  },
  set(stats: QuizStats[]) {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  },
  add(stat: QuizStats) {
    const stats = statsStorage.get();
    stats.push(stat);
    statsStorage.set(stats);
  },
  clear() {
    localStorage.removeItem(STATS_KEY);
  }
};
