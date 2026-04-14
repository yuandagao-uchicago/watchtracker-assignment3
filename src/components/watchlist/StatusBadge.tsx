"use client";

import { WatchStatus } from "@/types";
import { useLocale } from "@/lib/i18n/LocaleContext";

const badgeStyles: Record<WatchStatus, string> = {
  watching: "text-watching border-watching/40",
  completed: "text-completed border-completed/40",
  plan_to_watch: "text-plan/70 border-plan/20",
  dropped: "text-dropped border-dropped/40",
};

export default function StatusBadge({ status }: { status: WatchStatus }) {
  const { t } = useLocale();
  return (
    <span
      className={`inline-block px-2 py-0.5 border text-[10px] font-bold tracking-[0.2em] uppercase ${badgeStyles[status]}`}
    >
      {t.statuses[status]}
    </span>
  );
}
