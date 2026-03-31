-- ============================================================
-- CINEMA APP — Full Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── PROFILES ────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  avatar_url  text,
  bio         text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── WATCHLIST ────────────────────────────────────────────────
create table if not exists public.watchlist (
  id          bigserial primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  movie_id    integer not null,
  movie_title text not null,
  poster_url  text,
  rating      text,
  year        text,
  genre       text,
  added_at    timestamptz default now(),
  unique(user_id, movie_id)
);

-- ─── REVIEWS ──────────────────────────────────────────────────
create table if not exists public.reviews (
  id          bigserial primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  movie_id    integer not null,
  movie_title text not null,
  poster_url  text,
  rating      numeric(3,1) check (rating >= 1 and rating <= 10) not null,
  content     text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(user_id, movie_id)
);

-- ─── MOVIE LISTS ──────────────────────────────────────────────
create table if not exists public.movie_lists (
  id          bigserial primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  name        text not null,
  description text,
  is_public   boolean default false,
  cover_url   text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.list_items (
  id          bigserial primary key,
  list_id     bigint references public.movie_lists(id) on delete cascade not null,
  movie_id    integer not null,
  movie_title text not null,
  poster_url  text,
  year        text,
  added_at    timestamptz default now(),
  unique(list_id, movie_id)
);

-- ─── WATCH HISTORY ────────────────────────────────────────────
create table if not exists public.watch_history (
  id          bigserial primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  movie_id    integer not null,
  movie_title text not null,
  poster_url  text,
  genre       text,
  watched_at  timestamptz default now(),
  unique(user_id, movie_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles      enable row level security;
alter table public.watchlist     enable row level security;
alter table public.reviews       enable row level security;
alter table public.movie_lists   enable row level security;
alter table public.list_items    enable row level security;
alter table public.watch_history enable row level security;

-- PROFILES
create policy "Users can view all profiles"
  on public.profiles for select using (true);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- WATCHLIST
create policy "Users can view own watchlist"
  on public.watchlist for select using (auth.uid() = user_id);
create policy "Users can manage own watchlist"
  on public.watchlist for all using (auth.uid() = user_id);

-- REVIEWS
create policy "Anyone can view reviews"
  on public.reviews for select using (true);
create policy "Users can manage own reviews"
  on public.reviews for all using (auth.uid() = user_id);

-- MOVIE LISTS
create policy "Anyone can view public lists"
  on public.movie_lists for select
  using (is_public = true or auth.uid() = user_id);
create policy "Users can manage own lists"
  on public.movie_lists for all using (auth.uid() = user_id);

-- LIST ITEMS
create policy "Anyone can view items of public lists"
  on public.list_items for select
  using (
    exists (
      select 1 from public.movie_lists ml
      where ml.id = list_id
      and (ml.is_public = true or ml.user_id = auth.uid())
    )
  );
create policy "Users can manage items in own lists"
  on public.list_items for all
  using (
    exists (
      select 1 from public.movie_lists ml
      where ml.id = list_id and ml.user_id = auth.uid()
    )
  );

-- WATCH HISTORY
create policy "Users can manage own watch history"
  on public.watch_history for all using (auth.uid() = user_id);

-- ============================================================
-- INDEXES for performance
-- ============================================================
create index if not exists idx_watchlist_user    on public.watchlist(user_id);
create index if not exists idx_reviews_movie     on public.reviews(movie_id);
create index if not exists idx_reviews_user      on public.reviews(user_id);
create index if not exists idx_list_items_list   on public.list_items(list_id);
create index if not exists idx_watch_history_user on public.watch_history(user_id);
