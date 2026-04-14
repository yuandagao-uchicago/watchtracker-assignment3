"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GENRES, MediaType, WatchStatus } from "@/types";
import { createItem } from "@/app/actions/watchlist";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function AddItemPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [year, setYear] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [synopsis, setSynopsis] = useState("");
  const [status, setStatus] = useState<WatchStatus>("plan_to_watch");
  const [rating, setRating] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = t.addForm.errTitle;
    if (!year.trim()) errs.year = t.addForm.errYear;
    else if (parseInt(year) < 1900 || parseInt(year) > 2030) errs.year = t.addForm.errYearRange;
    if (selectedGenres.length === 0) errs.genres = t.addForm.errGenres;
    if (rating && (parseInt(rating) < 1 || parseInt(rating) > 10)) errs.rating = t.addForm.errRating;
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      await createItem({
        title: title.trim(),
        mediaType,
        genre: selectedGenres,
        year: parseInt(year),
        posterUrl: posterUrl.trim(),
        synopsis: synopsis.trim(),
        status,
        rating: rating ? parseInt(rating) : null,
      });
      router.push("/watchlist");
    } catch {
      setErrors({ submit: t.addForm.errSubmit });
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-white/10 focus:border-primary px-0 py-3 focus:outline-none transition-colors placeholder-white/35";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-5xl font-heading tracking-wider">{t.addForm.title}</h1>
      <div className="w-12 h-0.5 bg-primary mt-3 mb-10" />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-[10px] tracking-[0.3em] text-white/50 mb-2">{t.addForm.labelTitle} *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.addForm.phTitle} className={inputClass} />
          {errors.title && <p className="text-primary text-xs mt-2 tracking-wider">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.3em] text-white/50 mb-2">{t.addForm.labelPoster}</label>
          <input type="url" value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} placeholder={t.addForm.phPoster} className={inputClass} />
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.3em] text-white/50 mb-3">{t.addForm.labelType}</label>
          <div className="flex gap-px">
            {(["movie", "tv"] as const).map((mt) => (
              <button key={mt} type="button" onClick={() => setMediaType(mt)}
                className={`px-6 py-2.5 font-heading tracking-wider transition-all ${mediaType === mt ? "bg-primary text-white" : "bg-surface text-white/40 hover:text-white/60"}`}>
                {mt === "movie" ? t.addForm.film : t.addForm.series}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.3em] text-white/50 mb-2">{t.addForm.labelYear} *</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder={t.addForm.phYear} min="1900" max="2030" className={`${inputClass} sm:w-40`} />
          {errors.year && <p className="text-primary text-xs mt-2 tracking-wider">{errors.year}</p>}
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.3em] text-white/50 mb-3">{t.addForm.labelGenres} *</label>
          <div className="flex flex-wrap gap-px">
            {GENRES.map((genre) => (
              <button key={genre} type="button" onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 text-xs tracking-wider transition-all ${selectedGenres.includes(genre) ? "bg-primary text-white" : "bg-surface text-white/40 hover:text-white/60"}`}>
                {genre.toUpperCase()}
              </button>
            ))}
          </div>
          {errors.genres && <p className="text-primary text-xs mt-2 tracking-wider">{errors.genres}</p>}
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.3em] text-white/50 mb-2">{t.addForm.labelSynopsis}</label>
          <textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} placeholder={t.addForm.phSynopsis} rows={3}
            className={`${inputClass} border border-white/5 px-4 resize-none`} />
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.3em] text-white/50 mb-2">{t.addForm.labelStatus}</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as WatchStatus)}
            className="bg-surface border border-white/5 px-4 py-3 text-white/60 focus:outline-none focus:border-primary/30 sm:w-60">
            {(Object.keys(t.statuses) as WatchStatus[]).map((value) => (
              <option key={value} value={value}>{t.statuses[value]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.3em] text-white/50 mb-2">{t.addForm.labelRating}</label>
          <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="—" min="1" max="10" className={`${inputClass} sm:w-32`} />
          {errors.rating && <p className="text-primary text-xs mt-2 tracking-wider">{errors.rating}</p>}
        </div>

        {errors.submit && <p className="text-primary text-sm tracking-wider">{errors.submit}</p>}

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-heading text-lg tracking-wider transition-colors disabled:opacity-50">
            {saving ? t.addForm.saving : t.addForm.submit}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-8 py-3 border border-white/10 hover:border-white/30 text-white/50 font-heading text-lg tracking-wider transition-colors">
            {t.addForm.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
