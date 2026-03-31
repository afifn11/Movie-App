import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { MoviesProvider } from './context/MoviesContext';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Detail from './pages/Detail';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Lists from './pages/Lists';
import ListDetail from './pages/ListDetail';
import Popular from './pages/movie/Popular';
import NowPlaying from './pages/movie/NowPlaying';
import TopRated from './pages/movie/TopRated';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <MoviesProvider>
        <AppLayout>
          <Routes>
            <Route path="/"                  element={<Home />} />
            <Route path="/search"            element={<Search />} />
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
        </AppLayout>
      </MoviesProvider>
    </AuthProvider>
  );
}
