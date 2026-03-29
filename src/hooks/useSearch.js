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

  const search = useCallback(async (q, page = 1) => {
    if (!q.trim()) {
      setResults([]);
      setTotalPages(0);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await movieService.search(q, page);
      const transformed = data.results.map(transformMovie);
      setResults((prev) => page === 1 ? transformed : [...prev, ...transformed]);
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce query changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
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
    query,
    setQuery,
    results,
    loading,
    error,
    hasMore,
    loadMore,
    totalPages,
    currentPage,
  };
}
