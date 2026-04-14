import { SkeletonHeading, SkeletonLine, SkeletonCardGrid } from "@/components/ui/Skeleton";

export default function WatchlistLoading() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <SkeletonHeading width="w-56" />
          <div className="w-10 h-0.5 bg-primary mt-3" />
        </div>
        <div className="flex gap-3">
          <div className="w-32 h-10 bg-white/5 animate-pulse" />
          <div className="w-32 h-10 bg-white/5 animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        <SkeletonLine width="w-72" />
        <div className="flex gap-px">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-24 h-8 bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
      <SkeletonCardGrid count={10} />
    </div>
  );
}
