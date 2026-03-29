import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WatchlistContext = createContext(null);

const STORAGE_KEY = 'cinema_watchlist';

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(loadFromStorage);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch {
      console.warn('Could not save watchlist to localStorage');
    }
  }, [watchlist]);

  const addToWatchlist = useCallback((movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => String(m.id) === String(movie.id))) return prev;
      return [movie, ...prev];
    });
  }, []);

  const removeFromWatchlist = useCallback((id) => {
    setWatchlist((prev) => prev.filter((m) => String(m.id) !== String(id)));
  }, []);

  const toggleWatchlist = useCallback((movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => String(m.id) === String(movie.id));
      if (exists) return prev.filter((m) => String(m.id) !== String(movie.id));
      return [movie, ...prev];
    });
  }, []);

  const isInWatchlist = useCallback(
    (id) => watchlist.some((m) => String(m.id) === String(id)),
    [watchlist]
  );

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      isInWatchlist,
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
};
