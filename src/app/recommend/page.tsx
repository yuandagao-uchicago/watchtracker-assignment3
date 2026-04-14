import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { rowToWatchItem } from "@/types";

const TMDB_BASE = "https://api.themoviedb.org/3";

// TMDB genre id → name
const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 14: "Fantasy",
  27: "Horror", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  53: "Thriller", 37: "Western", 10759: "Action", 10765: "Sci-Fi",
};

// Reverse lookup: genre name → TMDB genre id (for discover endpoint)
const NAME_TO_ID: Record<string, number> = {
  "Action": 28, "Adventure": 12, "Animation": 16, "Comedy": 35,
  "Crime": 80, "Documentary": 99, "Drama": 18, "Fantasy": 14,
  "Horror": 27, "Mystery": 9648, "Romance": 10749, "Sci-Fi": 878,
  "Thriller": 53, "Western": 37,
};

interface TmdbDiscover {
  id: number;
  title?: string;
  name?: string;
  media_type?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  vote_average: number;
  overview: string;
}

export default async function RecommendPage() {
  const supabase = await createServerSupabaseClient();
  const { data: rows } = await supabase
    .from("watch_items")
    .select("*")
    .order("updated_at", { ascending: false });

  const items = (rows || []).map(rowToWatchItem);

  // Find top genres from highly-rated items
  const genreScores: Record<string, number> = {};
  for (const item of items) {
    if (item.status === "completed" && item.rating && item.rating >= 6) {
      for (const g of item.genre) {
        genreScores[g] = (genreScores[g] || 0) + item.rating;
      }
    }
  }

  const topGenres = Object.entries(genreScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([genre]) => genre);

  // Collect TMDB IDs user already has (to exclude from recommendations)
  const savedTmdbIds = new Set(items.filter((i) => i.tmdbId).map((i) => i.tmdbId));

  let recommendations: { title: string; year: number; posterUrl: string; genres: string[]; rating: number; overview: string; tmdbId: number; mediaType: "movie" | "tv" }[] = [];

  if (topGenres.length > 0) {
    // Use TMDB discover to find popular movies in the user's top genres
    const genreIds = topGenres
      .map((g) => NAME_TO_ID[g])
      .filter(Boolean)
      .join(",");

    try {
      const res = await fetch(
        `${TMDB_BASE}/discover/movie?with_genres=${genreIds}&sort_by=vote_average.desc&vote_count.gte=500&page=1`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            "Content-Type": "application/json",
          },
          next: { revalidate: 3600 },
        }
      );
      const data = await res.json();
      const results = (data.results || []) as TmdbDiscover[];

      recommendations = results
        .filter((r) => !savedTmdbIds.has(r.id))
        .slice(0, 10)
        .map((r) => ({
          title: r.title || r.name || "Untitled",
          year: r.release_date ? parseInt(r.release_date.slice(0, 4)) : 0,
          posterUrl: r.poster_path ? `https://image.tmdb.org/t/p/w300${r.poster_path}` : "",
          genres: r.genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean),
          rating: r.vote_average,
          overview: r.overview,
          tmdbId: r.id,
          mediaType: "movie" as const,
        }));
    } catch {
      // Fall through to empty state
    }
  }

  // Fallback: if no rated items, show trending movies
  if (recommendations.length === 0 && topGenres.length === 0) {
    try {
      const res = await fetch(
        `${TMDB_BASE}/trending/movie/week`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            "Content-Type": "application/json",
          },
          next: { revalidate: 3600 },
        }
      );
      const data = await res.json();
      const results = (data.results || []) as TmdbDiscover[];

      recommendations = results
        .filter((r) => !savedTmdbIds.has(r.id))
        .slice(0, 10)
        .map((r) => ({
          title: r.title || r.name || "Untitled",
          year: r.release_date ? parseInt(r.release_date.slice(0, 4)) : 0,
          posterUrl: r.poster_path ? `https://image.tmdb.org/t/p/w300${r.poster_path}` : "",
          genres: r.genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean),
          rating: r.vote_average,
          overview: r.overview,
          tmdbId: r.id,
          mediaType: "movie" as const,
        }));
    } catch {
      // Fall through to empty state
    }
  }

  const hasRatedItems = topGenres.length > 0;

  return (
    <div className="space-y-10 page-enter">
      <div>
        <h1 className="text-5xl font-heading tracking-wider">
          RECOMMENDED<br /><span className="text-primary">FOR YOU</span>
        </h1>
        <div className="w-12 h-0.5 bg-primary mt-4" />
        <p className="text-white/50 mt-4 tracking-wider text-sm">
          {hasRatedItems
            ? `Based on your love of ${topGenres.join(", ")}. Titles you haven't saved yet.`
            : "Trending this week. Rate some completed titles to get personalized picks."}
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-32">
          <div className="font-heading text-7xl text-white/5">NO DATA</div>
          <p className="text-white/40 text-sm tracking-wider mt-4 max-w-sm mx-auto">
            Search and save some titles, mark them as completed, and rate them to get recommendations.
          </p>
          <Link href="/search" className="inline-block mt-8 px-8 py-3 bg-primary text-white font-heading tracking-wider">
            SEARCH TMDB
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 stagger-children">
          {recommendations.map((item) => (
            <div
              key={item.tmdbId}
              className="group bg-surface border border-white/5 overflow-hidden hover-lift"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                {item.posterUrl ? (
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <span className="text-white/10 font-heading text-4xl">?</span>
                  </div>
                )}
                {item.rating > 0 && (
                  <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 text-xs font-heading text-accent">
                    {item.rating.toFixed(1)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-heading text-lg tracking-wide leading-tight truncate text-white">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-white/45 tracking-wider mt-1">
                    {item.year || "—"} {item.genres.length > 0 && `· ${item.genres.slice(0, 2).join(", ")}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
