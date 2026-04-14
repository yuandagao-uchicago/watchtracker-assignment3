import { WatchItem } from "@/types";

export interface Recommendation {
  item: WatchItem;
  reason: string;
  score: number;
}

export function getRecommendations(items: WatchItem[]): Recommendation[] {
  // Find top-rated completed items and extract preferred genres
  const completedRated = items
    .filter((i) => i.status === "completed" && i.rating !== null && i.rating >= 7)
    .sort((a, b) => b.rating! - a.rating!);

  const genreScores: Record<string, number> = {};
  for (const item of completedRated) {
    for (const genre of item.genre) {
      genreScores[genre] = (genreScores[genre] || 0) + (item.rating || 0);
    }
  }

  const topGenres = Object.entries(genreScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([genre]) => genre);

  // Score plan_to_watch items by genre overlap
  const planToWatch = items.filter((i) => i.status === "plan_to_watch");

  if (planToWatch.length > 0) {
    const recommendations: Recommendation[] = planToWatch.map((item) => {
      const matchingGenres = item.genre.filter((g) => topGenres.includes(g));
      const score = matchingGenres.reduce(
        (sum, g) => sum + (genreScores[g] || 0),
        0
      );
      const reason =
        matchingGenres.length > 0
          ? `Based on your love of ${matchingGenres.join(", ")}`
          : "In your Plan to Watch list";
      return { item, reason, score };
    });

    return recommendations.sort((a, b) => b.score - a.score);
  }

  // Fallback: suggest highest-rated completed for rewatch
  if (completedRated.length > 0) {
    return completedRated.slice(0, 5).map((item) => ({
      item,
      reason: `Rated ${item.rating}/10 — worth a rewatch!`,
      score: item.rating || 0,
    }));
  }

  return [];
}
