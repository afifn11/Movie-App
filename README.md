# 🎬 Cinema App v2

> A production-grade movie discovery app with AI-powered features, built with React + Vite + Supabase + Google Gemini.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=flat-square&logo=google)
![Deploy](https://img.shields.io/badge/Deployed-Vercel-000?style=flat-square&logo=vercel)

**Live Demo →** [netfif-cinema.vercel.app](https://netfif-cinema.vercel.app)

---

## ✨ Features

### 🎥 Discovery
- **Cinematic Hero** — auto-fetching trending movie with full-bleed backdrop
- **Popular, Now Playing, Top Rated** — TMDB-powered movie lists
- **Search** — debounced real-time search with load more pagination
- **Genre Filter** — filter movies by genre across all pages

### 👤 User (Auth required)
- **Google Sign-In** — one-click authentication via Supabase OAuth
- **Watchlist** — save movies, synced across devices via database
- **Watch History** — log films you've watched
- **Ratings & Reviews** — rate out of 10 + write detailed reviews
- **Custom Lists** — create named collections, make them public or private

### 🤖 AI (Google Gemini)
- **AI Chat per Film** — ask anything about any movie contextually
- **Smart Review Assistant** — AI writing tips to enhance your reviews
- **Hyper-Personal Recommendations** — based on your actual ratings & watch history
- **Mood-Based Discovery** — describe how you feel, get perfect film picks

---

## 🏗 Architecture

```
src/
├── lib/                    # External service clients
│   ├── supabase.js         # Supabase client
│   └── gemini.js           # Gemini AI functions
├── context/                # React contexts
│   ├── AuthContext.jsx     # Google OAuth + session
│   └── MoviesContext.jsx   # API cache
├── hooks/                  # Custom hooks
│   ├── useApiMovies.js     # Paginated TMDB lists
│   ├── useMovieDetail.js   # Single movie + credits
│   ├── useSearch.js        # Debounced search
│   ├── useWatchlistDB.js   # Supabase watchlist
│   ├── useReviews.js       # Rating & reviews
│   ├── useMovieLists.js    # Custom lists
│   └── useWatchHistory.js  # Watch history
├── components/
│   ├── layout/             # Navbar, Footer, AppLayout, ScrollToTop
│   ├── ui/                 # Button, Badge, Modal, Skeleton, StateViews
│   └── features/
│       ├── auth/           # LoginModal, UserMenu
│       ├── movie/          # Hero, MovieCard, MovieGrid, DetailMovie, etc.
│       ├── review/         # ReviewSection
│       └── ai/             # AIChatPanel, MoodPicker, AIRecommendations
├── pages/                  # Route-level components
│   ├── Home, Search, Watchlist, Profile, Lists, ListDetail
│   └── movie/              # Popular, NowPlaying, TopRated
└── services/
    └── movieService.js     # Centralized TMDB API layer
```

---

## 🗄 Database Schema (Supabase)

```sql
profiles        -- user profile (synced from Google OAuth)
watchlist       -- saved movies per user
reviews         -- ratings + text reviews per movie
movie_lists     -- custom named collections
list_items      -- movies inside each list
watch_history   -- log of watched films
```

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/afifn11/cinema-app.git
cd cinema-app
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Fill in `.env`:
```env
VITE_API_KEY=            # TMDB API key
VITE_SUPABASE_URL=       # Supabase project URL
VITE_SUPABASE_ANON_KEY=  # Supabase anon key
VITE_GEMINI_API_KEY=     # Google Gemini API key
```

### 3. Setup Supabase Database
- Go to Supabase Dashboard → SQL Editor
- Copy and run the contents of `supabase/schema.sql`
- Enable Google OAuth: Authentication → Providers → Google

### 4. Run
```bash
npm run dev
```

---

## 🔑 Getting API Keys

| Service | URL | Free Tier |
|---------|-----|-----------|
| TMDB | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) | ✅ Free |
| Supabase | [supabase.com](https://supabase.com) | ✅ Free (2 projects) |
| Google Gemini | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | ✅ Free tier |
| Google OAuth | [console.cloud.google.com](https://console.cloud.google.com) | ✅ Free |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#080b10` |
| Surface | `#0d1117` / `#111720` |
| Accent | `#e8b84b` — gold |
| Font Display | Bebas Neue |
| Font Body | DM Sans |

---

## 📦 Tech Stack

React 19 · React Router v7 · Vite 6 · Supabase · Google Gemini · CSS Modules · TMDB API · Vercel

---

© 2025 Cinema App · [afifn11](https://github.com/afifn11)
