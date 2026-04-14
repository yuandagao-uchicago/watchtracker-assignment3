import { SkeletonHeading, SkeletonLine } from "@/components/ui/Skeleton";

export default function StatsLoading() {
  return (
    <div className="space-y-12">
      <div>
        <SkeletonHeading width="w-48" />
        <div className="w-12 h-0.5 bg-primary mt-3" />
      </div>
      <div className="grid grid-cols-4 gap-px bg-white/5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-black p-6 text-center animate-pulse">
            <div className="h-8 bg-white/5 rounded w-12 mx-auto" />
            <div className="h-3 bg-white/5 rounded w-20 mx-auto mt-3" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-32 h-4 bg-white/5 rounded" />
            <div className="flex-1 h-5 bg-white/5" />
            <div className="w-8 h-4 bg-white/5 rounded" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonLine key={i} width={`w-${Math.max(24, 96 - i * 12)}`} />
        ))}
      </div>
    </div>
  );
}
