"use client";

import { useEffect, useState } from "react";

interface Provider {
  name: string;
  logo: string;
  id: number;
}

interface ProvidersData {
  link: string | null;
  flatrate: Provider[];
  rent: Provider[];
  buy: Provider[];
}

export default function WatchProviders({ tmdbId, mediaType }: { tmdbId: number; mediaType: "movie" | "tv" }) {
  const [data, setData] = useState<ProvidersData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tmdb/${mediaType}/${tmdbId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [tmdbId, mediaType]);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-heading tracking-wider mb-1">WHERE TO WATCH</h2>
        <div className="w-8 h-0.5 bg-primary mb-5" />
        <p className="text-white/30 text-sm tracking-wider animate-pulse">Loading providers...</p>
      </div>
    );
  }

  if (!data || (data.flatrate.length === 0 && data.rent.length === 0 && data.buy.length === 0)) {
    return null; // No providers found, hide the section entirely
  }

  return (
    <div>
      <h2 className="text-2xl font-heading tracking-wider mb-1">WHERE TO WATCH</h2>
      <div className="w-8 h-0.5 bg-primary mb-5" />

      {/* Streaming */}
      {data.flatrate.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] tracking-[0.3em] text-white/50 mb-3">STREAM</p>
          <div className="flex flex-wrap gap-3">
            {data.flatrate.map((p) => (
              <a
                key={p.id}
                href={data.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 bg-surface border border-white/5 hover:border-primary/30 px-3 py-2 transition-all duration-300"
                title={p.name}
              >
                <img src={p.logo} alt={p.name} className="w-8 h-8 rounded object-cover" />
                <span className="text-xs text-white/60 group-hover:text-white tracking-wider">{p.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Rent */}
      {data.rent.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] tracking-[0.3em] text-white/50 mb-3">RENT</p>
          <div className="flex flex-wrap gap-3">
            {data.rent.map((p) => (
              <a
                key={p.id}
                href={data.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 bg-surface border border-white/5 hover:border-white/20 px-3 py-2 transition-all duration-300"
                title={p.name}
              >
                <img src={p.logo} alt={p.name} className="w-8 h-8 rounded object-cover" />
                <span className="text-xs text-white/60 group-hover:text-white tracking-wider">{p.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Buy */}
      {data.buy.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] tracking-[0.3em] text-white/50 mb-3">BUY</p>
          <div className="flex flex-wrap gap-3">
            {data.buy.map((p) => (
              <a
                key={p.id}
                href={data.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 bg-surface border border-white/5 hover:border-white/20 px-3 py-2 transition-all duration-300"
                title={p.name}
              >
                <img src={p.logo} alt={p.name} className="w-8 h-8 rounded object-cover" />
                <span className="text-xs text-white/60 group-hover:text-white tracking-wider">{p.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {data.link && (
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[11px] tracking-[0.2em] text-primary hover:text-primary-hover transition-colors"
        >
          VIEW ALL OPTIONS &rarr;
        </a>
      )}
    </div>
  );
}
