"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function AddPage() {
  const { t } = useLocale();
  return (
    <div className="page-enter max-w-3xl mx-auto">
      <h1 className="text-5xl font-heading tracking-wider">{t.add.title}</h1>
      <div className="w-12 h-0.5 bg-primary mt-3 mb-4" />
      <p className="text-white/50 text-sm tracking-wider mb-12">
        {t.add.subtitle}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* TMDB Search */}
        <Link
          href="/search"
          className="group relative bg-surface border border-white/5 p-8 hover-lift transition-all duration-300 hover:border-primary/30"
        >
          <div className="w-14 h-14 mb-6 border border-white/10 group-hover:border-primary/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl tracking-wider mb-2 group-hover:text-primary transition-colors">{t.add.searchTmdb}</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            {t.add.searchTmdbDesc}
          </p>
          <div className="mt-6 text-[11px] tracking-[0.2em] text-primary font-bold">
            {t.add.recommended} &rarr;
          </div>
        </Link>

        {/* Manual Add */}
        <Link
          href="/watchlist/add"
          className="group relative bg-surface border border-white/5 p-8 hover-lift transition-all duration-300 hover:border-white/20"
        >
          <div className="w-14 h-14 mb-6 border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl tracking-wider mb-2 group-hover:text-white transition-colors">{t.add.manualEntry}</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            {t.add.manualDesc}
          </p>
          <div className="mt-6 text-[11px] tracking-[0.2em] text-white/40 font-bold">
            {t.add.customEntry} &rarr;
          </div>
        </Link>
      </div>
    </div>
  );
}
