import { useState, useEffect, useCallback } from 'react';
import { movieService, transformMovie } from '../services/movieService';
import { useMovies } from '../context/MoviesContext';

export function useApiMovies(category) {
  const { apiCache, updateCache } = useMovies();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchers = {
    popular: movieService.getPopular,
    nowPlaying: movieService.getNowPlaying,
    topRated: movieService.getTopRated,
  };

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchers[category]();
      const transformed = data.results.map(transformMovie);
      updateCache(category, transformed);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (apiCache[category].length === 0) {
      fetchMovies();
    }
  }, [category]);

  return {
    movies: apiCache[category],
    loading: loading && apiCache[category].length === 0,
    error,
    retry: fetchMovies,
  };
}
