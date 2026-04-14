"use client";

import Link from "next/link";
import { WatchItem } from "@/types";
import StatusBadge from "./StatusBadge";
import { getInitials, getPosterGradient } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function WatchCard({ item }: { item: WatchItem }) {
  const { t } = useLocale();
  return (
    <Link
      href={`/show/${item.id}`}
      className="group card-glow block bg-surface overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {item.posterUrl ? (
          <>
            <img
              src={item.posterUrl}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          </>
        ) : (
          <div className={`h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}>
            <span className="text-white/10 text-7xl font-heading">{getInitials(item.title)}</span>
          </div>
        )}

        {/* Rating top-right */}
        {item.rating !== null && (
          <div className="absolute top-2 right-2 bg-primary px-2 py-0.5">
            <span className="text-white text-xs font-bold">{item.rating}</span>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5">
          <h3 className="font-heading text-xl text-white leading-none tracking-wide drop-shadow-2xl line-clamp-2">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-[11px] text-white/40 tracking-wider uppercase">
            <span>{item.year}</span>
            <span className="text-primary">|</span>
            <span>{item.mediaType === "tv" ? t.common.series : t.common.film}</span>
          </div>
          <StatusBadge status={item.status} />
        </div>
      </div>
    </Link>
  );
}
