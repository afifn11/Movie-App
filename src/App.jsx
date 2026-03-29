import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { MoviesProvider } from './context/MoviesContext';

import Home from './pages/Home';
import Create from './pages/Create';
import Detail from './pages/Detail';
import Popular from './pages/movie/Popular';
import NowPlaying from './pages/movie/NowPlaying';
import TopRated from './pages/movie/TopRated';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <MoviesProvider>
      <AppLayout>
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/movie/create"      element={<Create />} />
          <Route path="/movie/popular"     element={<Popular />} />
          <Route path="/movie/now-playing" element={<NowPlaying />} />
          <Route path="/movie/top-rated"   element={<TopRated />} />
          <Route path="/movie/:id"         element={<Detail />} />
          <Route path="*"                  element={<NotFound />} />
        </Routes>
      </AppLayout>
    </MoviesProvider>
  );
}
