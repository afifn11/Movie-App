import { useState, useEffect, useCallback, useRef } from 'react';
import { movieService, transformMovie } from '../services/movieService';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0); // guard untuk membuang response usang

  const search = useCallback(async (q, page = 1) => {
    if (!q.trim()) {
      setResults([]);
      setTotalPages(0);
      return;
    }
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError(null);
      const data = await movieService.search(q, page);

      // Kalau ada pencarian baru yang sudah jalan setelah ini, buang hasil ini.
      if (requestId !== requestIdRef.current) return;

      const transformed = data.results.map(transformMovie);
      setResults((prev) => page === 1 ? transformed : [...prev, ...transformed]);
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError('Search failed. Please try again.');
        console.error(err);
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      requestIdRef.current++; // batalkan request pending yang mungkin masih jalan
      setResults([]);
      setTotalPages(0);
      setCurrentPage(1);
      return;
    }
    debounceRef.current = setTimeout(() => {
      search(query, 1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  const loadMore = useCallback(() => {
    if (currentPage < totalPages) {
      search(query, currentPage + 1);
    }
  }, [query, currentPage, totalPages, search]);

  const hasMore = currentPage < totalPages;

  return {
    query, setQuery, results, loading, error,
    hasMore, loadMore, totalPages, currentPage,
  };
}