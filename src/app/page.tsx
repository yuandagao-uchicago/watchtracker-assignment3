import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WatchStatus, STATUS_LABELS, rowToWatchItem } from "@/types";
import StatusBadge from "@/components/watchlist/StatusBadge";
import { getInitials, getPosterGradient, formatDate } from "@/lib/utils";

export default async function Dashboard() {
  const { userId } = await auth();

  // Signed-out landing
  if (!userId) {
    const features = [
      { icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z", title: "SEARCH TMDB", desc: "Browse thousands of movies and TV shows from The Movie Database." },
      { icon: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z", title: "SAVE TO WATCHLIST", desc: "One click to save. Track what you want to watch, are watching, or have completed." },
      { icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z", title: "RATE & REVIEW", desc: "Score titles 1-10, write reviews, and get recommendations based on your taste." },
    ];

    return (
      <div className="space-y-0">
        {/* Hero */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
            <div className="flex items-center gap-12 lg:gap-16">
              {/* Left — copy */}
              <div className="flex-1 max-w-xl">
                <div className="animate-fade-in text-[11px] tracking-[0.4em] text-primary mb-4">MOVIE &amp; TV TRACKER</div>
                <h1 className="animate-slide-up text-6xl sm:text-7xl lg:text-8xl font-heading leading-[0.85] tracking-wide">
                  TRACK<br />
                  <span className="text-primary">EVERYTHING</span><br />
                  YOU WATCH
                </h1>
                <div className="animate-slide-up delay-200 w-16 h-1 bg-primary mt-6 mb-6" />
                <p className="animate-slide-up delay-300 text-white/50 text-lg max-w-md leading-relaxed">
                  Search real movies &amp; TV shows from TMDB, build your personal watchlist, rate and review what you&apos;ve seen, and discover what to watch next.
                </p>
                <div className="animate-slide-up delay-400 flex flex-wrap gap-4 mt-10">
                  <Link
                    href="/sign-up"
                    className="px-10 py-4 bg-primary hover:bg-primary-hover text-white font-heading text-xl tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                  >
                    GET STARTED FREE
                  </Link>
                  <Link
                    href="/sign-in"
                    className="px-10 py-4 border border-white/20 hover:border-white/50 text-white font-heading text-xl tracking-wider transition-all duration-300 hover:scale-105"
                  >
                    SIGN IN
                  </Link>
                </div>
              </div>

              {/* Right — stacked poster fan */}
              <div className="hidden lg:block flex-1 relative h-[480px]">
                {[
                  { src: "d5NXSklXo0qyIYkgV94XAgMIckC", rotate: "-6deg", left: "0%", top: "10%", z: 1, delay: "200ms", floatDelay: "0s" },
                  { src: "8cdWjvZQUExUUTzyp4t6EDMubfO", rotate: "2deg", left: "25%", top: "0%", z: 2, delay: "350ms", floatDelay: "0.8s" },
                  { src: "vpnVM9B6NMmQpWeZvzLvDESb2QY", rotate: "-3deg", left: "50%", top: "8%", z: 3, delay: "500ms", floatDelay: "1.6s" },
                  { src: "qJ2tW6WMUDux911kpUpMebfRdEo", rotate: "5deg", left: "12%", top: "52%", z: 1, delay: "650ms", floatDelay: "0.4s" },
                  { src: "sv1xJUazXeYqALzczSZ3O6nkH75", rotate: "-2deg", left: "38%", top: "48%", z: 2, delay: "800ms", floatDelay: "1.2s" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="absolute w-[160px] shadow-2xl shadow-black/80 border border-white/10 overflow-hidden transition-transform duration-500 hover:scale-110 hover:z-10 animate-scale-in"
                    style={{
                      "--rotate": p.rotate,
                      left: p.left,
                      top: p.top,
                      zIndex: p.z,
                      animationDelay: p.delay,
                      animation: `scale-in 0.6s ease-out ${p.delay} both, float 5s ease-in-out ${p.floatDelay} infinite`,
                    } as React.CSSProperties}
                  >
                    <div className="aspect-[2/3]">
                      <img
                        src={`https://image.tmdb.org/t/p/w300/${p.src}.jpg`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
                {/* Glow effect behind posters */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 bg-surface border-t border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-heading tracking-wider">HOW IT WORKS</h2>
              <div className="w-10 h-0.5 bg-primary mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
              {features.map((f, i) => (
                <div key={i} className="text-center group hover-lift p-6">
                  <div className="w-14 h-14 mx-auto mb-5 border border-white/10 group-hover:border-primary/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                    <svg className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl tracking-wider mb-3">{f.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats / Social proof strip */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-3 gap-px">
              {[
                { value: "900K+", label: "MOVIES IN TMDB" },
                { value: "160K+", label: "TV SHOWS" },
                { value: "FREE", label: "FOREVER" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center py-6">
                  <div className="text-4xl font-heading text-primary">{value}</div>
                  <div className="text-[10px] tracking-[0.3em] text-white/40 mt-2">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA bottom */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-4xl sm:text-5xl font-heading tracking-wider mb-4">
              READY TO START <span className="text-primary">TRACKING</span>?
            </h2>
            <p className="text-white/40 text-sm tracking-wider mb-8 max-w-md mx-auto">
              Create your free account in seconds. No credit card required.
            </p>
            <Link
              href="/sign-up"
              className="inline-block px-12 py-4 bg-primary hover:bg-primary-hover text-white font-heading text-xl tracking-wider transition-colors"
            >
              CREATE YOUR ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Signed-in dashboard
  const supabase = await createServerSupabaseClient();
  const { data: rows } = await supabase
    .from("watch_items")
    .select("*")
    .order("updated_at", { ascending: false });

  const items = (rows || []).map(rowToWatchItem);

  const counts = items.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {} as Record<WatchStatus, number>
  );

  const recentItems = items.slice(0, 5);

  const rated = items.filter((i) => i.rating !== null);
  const avgRating = rated.length > 0
    ? (rated.reduce((sum, i) => sum + i.rating!, 0) / rated.length).toFixed(1)
    : "—";

  const heroItem = items.find((i) => i.posterUrl && i.status === "watching") || items.find((i) => i.posterUrl);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 overflow-hidden">
        {heroItem?.posterUrl && (
          <div className="absolute inset-0">
            <img src={heroItem.posterUrl} alt="" className="absolute inset-0 w-full h-full object-cover object-top opacity-15 blur-sm scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="max-w-2xl">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading leading-[0.85] tracking-wide">
              YOUR<br />
              <span className="text-primary">WATCHLIST</span>
            </h1>
            <div className="w-16 h-1 bg-primary mt-6 mb-6" />
            <p className="text-white/40 text-lg">
              {items.length} titles &middot; {counts.watching || 0} watching &middot; avg {avgRating} rating
            </p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-px bg-white/5">
        {([
          { label: "WATCHING", value: counts.watching || 0, color: "text-watching" },
          { label: "COMPLETED", value: counts.completed || 0, color: "text-completed" },
          { label: "PLAN TO WATCH", value: counts.plan_to_watch || 0, color: "text-white" },
          { label: "DROPPED", value: counts.dropped || 0, color: "text-dropped" },
        ] as const).map(({ label, value, color }) => (
          <div key={label} className="bg-black p-5 text-center">
            <div className={`text-4xl font-heading ${color}`}>{value}</div>
            <div className="text-[10px] tracking-[0.25em] text-white/40 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/search"
          className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-heading text-lg tracking-wider transition-colors"
        >
          SEARCH TMDB
        </Link>
        <Link
          href="/watchlist/add"
          className="px-8 py-3 border border-white/20 hover:border-white/50 text-white font-heading text-lg tracking-wider transition-colors"
        >
          + ADD MANUAL
        </Link>
        <Link
          href="/watchlist"
          className="px-8 py-3 border border-white/20 hover:border-white/50 text-white font-heading text-lg tracking-wider transition-colors"
        >
          BROWSE ALL
        </Link>
        <Link
          href="/recommend"
          className="px-8 py-3 border border-white/20 hover:border-white/50 text-white font-heading text-lg tracking-wider transition-colors"
        >
          RECOMMENDATIONS
        </Link>
      </div>

      {/* Recently Updated */}
      {recentItems.length > 0 && (
        <div>
          <h2 className="text-3xl font-heading tracking-wider mb-1">RECENTLY UPDATED</h2>
          <div className="w-10 h-0.5 bg-primary mb-8" />
          <div className="space-y-px">
            {recentItems.map((item, i) => (
              <Link
                key={item.id}
                href={`/show/${item.id}`}
                className="flex items-center gap-5 bg-surface hover:bg-surface-light p-4 transition-all duration-300 group border-l-2 border-transparent hover:border-primary"
              >
                <span className="text-white/10 font-heading text-3xl w-8">{String(i + 1).padStart(2, "0")}</span>
                <div className="w-10 h-14 shrink-0 relative overflow-hidden">
                  {item.posterUrl ? (
                    <img src={item.posterUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}>
                      <span className="text-white/20 text-xs font-bold">{getInitials(item.title)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading text-xl tracking-wide group-hover:text-primary transition-colors truncate">{item.title}</div>
                  <div className="text-xs text-white/45 tracking-wider uppercase">
                    {item.year} <span className="text-primary">|</span> {item.mediaType === "tv" ? "Series" : "Film"}
                  </div>
                </div>
                <StatusBadge status={item.status} />
                <div className="text-[11px] text-white/35 hidden sm:block tracking-wider">{formatDate(item.updatedAt)}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
