import { createContext, useContext, useState } from 'react';
import { LOCAL_MOVIES } from '../utils/constants/data';

const MoviesContext = createContext(null);

export function MoviesProvider({ children }) {
  const [localMovies, setLocalMovies] = useState(LOCAL_MOVIES);
  const [apiCache, setApiCache] = useState({
    popular: [],
    nowPlaying: [],
    topRated: [],
  });

  const addMovie = (movie) => {
    setLocalMovies((prev) => [movie, ...prev]);
  };

  const updateCache = (key, movies) => {
    setApiCache((prev) => ({ ...prev, [key]: movies }));
  };

  return (
    <MoviesContext.Provider value={{
      localMovies,
      addMovie,
      apiCache,
      updateCache,
    }}>
      {children}
    </MoviesContext.Provider>
  );
}

export const useMovies = () => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error('useMovies must be used within MoviesProvider');
  return ctx;
};

export default MoviesContext;
