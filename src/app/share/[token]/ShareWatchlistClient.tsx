"use client";

import { useState } from "react";
import { WatchItem, WatchStatus, MediaType } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleContext";

const statusFilters: ("all" | WatchStatus)[] = [
  "all", "watching", "completed", "plan_to_watch", "dropped",
];

export default function ShareWatchlistClient({ items }: { items: WatchItem[] }) {
  const { t } = useLocale();
  const [statusFilter, setStatusFilter] = useState<"all" | WatchStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | MediaType>("all");
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (typeFilter !== "all" && item.mediaType !== typeFilter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = items.reduce(
    (acc, item) => { acc[item.status] = (acc[item.status] || 0) + 1; return acc; },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-8 bg-primary" />
          <span className="text-[11px] tracking-[0.4em] text-primary">SHARED COLLECTION</span>
        </div>
        <h1 className="text-5xl font-heading tracking-wider">{t.watchlist.title}</h1>
        <div className="w-10 h-0.5 bg-primary mt-3 mb-4" />
        <p className="text-white/50 text-sm tracking-wider">
          {items.length} {t.dashboard.titles} &middot; {counts.completed || 0} {t.statuses.completed.toLowerCase()} &middot; {counts.watching || 0} {t.statuses.watching.toLowerCase()}
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 no-print">
        <input
          type="text"
          placeholder={t.watchlist.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 bg-transparent border-b border-white/10 focus:border-primary px-0 py-2 text-sm tracking-widest placeholder-white/40 focus:outline-none transition-colors"
        />
        <div className="flex flex-wrap gap-px">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-5 py-2 text-[11px] tracking-[0.2em] font-bold transition-all ${
                statusFilter === s
                  ? "bg-primary text-white"
                  : "bg-surface text-white/40 hover:text-white/60"
              }`}
            >
              {s === "all" ? t.watchlist.all : t.statuses[s].toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-px">
          {(["all", "movie", "tv"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTypeFilter(tf)}
              className={`px-5 py-2 text-[11px] tracking-[0.2em] font-bold transition-all ${
                typeFilter === tf
                  ? "bg-white/10 text-white"
                  : "bg-surface text-white/40 hover:text-white/60"
              }`}
            >
              {tf === "all" ? t.watchlist.all : tf === "tv" ? t.watchlist.series : t.watchlist.films}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="font-heading text-6xl text-white/5 mb-4">{t.watchlist.empty}</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 stagger-children">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-surface overflow-hidden"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                {item.posterUrl ? (
                  <>
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  </>
                ) : (
                  <div className="h-full bg-white/5 flex items-center justify-center">
                    <span className="text-white/10 text-5xl font-heading">{item.title[0]}</span>
                  </div>
                )}
                {item.rating !== null && (
                  <div className="absolute top-2 right-2 bg-primary px-2 py-0.5">
                    <span className="text-white text-xs font-bold">{item.rating}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
                  <h3 className="font-heading text-lg text-white leading-none tracking-wide drop-shadow-2xl line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-white/40 tracking-wider uppercase">
                    {item.year} <span className="text-primary">|</span> {item.mediaType === "tv" ? t.common.series : t.common.film}
                  </div>
                  <span className="inline-block px-2 py-0.5 text-[9px] tracking-[0.15em] font-bold border border-white/20 text-white/50 uppercase">
                    {t.statuses[item.status]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-8 border-t border-white/5 no-print">
        <p className="text-white/30 text-xs tracking-wider">
          Shared via <span className="text-primary">WatchTracker</span>
        </p>
      </div>
    </div>
  );
}
