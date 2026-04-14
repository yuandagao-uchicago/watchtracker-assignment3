import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { rowToWatchItem } from "@/types";
import { getInitials, getPosterGradient, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/watchlist/StatusBadge";
import ShowDetailClient from "./ShowDetailClient";
import WatchProviders from "@/components/watchlist/WatchProviders";
import CommentsSection from "@/components/watchlist/CommentsSection";

export default async function ShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: row } = await supabase
    .from("watch_items")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) {
    return (
      <div className="text-center py-32">
        <div className="font-heading text-8xl text-white/5">404</div>
        <p className="text-white/45 tracking-wider mt-4">Title not found.</p>
        <Link href="/watchlist" className="inline-block mt-8 px-6 py-2.5 bg-primary text-white font-heading tracking-wider">
          BACK
        </Link>
      </div>
    );
  }

  const item = rowToWatchItem(row);

  // Fetch comments for this TMDB item (visible to all signed-in users)
  let comments: { id: string; user_id: string; user_name: string; content: string; created_at: string }[] = [];
  if (item.tmdbId) {
    const { data: commentRows } = await supabase
      .from("comments")
      .select("*")
      .eq("tmdb_id", item.tmdbId)
      .eq("media_type", item.mediaType)
      .order("created_at", { ascending: false });
    comments = commentRows || [];
  }

  return (
    <div className="space-y-12">
      {/* Hero backdrop */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 overflow-hidden">
        {item.posterUrl && (
          <div className="absolute inset-0">
            <img src={item.posterUrl} alt="" className="absolute inset-0 w-full h-full object-cover object-top opacity-20 blur-md scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <Link href="/watchlist" className="inline-flex items-center gap-2 text-white/40 hover:text-primary text-sm tracking-wider transition-colors mb-8">
            ← BACK
          </Link>
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Poster */}
            <div className="w-full sm:w-56 shrink-0">
              <div className="relative aspect-[2/3] overflow-hidden shadow-2xl shadow-primary/10 border border-white/5">
                {item.posterUrl ? (
                  <img src={item.posterUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}>
                    <span className="text-white/10 text-7xl font-heading">{getInitials(item.title)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="text-xs text-white/45 tracking-[0.3em] mb-2">
                {item.year} <span className="text-primary">|</span> {item.mediaType === "tv" ? "SERIES" : "FILM"}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading tracking-wider leading-[0.9]">{item.title}</h1>
              <div className="w-12 h-0.5 bg-primary mt-4 mb-5" />

              <div className="flex flex-wrap gap-3 mb-4">
                {item.genre.map((g) => (
                  <span key={g} className="px-3 py-1 border border-white/10 text-xs text-white/40 tracking-wider uppercase">{g}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <StatusBadge status={item.status} />
                {item.rating !== null && (
                  <span className="font-heading text-3xl text-accent">{item.rating}<span className="text-white/40 text-xl">/10</span></span>
                )}
              </div>

              <div className="text-[11px] text-white/40 tracking-wider">
                ADDED {formatDate(item.addedAt).toUpperCase()} &middot; UPDATED {formatDate(item.updatedAt).toUpperCase()}
              </div>

              {item.synopsis && (
                <p className="text-white/40 leading-relaxed mt-6 max-w-xl">{item.synopsis}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {item.tmdbId && (
        <div className="max-w-3xl mx-auto">
          <WatchProviders tmdbId={item.tmdbId} mediaType={item.mediaType} />
        </div>
      )}

      <ShowDetailClient item={item} />

      {item.tmdbId && (
        <div className="max-w-3xl mx-auto">
          <CommentsSection
            tmdbId={item.tmdbId}
            mediaType={item.mediaType}
            initialComments={comments}
          />
        </div>
      )}
    </div>
  );
}
