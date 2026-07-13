# Netfif Cinema

A production-grade movie discovery platform built with React, Vite, Supabase, and Google Gemini. Beyond basic browsing, it includes AI-assisted discovery, social sharing with dynamic OG images, a gamified review system, real-time notifications, offline-capable PWA support, and bilingual UI (English/Indonesian).

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=flat-square&logo=google)
![Deploy](https://img.shields.io/badge/Deployed-Vercel-000?style=flat-square&logo=vercel)
![CI](https://github.com/afifn11/Movie-App/actions/workflows/ci.yml/badge.svg)

**Live Demo:** [netfif-cinema.vercel.app](https://netfif-cinema.vercel.app)

---

## Features

### Discovery
- Cinematic hero section with auto-fetched trending movie and full-bleed backdrop
- Popular, Now Playing, and Top Rated lists powered by TMDB
- Debounced real-time search with pagination
- **Explore** page with multi-facet filtering (genre, year range, minimum rating, runtime, sort order), all persisted to the URL for shareable/bookmarkable filtered views
- Natural-language filtering — describe what you want in plain English or Indonesian and Gemini parses it into structured filter parameters
- Saved filter presets (authenticated users)

### Account & Personalization
- Google Sign-In via Supabase Auth
- Watchlist synced across devices
- Watch history tracking
- Ratings and written reviews per film
- Custom film lists (public or private)
- Personal profile page with critic rank, review streaks, and earned badges

### AI Features (Google Gemini)
- Contextual AI chat for any movie
- AI-assisted review writing suggestions
- Hyper-personal recommendations based on actual ratings and watch history
- Mood-based discovery — describe how you feel, get curated picks
- Natural-language filter parsing for the Explore page

### Social Sharing
- Native share sheet (mobile) with fallback share popover (desktop)
- Per-movie and per-review sharing
- Dynamic Open Graph image generation (branded card with poster, title, and rating)
- Bot-aware server-side prerendering so social platforms (Facebook, Twitter, WhatsApp) receive full metadata and JSON-LD structured data for rich previews

### Gamification
- Critic rank system (Casual Viewer through Master Critic) based on review activity
- Review streak tracking (current and longest)
- Earned badges (First Take, Genre Explorer, On a Roll, Prolific Critic)
- Public leaderboard ranked by review count
- "Helpful" voting on reviews

### Real-Time Notifications
- In-app notification bell with unread count
- Real-time delivery via Supabase Realtime (badge earned, review marked helpful)
- Mark as read / mark all as read

### Platform & Accessibility
- Installable PWA with offline-capable image caching
- Bilingual UI (English / Indonesian) with automatic browser-language detection
- WCAG AA color contrast, `prefers-reduced-motion` support, skip-to-content link, and labeled form controls
- Skeleton loading states matching final layout (no generic spinners on primary pages)

### Reliability & Security
- Row Level Security (RLS) policies enforced on every table, including trigger-protected gamification columns to prevent client-side stat manipulation
- Persistent, database-backed rate limiting on AI endpoints (survives serverless cold starts)
- Real-time error tracking and session replay via Sentry
- Content Security Policy headers on all routes

---
## Architecture

```text
src/
├── i18n/                          # Translation setup and locale files (en, id)
├── lib/                           # External service clients
│   ├── supabase.js                # Supabase client
│   ├── gemini.js                  # Gemini AI client functions
│   └── sentry.js                  # Sentry init (lazy-loaded, production only)
├── context/                       # React contexts
│   ├── AuthContext.jsx            # Auth session, profile, watchlist
│   └── MoviesContext.jsx          # Shared TMDB API cache
├── hooks/                         # Custom hooks
│   ├── useApiMovies.js            # Paginated TMDB lists
│   ├── useMovieDetail.js          # Single movie + credits
│   ├── useSearch.js               # Debounced search
│   ├── useMovieFilters.js         # URL-persisted filter state
│   ├── useDiscoverMovies.js       # TMDB discover endpoint
│   ├── useFilterPresets.js        # Saved filter presets
│   ├── useWatchlistDB.js          # Supabase watchlist
│   ├── useReviews.js              # Ratings, reviews, helpful votes
│   ├── useMovieLists.js           # Custom lists
│   ├── useWatchHistory.js         # Watch history
│   ├── useUserBadges.js           # Earned badges
│   ├── useLeaderboard.js          # Leaderboard data
│   └── useNotifications.js        # Real-time notifications
├── components/
│   ├── layout/                    # Navbar, Footer, AppLayout, ScrollToTop
│   ├── ui/                        # Button, Modal, Skeleton, Avatar, CriticBadge, ErrorBoundary, StateViews
│   └── features/
│       ├── auth/                  # LoginModal, UserMenu
│       ├── movie/                 # Hero, MovieCard, MovieGrid, DetailMovie, MovieActions
│       ├── filter/                # FilterPanel, NaturalLanguageFilter
│       ├── review/                # ReviewSection
│       ├── ai/                    # AIChatPanel, MoodPicker, AIRecommendations
│       └── notifications/         # NotificationBell
├── pages/                         # Route-level components
│   ├── Home
│   ├── Search
│   ├── Explore
│   ├── Leaderboard
│   ├── Profile
│   ├── Watchlist
│   ├── Lists
│   ├── ListDetail
│   ├── Terms
│   ├── Privacy
│   ├── NotFound
│   └── movie/
│       ├── Popular
│       ├── NowPlaying
│       └── TopRated
└── services/
    └── movieService.js            # Centralized TMDB API layer

api/                               # Vercel serverless functions
├── gemini.js                      # AI endpoints (chat, review assist, mood, filter parsing)
├── og.js                          # Dynamic Open Graph image generator (Node runtime)
└── share-movie.js                 # Bot-aware prerendered HTML with meta tags and JSON-LD

e2e/                               # Playwright end-to-end tests

src/**/*.test.jsx                  # Vitest unit/component tests
```

## Database Schema (Supabase / PostgreSQL)

```sql
profiles         -- user profile, synced from Google OAuth; includes gamification stats
watchlist        -- saved movies per user
watch_history    -- log of watched films
reviews          -- ratings + text reviews per movie
review_votes     -- "helpful" votes on reviews
movie_lists      -- custom named collections
list_items       -- movies inside each list
filter_presets   -- saved Explore filter combinations
badges           -- badge definitions (reference data)
user_badges      -- badges earned per user
notifications    -- in-app notification feed
rate_limits      -- persistent request counters for AI endpoints
```

All tables have Row Level Security enabled. Gamification columns on `profiles` (`review_count`, `critic_rank`, `current_streak`, `longest_streak`) are additionally protected by a database trigger that rejects direct client-side writes, ensuring they can only be updated through the review-insert trigger logic.

The full schema, including triggers, RLS policies, and RPC functions, is in `supabase/schema.sql`.

---

## Tech Stack

**Frontend:** React 19, React Router 7, Vite 6, CSS Modules, react-i18next
**Backend:** Supabase (Postgres, Auth, Realtime, Row Level Security), Vercel Serverless Functions
**AI:** Google Gemini (`@google/genai`)
**Observability:** Sentry (error tracking + session replay)
**Testing:** Vitest (unit/component), Playwright (end-to-end)
**CI/CD:** GitHub Actions (lint, test, build, E2E), Dependabot
**PWA:** vite-plugin-pwa (Workbox)
**Hosting:** Vercel

---

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/afifn11/Movie-App.git
cd Movie-App
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Client-side (must be prefixed `VITE_` to be exposed to the browser):

```env
VITE_TMDB_READ_TOKEN=       # TMDB API v4 Read Access Token
VITE_SUPABASE_URL=          # Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Supabase anon key
VITE_SENTRY_DSN=            # Sentry DSN (safe to expose publicly)
```

Server-side only, used by functions in `api/` (set in Vercel Environment Variables, no `VITE_` prefix):

```env
GEMINI_API_KEY=              # Google Gemini API key
SUPABASE_URL=                # Same Supabase project URL
SUPABASE_ANON_KEY=           # Same Supabase anon key
TMDB_READ_TOKEN=             # Same TMDB token, used by api/share-movie.js
```

### 3. Set Up the Database

- Open the Supabase Dashboard → SQL Editor
- Run the full contents of `supabase/schema.sql`
- Enable Google OAuth: Authentication → Providers → Google
- Enable Realtime replication for the `notifications` table: Database → Publications → `supabase_realtime` → toggle on `notifications`

### 4. Run Locally

```bash
npm run dev
```

Note: Service workers and full PWA behavior only activate in production builds. To test PWA install prompts and offline caching locally, use `npm run build && npm run preview` instead of `npm run dev`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest unit/component tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `ANALYZE=true npm run build` | Build with a bundle size treemap (`dist/stats.html`) |

---

## Continuous Integration

Every push and pull request against `main` runs through GitHub Actions:

1. **Lint** — ESLint across the codebase, including Node-specific rules for `api/` and config files
2. **Unit tests** — Vitest
3. **Build** — production Vite build
4. **End-to-end tests** — Playwright, run against the production build

`main` is protected: direct pushes are disabled, and merging requires the CI check to pass. Dependabot opens weekly PRs for dependency updates, grouped by minor/patch to reduce noise; major version bumps are reviewed individually before merging.

---

## Getting API Keys

| Service | URL | Free Tier |
|---|---|---|
| TMDB | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) | Yes |
| Supabase | [supabase.com](https://supabase.com) | Yes |
| Google Gemini | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Yes |
| Google OAuth | [console.cloud.google.com](https://console.cloud.google.com) | Yes |
| Sentry | [sentry.io](https://sentry.io) | Yes |

---

## Design System

| Token | Value |
|---|---|
| Background | `#080b10` |
| Surface | `#0d1117` / `#111720` |
| Accent | `#e8b84b` (gold) |
| Text (muted) | `#7686a0` — WCAG AA compliant against all surface colors |
| Font, Display | Bebas Neue |
| Font, Serif accents | DM Serif Display |
| Font, Body | DM Sans |

---

## Deployment

The app is deployed on Vercel. The frontend builds as a static SPA served with security headers and a Content Security Policy defined in `vercel.json`. Server logic lives in `api/` as individual Vercel Functions:

- `api/gemini.js` — authenticated, rate-limited AI endpoints
- `api/og.js` — Edge-compatible dynamic image generation (Node runtime)
- `api/share-movie.js` — serves prerendered HTML with full metadata to social media crawlers, detected by User-Agent via a rewrite rule in `vercel.json`, while regular users continue to receive the SPA

---

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

---

Built by [Muhammad Afif Naufal](https://mafif.my.id)