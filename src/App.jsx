// src/App.js
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateMovie from './pages/movie/Create';
import NowPlayingMovie from './pages/movie/NowPlaying';
import TopRatedMovie from './pages/movie/TopRated';
import PopularMovie from './pages/movie/Popular';
import Detail from './pages/movie/Detail';
import Layout from './Layout';
import { ThemeProvider } from 'styled-components';
import theme from './utils/constants/theme';
import MoviesProvider from './context/MoviesProvider';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MoviesProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/create" element={<CreateMovie />} />
            <Route path="/movie/popular" element={<PopularMovie />} />
            <Route path="/movie/now" element={<NowPlayingMovie />} />
            <Route path="/movie/top" element={<TopRatedMovie />} />
            <Route path="/movie/:id" element={<Detail />} />
          </Routes>
        </Layout>
      </MoviesProvider>
    </ThemeProvider>
  );
}

export default App;