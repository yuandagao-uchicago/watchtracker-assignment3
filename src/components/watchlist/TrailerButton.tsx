"use client";

import { useState, useEffect } from "react";

interface Video {
  key: string;
  name: string;
  site: string;
  type: string;
}

export default function TrailerButton({ tmdbId, mediaType }: { tmdbId: number; mediaType: "movie" | "tv" }) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tmdb/${mediaType}/${tmdbId}?videos=true`)
      .then((r) => r.json())
      .then((data) => {
        if (data.trailerKey) {
          setTrailerKey(data.trailerKey);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tmdbId, mediaType]);

  if (loading || !trailerKey) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-[11px] tracking-[0.2em] font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        WATCH TRAILER
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-4xl mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white text-sm tracking-wider transition-colors"
            >
              CLOSE &times;
            </button>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
