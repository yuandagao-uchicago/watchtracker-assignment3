export type MediaType = "movie" | "tv";

export type WatchStatus =
  | "plan_to_watch"
  | "watching"
  | "completed"
  | "dropped";

export interface WatchItem {
  id: string;
  userId: string;
  title: string;
  mediaType: MediaType;
  genre: string[];
  year: number;
  posterUrl: string;
  synopsis: string;
  status: WatchStatus;
  rating: number | null;
  review: string | null;
  tmdbId: number | null;
  addedAt: string;
  updatedAt: string;
}

export const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Western",
] as const;

export const STATUS_LABELS: Record<WatchStatus, string> = {
  plan_to_watch: "Plan to Watch",
  watching: "Watching",
  completed: "Completed",
  dropped: "Dropped",
};

// Convert Supabase snake_case row to camelCase WatchItem
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToWatchItem(row: any): WatchItem {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    mediaType: row.media_type,
    genre: row.genre || [],
    year: row.year,
    posterUrl: row.poster_url,
    synopsis: row.synopsis,
    status: row.status,
    rating: row.rating,
    review: row.review,
    tmdbId: row.tmdb_id,
    addedAt: row.added_at,
    updatedAt: row.updated_at,
  };
}
