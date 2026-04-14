"use client";

export function SkeletonCard() {
  return (
    <div className="bg-surface overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-white/5" />
    </div>
  );
}

export function SkeletonLine({ width = "w-full" }: { width?: string }) {
  return <div className={`h-4 bg-white/5 rounded animate-pulse ${width}`} />;
}

export function SkeletonHeading({ width = "w-64" }: { width?: string }) {
  return <div className={`h-10 bg-white/5 rounded animate-pulse ${width}`} />;
}

export function SkeletonCardGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonListRow() {
  return (
    <div className="flex items-center gap-5 bg-surface p-4 animate-pulse">
      <div className="w-8 h-6 bg-white/5 rounded" />
      <div className="w-10 h-14 bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-white/5 rounded w-48" />
        <div className="h-3 bg-white/5 rounded w-32" />
      </div>
      <div className="h-5 bg-white/5 rounded w-20" />
    </div>
  );
}
