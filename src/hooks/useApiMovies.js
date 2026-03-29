import { useState, useEffect, useCallback } from 'react';
import { movieService, transformMovie } from '../services/movieService';
import { useMovies } from '../context/MoviesContext';

export function useApiMovies(category) {
  const { apiCache, updateCache } = useMovies();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchers = {
    popular: movieService.getPopular,
    nowPlaying: movieService.getNowPlaying,
    topRated: movieService.getTopRated,
  };

  const fetchMovies = useCallback(async (pageNum = 1, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);
      const data = await fetchers[category](pageNum);
      const transformed = data.results.map(transformMovie);
      updateCache(category, append ? [...apiCache[category], ...transformed] : transformed);
      setHasMore(pageNum < data.total_pages);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, apiCache]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) fetchMovies(page + 1, true);
  }, [page, hasMore, loadingMore, fetchMovies]);

  useEffect(() => {
    if (apiCache[category].length === 0) fetchMovies(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return {
    movies: apiCache[category],
    loading: loading && apiCache[category].length === 0,
    loadingMore,
    error,
    hasMore,
    loadMore,
  };
}
