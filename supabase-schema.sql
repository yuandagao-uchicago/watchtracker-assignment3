-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/jeszgtujpvxvrtketvjf/sql)

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

-- Indexes
create index watch_items_user_id_idx on watch_items (user_id);
create unique index watch_items_user_tmdb_idx
  on watch_items (user_id, media_type, tmdb_id) where tmdb_id is not null;

-- Row Level Security
alter table watch_items enable row level security;

create policy "Users can read own items"
  on watch_items for select
  using (auth.jwt() ->> 'sub' = user_id);

create policy "Users can insert own items"
  on watch_items for insert
  with check (auth.jwt() ->> 'sub' = user_id);

create policy "Users can update own items"
  on watch_items for update
  using (auth.jwt() ->> 'sub' = user_id);

create policy "Users can delete own items"
  on watch_items for delete
  using (auth.jwt() ->> 'sub' = user_id);
