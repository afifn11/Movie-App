import { createContext, useContext, useState } from 'react';

const MoviesContext = createContext(null);

export function MoviesProvider({ children }) {
  const [apiCache, setApiCache] = useState({
    popular: [],
    nowPlaying: [],
    topRated: [],
  });

  const updateCache = (key, movies) => {
    setApiCache((prev) => ({ ...prev, [key]: movies }));
  };

  return (
    <MoviesContext.Provider value={{ apiCache, updateCache }}>
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
