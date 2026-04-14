import { createServerSupabaseClient } from "@/lib/supabase/server";
import { rowToWatchItem, WatchStatus, STATUS_LABELS } from "@/types";

export default async function StatsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: rows } = await supabase
    .from("watch_items")
    .select("*")
    .order("updated_at", { ascending: false });

  const items = (rows || []).map(rowToWatchItem);

  const statusCounts: Record<WatchStatus, number> = { watching: 0, completed: 0, plan_to_watch: 0, dropped: 0 };
  items.forEach((i) => statusCounts[i.status]++);

  const genreCounts: Record<string, number> = {};
  items.forEach((i) => i.genre.forEach((g) => (genreCounts[g] = (genreCounts[g] || 0) + 1)));
  const topGenres = Object.entries(genreCounts).sort(([, a], [, b]) => b - a).slice(0, 10);
  const maxGenreCount = topGenres.length > 0 ? topGenres[0][1] : 1;

  const ratingDist: Record<number, number> = {};
  items.forEach((i) => { if (i.rating !== null) ratingDist[i.rating] = (ratingDist[i.rating] || 0) + 1; });
  const maxRatingCount = Math.max(...Object.values(ratingDist), 1);

  const movieCount = items.filter((i) => i.mediaType === "movie").length;
  const tvCount = items.filter((i) => i.mediaType === "tv").length;
  const completionRate = items.length > 0 ? Math.round((statusCounts.completed / items.length) * 100) : 0;
  const rated = items.filter((i) => i.rating !== null);
  const avgRating = rated.length > 0 ? (rated.reduce((sum, i) => sum + i.rating!, 0) / rated.length).toFixed(1) : "—";

  const statusColors: Record<WatchStatus, string> = {
    watching: "bg-watching", completed: "bg-completed", plan_to_watch: "bg-white", dropped: "bg-dropped",
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl font-heading tracking-wider">YOUR STATS</h1>
        <div className="w-12 h-0.5 bg-primary mt-3" />
      </div>

      {/* Overview */}
      <div className="grid grid-cols-4 gap-px bg-white/5">
        {[
          { label: "TOTAL", value: items.length },
          { label: "AVG RATING", value: avgRating },
          { label: "COMPLETION", value: `${completionRate}%` },
          { label: "REVIEWED", value: items.filter((i) => i.review).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-black p-6 text-center">
            <div className="text-3xl font-heading text-primary">{value}</div>
            <div className="text-[9px] tracking-[0.3em] text-white/40 mt-2">{label}</div>
          </div>
        ))}
      </div>

      {/* Status */}
      <div>
        <h2 className="text-2xl font-heading tracking-wider mb-1">BY STATUS</h2>
        <div className="w-8 h-0.5 bg-primary mb-6" />
        <div className="space-y-3">
          {(Object.entries(STATUS_LABELS) as [WatchStatus, string][]).map(([status, label]) => (
            <div key={status} className="flex items-center gap-3">
              <span className="w-32 text-xs text-white/45 tracking-[0.2em]">{label.toUpperCase()}</span>
              <div className="flex-1 h-5 bg-surface overflow-hidden">
                <div
                  className={`h-full ${statusColors[status]} transition-all duration-700`}
                  style={{ width: items.length > 0 ? `${(statusCounts[status] / items.length) * 100}%` : "0%", opacity: status === "plan_to_watch" ? 0.3 : 1 }}
                />
              </div>
              <span className="w-8 text-right text-sm font-heading text-white/30">{statusCounts[status]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <h2 className="text-2xl font-heading tracking-wider mb-1">FILMS VS SERIES</h2>
        <div className="w-8 h-0.5 bg-primary mb-6" />
        <div className="flex h-12 overflow-hidden">
          {movieCount > 0 && (
            <div className="bg-primary flex items-center justify-center font-heading text-white text-lg tracking-wider"
              style={{ width: `${(movieCount / (items.length || 1)) * 100}%` }}>{movieCount}</div>
          )}
          {tvCount > 0 && (
            <div className="bg-accent flex items-center justify-center font-heading text-black text-lg tracking-wider"
              style={{ width: `${(tvCount / (items.length || 1)) * 100}%` }}>{tvCount}</div>
          )}
        </div>
        <div className="flex justify-between mt-3 text-xs text-white/45 tracking-[0.2em]">
          <span>FILMS ({movieCount})</span>
          <span>SERIES ({tvCount})</span>
        </div>
      </div>

      {/* Genres */}
      <div>
        <h2 className="text-2xl font-heading tracking-wider mb-1">TOP GENRES</h2>
        <div className="w-8 h-0.5 bg-primary mb-6" />
        <div className="space-y-2">
          {topGenres.map(([genre, count]) => (
            <div key={genre} className="flex items-center gap-3">
              <span className="w-24 text-xs text-white/45 tracking-wider uppercase">{genre}</span>
              <div className="flex-1 h-4 bg-surface overflow-hidden">
                <div className="h-full bg-primary/50 transition-all duration-700" style={{ width: `${(count / maxGenreCount) * 100}%` }} />
              </div>
              <span className="w-6 text-right text-xs text-white/45 font-heading">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div>
        <h2 className="text-2xl font-heading tracking-wider mb-1">RATING DISTRIBUTION</h2>
        <div className="w-8 h-0.5 bg-primary mb-6" />
        <div className="flex items-end gap-1.5 h-40">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <div key={n} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end h-32">
                <div
                  className="w-full bg-primary transition-all duration-700"
                  style={{ height: ratingDist[n] ? `${(ratingDist[n] / maxRatingCount) * 100}%` : "0%", minHeight: ratingDist[n] ? "4px" : "0px" }}
                />
              </div>
              <span className="text-xs text-white/40 font-heading">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
