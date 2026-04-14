export default function ShowLoading() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Hero skeleton */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="h-4 bg-white/5 rounded w-20 mb-8" />
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="w-full sm:w-56 shrink-0">
              <div className="aspect-[2/3] bg-white/5" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="h-3 bg-white/5 rounded w-32" />
              <div className="h-12 bg-white/5 rounded w-80" />
              <div className="w-12 h-0.5 bg-primary" />
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-6 bg-white/5 rounded w-16" />
                ))}
              </div>
              <div className="h-5 bg-white/5 rounded w-28" />
              <div className="h-3 bg-white/5 rounded w-48" />
              <div className="space-y-2 mt-6">
                <div className="h-3 bg-white/5 rounded w-full max-w-xl" />
                <div className="h-3 bg-white/5 rounded w-4/5 max-w-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls skeleton */}
      <div className="max-w-3xl mx-auto space-y-10">
        <div>
          <div className="h-6 bg-white/5 rounded w-24 mb-5" />
          <div className="flex gap-px">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-28 h-10 bg-white/5" />
            ))}
          </div>
        </div>
        <div>
          <div className="h-6 bg-white/5 rounded w-20 mb-5" />
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
