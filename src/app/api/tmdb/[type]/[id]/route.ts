import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;

  if (type !== "movie" && type !== "tv") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const headers = {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    "Content-Type": "application/json",
  };

  // Fetch watch providers
  const res = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}/watch/providers`,
    { headers }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "TMDB request failed" }, { status: res.status });
  }

  const data = await res.json();

  // Return US providers by default (most common), with fallback regions
  const region = req.nextUrl.searchParams.get("region") || "US";
  const regionData = data.results?.[region] || data.results?.["US"] || {};

  const mapProviders = (list: { provider_name: string; logo_path: string; provider_id: number }[] | undefined) =>
    (list || []).map((p) => ({
      name: p.provider_name,
      logo: `https://image.tmdb.org/t/p/w92${p.logo_path}`,
      id: p.provider_id,
    }));

  return NextResponse.json({
    link: regionData.link || null,
    flatrate: mapProviders(regionData.flatrate),
    rent: mapProviders(regionData.rent),
    buy: mapProviders(regionData.buy),
  });
}
