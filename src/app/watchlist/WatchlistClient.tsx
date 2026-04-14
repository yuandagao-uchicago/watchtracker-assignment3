"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { WatchItem, WatchStatus, MediaType } from "@/types";
import WatchCard from "@/components/watchlist/WatchCard";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { generateShareLink, revokeShareLink } from "@/app/actions/share";

const statusFilters: ("all" | WatchStatus)[] = [
  "all", "watching", "completed", "plan_to_watch", "dropped",
];

export default function WatchlistClient({ items }: { items: WatchItem[] }) {
  const { t } = useLocale();
  const [statusFilter, setStatusFilter] = useState<"all" | WatchStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | MediaType>("all");
  const [search, setSearch] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = items.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (typeFilter !== "all" && item.mediaType !== typeFilter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleGenerateLink = () => {
    startTransition(async () => {
      const token = await generateShareLink();
      setShareToken(token);
    });
  };

  const handleRevoke = () => {
    startTransition(async () => {
      await revokeShareLink();
      setShareToken(null);
      setShareOpen(false);
    });
  };

  const handleCopy = () => {
    if (!shareToken) return;
    const url = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-5xl font-heading tracking-wider">{t.watchlist.title}</h1>
          <div className="w-10 h-0.5 bg-primary mt-3" />
        </div>
        <div className="flex flex-wrap gap-3 no-print">
          <Link
            href="/search"
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-heading text-base tracking-wider transition-colors"
          >
            {t.watchlist.searchTmdbBtn}
          </Link>
          <Link
            href="/watchlist/add"
            className="px-6 py-2.5 border border-white/20 hover:border-white/50 text-white font-heading text-base tracking-wider transition-colors"
          >
            {t.watchlist.addManualBtn}
          </Link>

          {/* Share button */}
          <div className="relative">
            <button
              onClick={() => { setShareOpen(!shareOpen); if (!shareToken && !shareOpen) handleGenerateLink(); }}
              className="px-5 py-2.5 border border-white/20 hover:border-primary/50 text-white/70 hover:text-white font-heading text-base tracking-wider transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              SHARE
            </button>

            {shareOpen && (
              <div className="absolute right-0 top-full mt-2 bg-surface border border-white/10 shadow-xl shadow-black/50 z-50 p-5 min-w-[320px] animate-scale-in">
                {isPending ? (
                  <p className="text-white/40 text-sm tracking-wider">Generating link...</p>
                ) : shareToken ? (
                  <div className="space-y-4">
                    <p className="text-white/60 text-xs tracking-wider">Anyone with this link can view your watchlist:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${typeof window !== "undefined" ? window.location.origin : ""}/share/${shareToken}`}
                        className="flex-1 bg-black/50 border border-white/10 px-3 py-2 text-xs text-white/70 truncate"
                      />
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold tracking-wider hover:bg-primary-hover transition-colors"
                      >
                        {copied ? "COPIED!" : "COPY"}
                      </button>
                    </div>
                    <button
                      onClick={handleRevoke}
                      className="text-[10px] tracking-[0.2em] text-white/30 hover:text-primary transition-colors"
                    >
                      REVOKE LINK
                    </button>
                  </div>
                ) : (
                  <button onClick={handleGenerateLink} className="text-sm text-primary tracking-wider">
                    GENERATE LINK
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Export PDF button */}
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 border border-white/20 hover:border-primary/50 text-white/70 hover:text-white font-heading text-base tracking-wider transition-colors flex items-center gap-2 no-print"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            PDF
          </button>
        </div>
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

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="font-heading text-6xl text-white/5 mb-4">{t.watchlist.empty}</div>
          <p className="text-white/40 text-sm tracking-wider">
            {t.watchlist.noTitles}{" "}
            <Link href="/search" className="text-primary hover:underline">{t.watchlist.searchTmdb}</Link>
            {" "}{t.watchlist.or}{" "}
            <Link href="/watchlist/add" className="text-primary hover:underline">{t.watchlist.addManually}</Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 stagger-children">
          {filtered.map((item) => (
            <WatchCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
