"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createItem } from "@/app/actions/watchlist";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface TmdbResult {
  id: number;
  title: string;
  mediaType: "movie" | "tv";
  year: number;
  posterUrl: string;
  overview: string;
  genres: string[];
  voteAverage: number;
}

export default function SearchPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSave = async (item: TmdbResult) => {
    setSavingId(item.id);
    try {
      await createItem({
        title: item.title,
        mediaType: item.mediaType,
        genre: item.genres,
        year: item.year || new Date().getFullYear(),
        posterUrl: item.posterUrl,
        synopsis: item.overview,
        status: "plan_to_watch",
        rating: null,
        tmdbId: item.id,
      });
      setSavedIds((prev) => new Set([...prev, item.id]));
    } catch {
      // ignore duplicate errors
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-5xl font-heading tracking-wider">
          {t.search.title} <span className="text-primary">{t.search.tmdb}</span>
        </h1>
        <div className="w-12 h-0.5 bg-primary mt-3 mb-2" />
        <p className="text-white/50 text-sm tracking-wider">
          {t.search.subtitle}
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.search.placeholder}
          className="flex-1 bg-transparent border-b border-white/10 focus:border-primary px-0 py-3 text-lg tracking-wider placeholder-white/35 focus:outline-none transition-colors"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-heading text-lg tracking-wider transition-colors disabled:opacity-50"
        >
          {loading ? t.search.searching : t.search.searchBtn}
        </button>
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-16">
          <div className="text-white/40 tracking-wider">{t.search.loadingMsg}</div>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16">
          <div className="font-heading text-6xl text-white/5 mb-4">{t.search.noResults}</div>
          <p className="text-white/40 text-sm tracking-wider">
            {t.search.tryDifferent}
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 stagger-children">
          {results.map((item) => {
            const isSaved = savedIds.has(item.id);
            const isSaving = savingId === item.id;
            return (
              <div
                key={`${item.mediaType}-${item.id}`}
                className="group relative bg-surface border border-white/5 overflow-hidden hover-lift"
              >
                {/* Poster */}
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
                  {/* TMDB rating badge */}
                  {item.voteAverage > 0 && (
                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 text-xs font-heading text-accent">
                      {item.voteAverage.toFixed(1)}
                    </div>
                  )}
                  {/* Type badge */}
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 text-[10px] tracking-widest text-white/60 uppercase">
                    {item.mediaType === "tv" ? t.common.series : t.common.film}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-heading text-lg tracking-wide leading-tight truncate">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-white/45 tracking-wider mt-1">
                    {item.year || "—"} {item.genres.length > 0 && `· ${item.genres.slice(0, 2).join(", ")}`}
                  </div>

                  {/* Save button */}
                  <button
                    onClick={() => handleSave(item)}
                    disabled={isSaving || isSaved}
                    className={`mt-3 w-full py-2 text-[11px] tracking-[0.2em] font-bold transition-all ${
                      isSaved
                        ? "bg-white/10 text-white/40 cursor-default"
                        : "bg-primary hover:bg-primary-hover text-white"
                    } disabled:opacity-60`}
                  >
                    {isSaved ? t.search.saved : isSaving ? t.search.saving : t.search.saveBtn}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Link to manual add */}
      <div className="text-center pt-4 border-t border-white/5">
        <p className="text-white/40 text-sm tracking-wider">
          {t.search.cantFind}{" "}
          <a href="/watchlist/add" onClick={(e) => { e.preventDefault(); router.push("/watchlist/add"); }} className="text-primary hover:underline">
            {t.search.addManually}
          </a>
        </p>
      </div>
    </div>
  );
}
