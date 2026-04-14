const TMDB_BASE = "https://api.themoviedb.org/3";

function headers() {
  return {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export function posterUrl(path: string | null, size = "w500") {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// TMDB genre IDs → human-readable names
const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
  // TV-specific
  10759: "Action", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi", 10766: "Soap", 10767: "Talk", 10768: "War",
};

export function genreIdsToNames(ids: number[]): string[] {
  return ids.map((id) => GENRE_MAP[id]).filter(Boolean);
}

export interface TmdbSearchResult {
  id: number;
  title: string;
  mediaType: "movie" | "tv";
  year: number;
  posterPath: string | null;
  overview: string;
  genreIds: number[];
  voteAverage: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseResult(item: any): TmdbSearchResult | null {
  const mt = item.media_type;
  if (mt !== "movie" && mt !== "tv") return null;
  const title = mt === "movie" ? item.title : item.name;
  const date = mt === "movie" ? item.release_date : item.first_air_date;
  return {
    id: item.id,
    title: title || "Untitled",
    mediaType: mt,
    year: date ? parseInt(date.slice(0, 4)) : 0,
    posterPath: item.poster_path,
    overview: item.overview || "",
    genreIds: item.genre_ids || [],
    voteAverage: item.vote_average || 0,
  };
}

export async function searchMulti(query: string, page = 1): Promise<{ results: TmdbSearchResult[]; totalPages: number }> {
  const url = `${TMDB_BASE}/search/multi?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);
  const data = await res.json();
  const results = (data.results || []).map(parseResult).filter(Boolean) as TmdbSearchResult[];
  return { results, totalPages: data.total_pages || 1 };
}

export async function getMovieDetails(id: number) {
  const res = await fetch(`${TMDB_BASE}/movie/${id}`, { headers: headers() });
  if (!res.ok) throw new Error(`TMDB movie ${id} failed: ${res.status}`);
  return res.json();
}

export async function getTvDetails(id: number) {
  const res = await fetch(`${TMDB_BASE}/tv/${id}`, { headers: headers() });
  if (!res.ok) throw new Error(`TMDB tv ${id} failed: ${res.status}`);
  return res.json();
}
