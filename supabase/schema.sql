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

-- ============================================================
-- FASE C: Gamified Review System
-- ============================================================

-- ─── Kolom tambahan untuk tracking gamifikasi ────────────────

alter table public.reviews
  add column if not exists genre_ids integer[];

alter table public.profiles
  add column if not exists review_count     integer not null default 0,
  add column if not exists current_streak   integer not null default 0,
  add column if not exists longest_streak   integer not null default 0,
  add column if not exists last_review_date date,
  add column if not exists critic_rank      text not null default 'Casual Viewer';

-- ─── Definisi Badge (data referensi statis) ──────────────────

create table if not exists public.badges (
  id          text primary key,
  name        text not null,
  description text not null,
  icon        text not null,
  sort_order  integer not null default 0
);

insert into public.badges (id, name, description, icon, sort_order) values
  ('first_take',     'First Take',      'Wrote your very first review',                '🎬', 1),
  ('genre_explorer',  'Genre Explorer',   'Reviewed movies across 5 different genres',   '🧭', 2),
  ('streak_7',        'On a Roll',        'Reviewed movies 7 days in a row',              '🔥', 3),
  ('prolific_critic', 'Prolific Critic',  'Wrote 25 reviews',                             '✍️', 4)
on conflict (id) do nothing;

-- ─── Badge yang sudah didapat user ───────────────────────────

create table if not exists public.user_badges (
  id         bigserial primary key,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  badge_id   text references public.badges(id) on delete cascade not null,
  earned_at  timestamptz default now(),
  unique(user_id, badge_id)
);

-- ─── Voting "Helpful" untuk review ────────────────────────────

create table if not exists public.review_votes (
  id         bigserial primary key,
  review_id  bigint references public.reviews(id) on delete cascade not null,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(review_id, user_id)
);

-- ─── Fungsi hitung Critic Rank berdasarkan jumlah review ─────

create or replace function public.compute_critic_rank(p_review_count integer)
returns text
language sql
immutable
as $$
  select case
    when p_review_count >= 50 then 'Master Critic'
    when p_review_count >= 25 then 'Senior Critic'
    when p_review_count >= 10 then 'Critic'
    when p_review_count >= 3  then 'Film Enthusiast'
    else 'Casual Viewer'
  end;
$$;

-- ─── Trigger: update stats + award badge saat review dibuat ──

create or replace function public.handle_review_insert()
returns trigger as $$
declare
  v_review_count   integer;
  v_current_streak integer;
  v_longest_streak integer;
  v_last_date      date;
  v_today          date := current_date;
  v_distinct_genres integer;
begin
  select review_count, current_streak, longest_streak, last_review_date
    into v_review_count, v_current_streak, v_longest_streak, v_last_date
    from public.profiles where id = new.user_id;

  v_review_count := coalesce(v_review_count, 0) + 1;

  if v_last_date is null then
    v_current_streak := 1;
  elsif v_last_date = v_today then
    v_current_streak := coalesce(v_current_streak, 1);
  elsif v_last_date = v_today - interval '1 day' then
    v_current_streak := coalesce(v_current_streak, 0) + 1;
  else
    v_current_streak := 1;
  end if;

  v_longest_streak := greatest(coalesce(v_longest_streak, 0), v_current_streak);

  update public.profiles
    set review_count     = v_review_count,
        current_streak   = v_current_streak,
        longest_streak   = v_longest_streak,
        last_review_date = v_today,
        critic_rank      = public.compute_critic_rank(v_review_count)
    where id = new.user_id;

  -- Badge: First Take
  if v_review_count = 1 then
    insert into public.user_badges (user_id, badge_id)
    values (new.user_id, 'first_take') on conflict do nothing;
  end if;

  -- Badge: Prolific Critic
  if v_review_count >= 25 then
    insert into public.user_badges (user_id, badge_id)
    values (new.user_id, 'prolific_critic') on conflict do nothing;
  end if;

  -- Badge: On a Roll (streak 7 hari)
  if v_current_streak >= 7 then
    insert into public.user_badges (user_id, badge_id)
    values (new.user_id, 'streak_7') on conflict do nothing;
  end if;

  -- Badge: Genre Explorer (5+ genre berbeda)
  select count(distinct g) into v_distinct_genres
    from public.reviews r, unnest(r.genre_ids) as g
    where r.user_id = new.user_id;

  if v_distinct_genres >= 5 then
    insert into public.user_badges (user_id, badge_id)
    values (new.user_id, 'genre_explorer') on conflict do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_review_created on public.reviews;
create trigger on_review_created
  after insert on public.reviews
  for each row execute procedure public.handle_review_insert();

