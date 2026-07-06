import { useState, useEffect, useCallback, useRef } from 'react';
import { movieService, transformMovie } from '../services/movieService';
import { useMovies } from '../context/MoviesContext';

const fetchers = {
  popular: movieService.getPopular,
  nowPlaying: movieService.getNowPlaying,
  topRated: movieService.getTopRated,
};

export function useApiMovies(category) {
  const { apiCache, updateCache } = useMovies();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const hasFetchedRef = useRef({}); 

  const fetchMovies = useCallback(async (pageNum = 1, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);
      const data = await fetchers[category](pageNum);
      const transformed = data.results.map(transformMovie);

      updateCache(category, (currentCacheData) =>
        append ? [...(currentCacheData || []), ...transformed] : transformed
      );

      setHasMore(pageNum < data.total_pages);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, updateCache]);

  useEffect(() => {
    // Hanya fetch SEKALI per kategori per mount siklus, bukan tiap kali
    // referensi apiCache berubah (mencegah infinite loop saat hasil API kosong).
    if (hasFetchedRef.current[category]) return;
    if ((apiCache[category]?.length || 0) === 0) {
      hasFetchedRef.current[category] = true;
      fetchMovies(1);
    }
  }, [category, fetchMovies, apiCache]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) fetchMovies(page + 1, true);
  }, [page, hasMore, loadingMore, fetchMovies]);

  return {
    movies: apiCache[category] || [],
    loading: loading && (apiCache[category]?.length || 0) === 0,
    loadingMore,
    error,
    hasMore,
    loadMore,
  };
}