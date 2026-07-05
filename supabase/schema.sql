-- ============================================================
-- CINEMA APP — Full Database Schema & Security Policies
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── 1. TABLES DEFINITION ────────────────────────────────────

-- PROFILES
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  avatar_url  text,
  bio         text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- WATCHLIST
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

-- REVIEWS
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

-- MOVIE LISTS (Custom Collections)
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

-- MOVIE LIST ITEMS
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

-- WATCH HISTORY
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


-- ─── 2. AUTOMATION TRIGGERS (AUTH -> PROFILES) ───────────────

-- Auto-create profile on user signup
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


-- ─── 3. ROW LEVEL SECURITY (RLS) ACTIVATION ──────────────────

alter table public.profiles     enable row level security;
alter table public.watchlist    enable row level security;
alter table public.reviews      enable row level security;
alter table public.movie_lists  enable row level security;
alter table public.list_items   enable row level security;
alter table public.watch_history enable row level security;


-- ─── 4. SECURITY POLICIES (RLS POLICIES) ─────────────────────

-- PROFILES POLICIES
drop policy if exists "Users can view all profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can delete own profile" on public.profiles;

create policy "Users can view all profiles"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- CRIT-03 Fix: Menjamin izin insert yang aman secara eksplisit bagi pengguna bersangkutan
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- CRIT-03 Fix: Mengizinkan kepatuhan penghapusan data secara mandiri oleh pemilik akun
create policy "Users can delete own profile"
  on public.profiles for delete using (auth.uid() = id);


-- WATCHLIST POLICIES
create policy "Users can view own watchlist"
  on public.watchlist for select using (auth.uid() = user_id);

create policy "Users can manage own watchlist"
  on public.watchlist for all using (auth.uid() = user_id);


-- REVIEWS POLICIES
create policy "Anyone can view reviews"
  on public.reviews for select using (true);

create policy "Users can manage own reviews"
  on public.reviews for all using (auth.uid() = user_id);


-- MOVIE LISTS POLICIES
create policy "Anyone can view public lists"
  on public.movie_lists for select
  using (is_public = true or auth.uid() = user_id);

create policy "Users can manage own lists"
  on public.movie_lists for all using (auth.uid() = user_id);


-- LIST ITEMS POLICIES
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


-- WATCH HISTORY POLICIES
create policy "Users can manage own watch history"
  on public.watch_history for all using (auth.uid() = user_id);


-- ─── 5. PERFORMANCE INDEXES ──────────────────────────────────

create index if not exists idx_watchlist_user     on public.watchlist(user_id);
create index if not exists idx_reviews_movie     on public.reviews(movie_id);
create index if not exists idx_reviews_user      on public.reviews(user_id);
create index if not exists idx_list_items_list   on public.list_items(list_id);
create index if not exists idx_watch_history_user on public.watch_history(user_id);

-- ============================================================
-- FASE A: Deep Custom Filtering — Saved Filter Presets
-- ============================================================

create table if not exists public.filter_presets (
  id          bigserial primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  name        text not null,
  params      jsonb not null,
  created_at  timestamptz default now(),
  unique(user_id, name)
);

alter table public.filter_presets enable row level security;

create policy "Users can manage own filter presets"
  on public.filter_presets for all using (auth.uid() = user_id);

create index if not exists idx_filter_presets_user on public.filter_presets(user_id);