-- ─── Trigger: sesuaikan stats saat review dihapus ────────────

create or replace function public.handle_review_delete()
returns trigger as $$
declare
  v_review_count integer;
begin
  select greatest(coalesce(review_count, 0) - 1, 0) into v_review_count
    from public.profiles where id = old.user_id;

  update public.profiles
    set review_count = v_review_count,
        critic_rank  = public.compute_critic_rank(v_review_count)
    where id = old.user_id;

  return old;
end;
$$ language plpgsql security definer;

drop trigger if exists on_review_deleted on public.reviews;
create trigger on_review_deleted
  after delete on public.reviews
  for each row execute procedure public.handle_review_delete();

-- ─── Fungsi Leaderboard (join profiles + badge count) ────────

create or replace function public.get_leaderboard(limit_count integer default 50)
returns table (
  id              uuid,
  full_name       text,
  avatar_url      text,
  review_count    integer,
  critic_rank     text,
  longest_streak  integer,
  badge_count     bigint
)
language sql
stable
as $$
  select
    p.id, p.full_name, p.avatar_url, p.review_count,
    p.critic_rank, p.longest_streak,
    count(ub.id) as badge_count
  from public.profiles p
  left join public.user_badges ub on ub.user_id = p.id
  where p.review_count > 0
  group by p.id
  order by p.review_count desc, p.longest_streak desc
  limit limit_count;
$$;

-- ─── RLS ──────────────────────────────────────────────────────

alter table public.badges       enable row level security;
alter table public.user_badges  enable row level security;
alter table public.review_votes enable row level security;

create policy "Anyone can view badges"
  on public.badges for select using (true);

create policy "Anyone can view earned badges"
  on public.user_badges for select using (true);

-- Badge cuma boleh ditulis lewat trigger (security definer), blokir tulis langsung dari client
create policy "Block direct badge writes"
  on public.user_badges for insert with check (false);

create policy "Anyone can view helpful votes"
  on public.review_votes for select using (true);

create policy "Users can vote on others reviews"
  on public.review_votes for insert
  with check (
    auth.uid() = user_id
    and not exists (
      select 1 from public.reviews r where r.id = review_id and r.user_id = auth.uid()
    )
  );

create policy "Users can remove own vote"
  on public.review_votes for delete using (auth.uid() = user_id);

-- ─── Indexes ──────────────────────────────────────────────────

create index if not exists idx_user_badges_user   on public.user_badges(user_id);
create index if not exists idx_review_votes_review on public.review_votes(review_id);
create index if not exists idx_review_votes_user   on public.review_votes(user_id);
create index if not exists idx_profiles_rank       on public.profiles(review_count desc);

-- ============================================================
-- FASE K Bagian 4: Notifikasi In-App
-- ============================================================

create table if not exists public.notifications (
  id          bigserial primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  type        text not null,
  title       text not null,
  body        text,
  link        text,
  read        boolean not null default false,
  created_at  timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select using (auth.uid() = user_id);

create policy "Users can mark own notifications as read"
  on public.notifications for update using (auth.uid() = user_id);

create index if not exists idx_notifications_user on public.notifications(user_id, created_at desc);

-- ─── Trigger: notifikasi saat badge baru didapat ─────────────

create or replace function public.notify_badge_earned()
returns trigger as $$
declare
  v_badge_name text;
  v_badge_icon text;
begin
  select name, icon into v_badge_name, v_badge_icon
    from public.badges where id = new.badge_id;

  insert into public.notifications (user_id, type, title, body, link)
  values (
    new.user_id,
    'badge_earned',
    v_badge_icon || ' New Badge Earned!',
    v_badge_name,
    '/profile'
  );

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_badge_earned on public.user_badges;
create trigger on_badge_earned
  after insert on public.user_badges
  for each row execute procedure public.notify_badge_earned();

-- ─── Trigger: notifikasi saat review di-vote "Helpful" ───────

create or replace function public.notify_review_helpful()
returns trigger as $$
declare
  v_review_owner uuid;
  v_movie_title  text;
  v_movie_id     bigint;
begin
  select user_id, movie_title, movie_id
    into v_review_owner, v_movie_title, v_movie_id
    from public.reviews where id = new.review_id;

  if v_review_owner is distinct from new.user_id then
    insert into public.notifications (user_id, type, title, body, link)
    values (
      v_review_owner,
      'review_helpful',
      '👍 Your review was helpful!',
      'Someone marked your review of "' || v_movie_title || '" as helpful.',
      '/movie/' || v_movie_id
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_review_voted on public.review_votes;
create trigger on_review_voted
  after insert on public.review_votes
  for each row execute procedure public.notify_review_helpful();