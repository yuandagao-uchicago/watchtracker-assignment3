# WatchTracker — Assignment 3

A full-stack movie & TV watchlist app. Sign up, search TMDB for real titles, save them to your personal watchlist, and rate/review what you've watched.

Built for **Design, Build, Ship · MPCS 51238 · Spring 2026 — Assignment 3**.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind v4**
- **Clerk** — auth (sign up / sign in / sign out)
- **Supabase** — Postgres storage with Row Level Security, scoped per Clerk user
- **TMDB** — external API for movie/TV metadata

## Live Demo

> Vercel URL: _coming soon — will be added after deploy_

## Local Setup

1. Install:
   ```bash
   npm install
   ```
2. Copy env file and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
   You'll need:
   - A **Clerk** app → publishable + secret key
   - A **Supabase** project → URL + anon key
   - A **TMDB** API key (free: https://www.themoviedb.org/settings/api)
3. Configure Supabase MCP (one-time):
   ```bash
   claude mcp add --transport http supabase https://mcp.supabase.com/mcp
   ```
4. Connect Clerk and Supabase via Clerk dashboard ("Connect with Supabase") + Supabase Auth → Third-Party Auth → Add Clerk.
5. Run dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

See `CLAUDE.md` for the data model, route table, and project structure.
