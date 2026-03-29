# 🎬 Cinema App

A modern movie discovery app built with React + Vite, powered by [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

## ✨ Features

- **Cinematic Dark UI** — premium dark theme with gold accent colors
- **Mobile-First Design** — responsive across all screen sizes
- **Hero Section** — auto-fetching trending movie with backdrop
- **Movie Collections** — Popular, Now Playing, Top Rated from TMDB
- **Movie Detail** — full info with cast, director, ratings, trailer
- **Add Movies** — add to your local personal collection
- **Skeleton Loading** — smooth shimmer loading states
- **Animated Cards** — hover effects and staggered grid animations

## 🏗 Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Footer, AppLayout
│   ├── ui/              # Button, Badge, Skeleton, StateViews
│   └── features/movie/  # Hero, MovieCard, MovieGrid, DetailMovie, AddMovieForm
├── context/             # MoviesContext + useMovies hook
├── hooks/               # useApiMovies, useMovieDetail
├── pages/               # Home, Detail, Create, NotFound
│   └── movie/           # Popular, NowPlaying, TopRated
├── services/            # movieService.js — centralized API layer
├── styles/              # globals.css — design tokens & base styles
└── utils/constants/     # data.js — local movie collection
```

## 🚀 Getting Started

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your TMDB API key
   ```

3. **Get a free TMDB API key**
   - Create account at [themoviedb.org](https://www.themoviedb.org/)
   - Go to Settings → API → Request an API key

4. **Run the app**
   ```bash
   npm run dev
   ```

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#080b10` |
| Surface | `#0d1117` / `#111720` |
| Accent | `#e8b84b` (gold) |
| Text Primary | `#f0f2f5` |
| Text Secondary | `#8a9ab5` |
| Font Display | Bebas Neue |
| Font Body | DM Sans |

## 🛠 Tech Stack

- **React 19** — UI framework
- **React Router v7** — client-side routing
- **Vite 6** — build tool
- **CSS Modules** — scoped styles (no external CSS lib)
- **TMDB API** — movie data

---
Built with ❤️ — Cinema App © 2025
