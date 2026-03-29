# 🎬 Cinema

> A modern movie discovery web app powered by [TMDB API](https://www.themoviedb.org/)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![CSS Modules](https://img.shields.io/badge/CSS-Modules-000?style=flat-square&logo=cssmodules)
![Deploy](https://img.shields.io/badge/Deployed-Vercel-000?style=flat-square&logo=vercel)

**Live Demo →** [netfif-cinema.vercel.app](https://netfif-cinema.vercel.app)

---

## ✨ Features

- 🔥 **Trending Hero** — auto-fetches today's trending movie with cinematic backdrop
- 🎞 **Movie Categories** — Popular, Now Playing, Top Rated from TMDB
- 🔍 **Movie Detail** — full info including cast, director, genres, ratings & trailer
- ➕ **Add Movie** — add to your personal local collection with live poster preview
- 💀 **Skeleton Loading** — shimmer loading states across all pages
- 📱 **Mobile First** — fully responsive with animated hamburger drawer
- 🌑 **Dark Cinema UI** — premium dark theme with gold accent

---

## 🖥 Preview

| Home | Detail | Add Movie |
|------|--------|-----------|
| Hero + movie grid | Cast, genres, trailer | Form with poster preview |

---

## 🏗 Project Structure

```
src/
├── components/
│   ├── layout/           # Navbar, Footer, AppLayout
│   ├── ui/               # Button, Badge, Skeleton, StateViews
│   └── features/movie/   # Hero, MovieCard, MovieGrid, DetailMovie, AddMovieForm
├── context/              # MoviesContext + useMovies hook
├── hooks/                # useApiMovies, useMovieDetail
├── pages/                # Home, Detail, Create, NotFound
│   └── movie/            # Popular, NowPlaying, TopRated
├── services/             # movieService.js — centralized API layer
├── styles/               # globals.css — design tokens & base styles
└── utils/constants/      # data.js — local movie seed data
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

Edit `.env` and add your TMDB API key:

```env
VITE_API_KEY=your_tmdb_api_key_here
```

> Get a free API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### 3. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🛠 Tech Stack

| Tech | Purpose |
|------|---------|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Vite 6 | Build tool & dev server |
| CSS Modules | Scoped component styles |
| TMDB API | Movie data source |
| Vercel | Deployment & hosting |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#080b10` |
| Surface | `#0d1117` / `#111720` |
| Accent | `#e8b84b` — gold |
| Text Primary | `#f0f2f5` |
| Text Secondary | `#8a9ab5` |
| Font Display | Bebas Neue |
| Font Body | DM Sans |

---

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 📄 License

MIT © [afifn11](https://github.com/afifn11)