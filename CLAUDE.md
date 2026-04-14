# WatchTracker (Assignment 3)

A full-stack personal watchlist app for movies and TV shows. Users sign up, search real titles via TMDB, and save them to a per-user watchlist persisted in Supabase.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (dark cinematic theme — Bebas Neue + Inter, red accents)
- **Auth**: Clerk (sign up / sign in / sign out + `<UserButton />`)
- **Database**: Supabase Postgres with Row Level Security
- **External API**: TMDB (The Movie Database) — server-side via `/api/tmdb/*`
- **Auth ↔ DB bridge**: Clerk ↔ Supabase Third-Party Auth (Clerk session JWT, `sub` claim is the user id used in RLS)
- **Mutations**: Server Actions
- **Reads**: Server Components

## Pages / Routes

| Route | Auth | Description |
|---|---|---|
| `/` | public | Landing for signed-out users; dashboard for signed-in users |
| `/sign-in/[[...sign-in]]` | public | Clerk-hosted sign in |
| `/sign-up/[[...sign-up]]` | public | Clerk-hosted sign up |
| `/search` | protected | TMDB search; click a result to save it |
| `/watchlist` | protected | Full watchlist with filters (status, type, title search) |
| `/watchlist/add` | protected | Manual add form (still available alongside TMDB search) |
| `/show/[id]` | protected | Detail page — view/edit rating, review, status; delete |
| `/recommend` | protected | Recommendations from your ratings + genre preferences |
| `/stats` | protected | Genre breakdown, rating distribution, status counts |
| `/api/tmdb/search` | public | Server route — proxies TMDB search/multi (key never leaves server) |
| `/api/tmdb/[type]/[id]` | public | Server route — proxies TMDB details |

## Data Model

```typescript
type MediaType = "movie" | "tv"
type WatchStatus = "plan_to_watch" | "watching" | "completed" | "dropped"

interface WatchItem {
  id: string                 // uuid (Supabase)
  userId: string             // Clerk user id (JWT sub) — used by RLS
  title: string
  mediaType: MediaType
  genre: string[]
  year: number
  posterUrl: string
  synopsis: string
  status: WatchStatus
  rating: number | null      // 1-10
  review: string | null
  tmdbId: number | null      // null for manually-added items
  addedAt: string            // ISO timestamp
  updatedAt: string          // ISO timestamp
}
```

### Supabase table

```sql
create table watch_items (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,
  title        text not null,
  media_type   text not null check (media_type in ('movie','tv')),
  genre        text[] not null default '{}',
  year         integer not null,
  poster_url   text not null default '',
  synopsis     text not null default '',
  status       text not null check (status in ('plan_to_watch','watching','completed','dropped')),
  rating       integer check (rating between 1 and 10),
  review       text,
  tmdb_id      integer,
  added_at     timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table watch_items enable row level security;
-- RLS: auth.jwt() ->> 'sub' = user_id (Clerk user id) on all CRUD
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
TMDB_API_KEY=
```

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project Structure

```
src/
  app/
    actions/         — Server actions (mutations)
    api/tmdb/        — Server routes that proxy TMDB
    sign-in/         — Clerk sign-in catch-all route
    sign-up/         — Clerk sign-up catch-all route
    search/          — TMDB search page
    watchlist/       — Watchlist + add
    show/[id]/       — Detail page
    recommend/       — Recommendations
    stats/           — Stats
  components/        — UI components (layout, watchlist, search)
  lib/
    supabase/        — Server + browser clients (Clerk-token aware)
    tmdb.ts          — TMDB client + types + genre map
    recommend.ts     — Recommendation algorithm
    utils.ts         — Helpers
  types/             — Shared TS types
middleware.ts        — Clerk middleware (route protection)
```
