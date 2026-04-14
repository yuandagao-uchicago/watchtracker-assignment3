import { NextRequest, NextResponse } from "next/server";
import { searchMulti, posterUrl, genreIdsToNames } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.trim().length === 0) {
    return NextResponse.json({ results: [], totalPages: 0 });
  }

  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");

  const { results, totalPages } = await searchMulti(q.trim(), page);

  // Return pre-processed results (poster URL resolved, genre names mapped)
  const mapped = results.map((r) => ({
    id: r.id,
    title: r.title,
    mediaType: r.mediaType,
    year: r.year,
    posterUrl: posterUrl(r.posterPath),
    overview: r.overview,
    genres: genreIdsToNames(r.genreIds),
    voteAverage: r.voteAverage,
  }));

  return NextResponse.json({ results: mapped, totalPages });
}
