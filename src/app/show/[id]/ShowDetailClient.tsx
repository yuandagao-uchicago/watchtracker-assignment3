"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { WatchItem, WatchStatus } from "@/types";
import { updateStatus, setRating, setReview, deleteItem } from "@/app/actions/watchlist";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useToast } from "@/lib/ToastContext";

export default function ShowDetailClient({ item }: { item: WatchItem }) {
  const { t } = useLocale();
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [reviewText, setReviewText] = useState(item.review || "");
  const [isEditingReview, setIsEditingReview] = useState(false);

  const handleStatusChange = (status: WatchStatus) => {
    startTransition(async () => {
      await updateStatus(item.id, status);
      toast(`Status updated to ${t.statuses[status]}`);
      router.refresh();
    });
  };

  const handleRating = (rating: number) => {
    startTransition(async () => {
      await setRating(item.id, rating);
      toast(`Rated ${rating}/10`);
      router.refresh();
    });
  };

  const handleSaveReview = () => {
    startTransition(async () => {
      await setReview(item.id, reviewText);
      setIsEditingReview(false);
      toast("Review saved!");
      router.refresh();
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteItem(item.id);
      toast("Removed from watchlist", "info");
      router.push("/watchlist");
    });
  };

  return (
    <div className={`max-w-3xl mx-auto space-y-10 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      {/* Status */}
      <div>
        <h2 className="text-2xl font-heading tracking-wider mb-1">{t.show.status}</h2>
        <div className="w-8 h-0.5 bg-primary mb-5" />
        <div className="flex flex-wrap gap-px">
          {(Object.keys(t.statuses) as WatchStatus[]).map((value) => (
            <button
              key={value}
              onClick={() => handleStatusChange(value)}
              className={`px-5 py-2.5 text-[11px] tracking-[0.2em] font-bold transition-all ${
                item.status === value ? "bg-primary text-white" : "bg-surface text-white/40 hover:text-white/60"
              }`}
            >
              {t.statuses[value].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h2 className="text-2xl font-heading tracking-wider mb-1">{t.show.rating}</h2>
        <div className="w-8 h-0.5 bg-primary mb-5" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => handleRating(n)}
              className={`w-12 h-12 text-sm font-heading text-lg tracking-wide transition-all duration-200 ${
                item.rating !== null && n <= item.rating
                  ? "bg-primary text-white"
                  : "bg-surface text-white/30 hover:bg-surface-light hover:text-white/50"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {item.rating !== null && (
          <p className="text-white/40 text-sm mt-3 tracking-wider">
            {t.show.yourRating}: <span className="text-accent font-bold">{item.rating}/10</span>
          </p>
        )}
      </div>

      {/* Review */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-heading tracking-wider">{t.show.review}</h2>
          {!isEditingReview && (
            <button onClick={() => setIsEditingReview(true)} className="text-xs text-primary tracking-wider hover:text-primary-hover transition-colors">
              {item.review ? t.show.edit : t.show.writeReview}
            </button>
          )}
        </div>
        <div className="w-8 h-0.5 bg-primary mb-5" />
        {isEditingReview ? (
          <div className="space-y-4">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={t.show.placeholder}
              rows={5}
              className="w-full bg-surface border border-white/5 px-4 py-3 focus:outline-none focus:border-primary/30 resize-none text-white/70 placeholder-white/35"
            />
            <div className="flex gap-2">
              <button onClick={handleSaveReview} className="px-6 py-2 bg-primary text-white font-heading tracking-wider text-sm">{t.show.save}</button>
              <button
                onClick={() => { setReviewText(item.review || ""); setIsEditingReview(false); }}
                className="px-6 py-2 bg-surface text-white/30 hover:text-white/50 font-heading tracking-wider text-sm transition-colors"
              >{t.show.cancel}</button>
            </div>
          </div>
        ) : item.review ? (
          <blockquote className="text-white/40 leading-relaxed border-l-2 border-primary pl-5 italic">
            &ldquo;{item.review}&rdquo;
          </blockquote>
        ) : (
          <p className="text-white/40 italic tracking-wider text-sm">{t.show.noReview}</p>
        )}
      </div>

      {/* Delete */}
      <button onClick={handleDelete} className="text-xs text-white/30 hover:text-primary tracking-[0.2em] transition-colors">
        {t.show.remove}
      </button>
    </div>
  );
}
