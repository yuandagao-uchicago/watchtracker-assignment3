"use client";

import { useState, useTransition, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { addComment, deleteComment } from "@/app/actions/comments";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export default function CommentsSection({
  tmdbId,
  mediaType,
  initialComments,
}: {
  tmdbId: number;
  mediaType: "movie" | "tv";
  initialComments: Comment[];
}) {
  const { t } = useLocale();
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const optimistic: Comment = {
      id: crypto.randomUUID(),
      user_id: user?.id || "",
      user_name: user?.firstName || "You",
      content: text.trim(),
      created_at: new Date().toISOString(),
    };

    setComments((prev) => [optimistic, ...prev]);
    const content = text.trim();
    setText("");

    startTransition(async () => {
      await addComment(tmdbId, mediaType, content);
    });
  };

  const handleDelete = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    startTransition(async () => {
      await deleteComment(commentId);
    });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div>
      <h2 className="text-2xl font-heading tracking-wider mb-1">
        {t.show.review === "REVIEW" ? "COMMENTS" : "COMMENTS"}
      </h2>
      <div className="w-8 h-0.5 bg-primary mb-5" />

      {/* Post form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <div className="w-9 h-9 shrink-0 bg-primary/20 flex items-center justify-center text-xs font-heading text-primary">
            {user?.firstName?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts about this title..."
              rows={2}
              className="w-full bg-surface border border-white/5 focus:border-primary/30 px-4 py-3 text-sm text-white/70 placeholder-white/30 focus:outline-none resize-none transition-colors"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!text.trim() || isPending}
                className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-[11px] tracking-[0.2em] font-bold transition-colors disabled:opacity-40"
              >
                {isPending ? "POSTING..." : "POST COMMENT"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-white/30 text-sm tracking-wider italic">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 group">
              <div className="w-9 h-9 shrink-0 bg-white/5 flex items-center justify-center text-xs font-heading text-white/40">
                {c.user_name[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white/70">{c.user_name}</span>
                  <span className="text-[11px] text-white/25 tracking-wider">{formatTime(c.created_at)}</span>
                  {user?.id === c.user_id && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-[10px] text-white/20 hover:text-primary tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      DELETE
                    </button>
                  )}
                </div>
                <p className="text-sm text-white/50 mt-1 leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
