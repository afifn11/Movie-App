import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { MoviesProvider } from './context/MoviesContext';
import { AuthProvider } from './context/AuthContext';

const Home       = lazy(() => import('./pages/Home'));
const Detail     = lazy(() => import('./pages/Detail'));
const Search     = lazy(() => import('./pages/Search'));
const Discover   = lazy(() => import('./pages/Discover'));
const Watchlist  = lazy(() => import('./pages/Watchlist'));
const Profile    = lazy(() => import('./pages/Profile'));
const Lists      = lazy(() => import('./pages/Lists'));
const ListDetail = lazy(() => import('./pages/ListDetail'));
const Popular    = lazy(() => import('./pages/movie/Popular'));
const NowPlaying = lazy(() => import('./pages/movie/NowPlaying'));
const TopRated   = lazy(() => import('./pages/movie/TopRated'));
const NotFound   = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#64748b' }}>
    Loading...
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <MoviesProvider>
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"                  element={<Home />} />
              <Route path="/search"            element={<Search />} />
              <Route path="/discover"          element={<Discover />} />
              <Route path="/watchlist"         element={<Watchlist />} />
              <Route path="/profile"           element={<Profile />} />
              <Route path="/lists"             element={<Lists />} />
              <Route path="/lists/:id"         element={<ListDetail />} />
              <Route path="/movie/popular"     element={<Popular />} />
              <Route path="/movie/now-playing" element={<NowPlaying />} />
              <Route path="/movie/top-rated"   element={<TopRated />} />
              <Route path="/movie/:id"         element={<Detail />} />
              <Route path="*"                  element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </MoviesProvider>
    </AuthProvider>
  );
}