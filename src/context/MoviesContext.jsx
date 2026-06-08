import { createContext, useContext, useState, useCallback } from 'react';

const MoviesContext = createContext(null);

export function MoviesProvider({ children }) {
  const [apiCache, setApiCache] = useState({
    popular: [],
    nowPlaying: [],
    topRated: [],
  });

  const updateCache = useCallback((key, updaterOrValue) => {
    setApiCache((prev) => ({
      ...prev,
      [key]: typeof updaterOrValue === 'function' ? updaterOrValue(prev[key]) : updaterOrValue,
    }));
  }, []);

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