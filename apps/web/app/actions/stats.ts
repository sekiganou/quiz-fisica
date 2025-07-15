const STATS_KEY = "stats_by_topic";

interface StatsByTopic {
  topic: string;
  totalCorrectAnswers: number;
  totalAnswers: number;
}

export const statsByTopicStorage = {
  get() {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) return new Map<string, StatsByTopic>();

    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return new Map<string, StatsByTopic>(parsed);
      } else {
        return new Map<string, StatsByTopic>();
      }
    } catch (error) {
      return new Map<string, StatsByTopic>();
    }
  },
  add(stat: StatsByTopic) {
    const stats = statsByTopicStorage.get();
    const existingStat = stats.get(stat.topic);

    if (existingStat) {
      existingStat.totalAnswers += stat.totalAnswers;
      existingStat.totalCorrectAnswers += stat.totalCorrectAnswers;
      stats.set(stat.topic, existingStat);
    } else {
      stats.set(stat.topic, stat);
    }

    localStorage.setItem(
      STATS_KEY,
      JSON.stringify(Array.from(stats.entries()))
    );
  },
  has(topic: string): boolean {
    const stats = statsByTopicStorage.get();
    if (!stats) return false;
    return stats.has(topic);
  },
  clear() {
    localStorage.removeItem(STATS_KEY);
  },
  array() {
    const stats = statsByTopicStorage.get();
    if (!stats) return [];
    return Array.from(stats.values()).sort((a, b) => {
      return a.topic.localeCompare(b.topic);
    });
  },
};
