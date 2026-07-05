import { useState, useEffect, useCallback, useRef } from 'react';
import { movieService, transformMovie } from '../services/movieService';

export function useDiscoverMovies(filters) {
  const [movies, setMovies]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState(null);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(0);
  const requestIdRef = useRef(0);
  const debounceRef  = useRef(null);

  const fetchPage = useCallback(async (pageNum, append) => {
    const requestId = ++requestIdRef.current;
    try {
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);
      const data = await movieService.discover(filters, pageNum);
      if (requestId !== requestIdRef.current) return; // stale response, buang

      const transformed = data.results.map(transformMovie);
      setMovies((prev) => append ? [...prev, ...transformed] : transformed);
      setTotalPages(data.total_pages || 0);
      setPage(pageNum);
    } catch (err) {
      if (requestId === requestIdRef.current) {
        console.error('Discover fetch error:', err);
        setError('Failed to load movies. Please try again.');
        if (!append) setMovies([]);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPage(1, false), 350);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !loadingMore) fetchPage(page + 1, true);
  }, [page, totalPages, loadingMore, fetchPage]);

  return { movies, loading, loadingMore, error, hasMore: page < totalPages, loadMore };
}