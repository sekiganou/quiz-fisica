const STATS_KEY = "quiz_stats";

interface Stats {
  correct: number;
  total: number;
}
function getStats(): Stats {
  if (typeof window === "undefined") return { correct: 0, total: 0 };
  const data = localStorage.getItem(STATS_KEY);
  if (!data) return { correct: 0, total: 0 };
  try {
    return JSON.parse(data) as Stats;
  } catch (error) {
    console.error("Error parsing stats from localStorage:", error);
    return { correct: 0, total: 0 };
  }
}

function saveStats(stats: Stats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordAnswer(isCorrect: boolean): void {
  const stats = getStats();
  stats.total += 1;
  if (isCorrect) stats.correct += 1;
  saveStats(stats);
}

export function getCorrectAnswers(): number {
  return getStats().correct;
}

export function getTotalAnswers(): number {
  return getStats().total;
}

export function resetStats(): void {
  saveStats({ correct: 0, total: 0 });
}
