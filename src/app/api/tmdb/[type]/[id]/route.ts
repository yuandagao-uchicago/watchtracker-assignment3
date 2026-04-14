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

  const wantVideos = req.nextUrl.searchParams.get("videos") === "true";

  // Fetch watch providers
  const providersRes = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}/watch/providers`,
    { headers }
  );

  const region = req.nextUrl.searchParams.get("region") || "US";
  let providers = { link: null as string | null, flatrate: [] as { name: string; logo: string; id: number }[], rent: [] as { name: string; logo: string; id: number }[], buy: [] as { name: string; logo: string; id: number }[] };

  if (providersRes.ok) {
    const data = await providersRes.json();
    const regionData = data.results?.[region] || data.results?.["US"] || {};

    const mapProviders = (list: { provider_name: string; logo_path: string; provider_id: number }[] | undefined) =>
      (list || []).map((p) => ({
        name: p.provider_name,
        logo: `https://image.tmdb.org/t/p/w92${p.logo_path}`,
        id: p.provider_id,
      }));

    providers = {
      link: regionData.link || null,
      flatrate: mapProviders(regionData.flatrate),
      rent: mapProviders(regionData.rent),
      buy: mapProviders(regionData.buy),
    };
  }

  // Fetch videos (trailers) if requested
  let trailerKey: string | null = null;
  if (wantVideos) {
    const videosRes = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/videos`,
      { headers }
    );
    if (videosRes.ok) {
      const videosData = await videosRes.json();
      const trailer = (videosData.results || []).find(
        (v: { site: string; type: string }) => v.site === "YouTube" && v.type === "Trailer"
      ) || (videosData.results || []).find(
        (v: { site: string }) => v.site === "YouTube"
      );
      trailerKey = trailer?.key || null;
    }
  }

  return NextResponse.json({
    ...providers,
    trailerKey,
  });
}
