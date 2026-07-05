import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

const DEFAULT_FILTERS = {
  genres: [],
  yearFrom: '',
  yearTo: '',
  minRating: 0,
  maxRuntime: '',
  sortBy: 'popularity.desc',
};

const PARAM_MAP = {
  genres: 'g',
  yearFrom: 'yf',
  yearTo: 'yt',
  minRating: 'mr',
  maxRuntime: 'rt',
  sortBy: 'sort',
};

export function useMovieFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const g = searchParams.get(PARAM_MAP.genres);
    return {
      genres: g ? g.split(',').map(Number).filter(Boolean) : DEFAULT_FILTERS.genres,
      yearFrom: searchParams.get(PARAM_MAP.yearFrom) || DEFAULT_FILTERS.yearFrom,
      yearTo: searchParams.get(PARAM_MAP.yearTo) || DEFAULT_FILTERS.yearTo,
      minRating: Number(searchParams.get(PARAM_MAP.minRating)) || DEFAULT_FILTERS.minRating,
      maxRuntime: searchParams.get(PARAM_MAP.maxRuntime) || DEFAULT_FILTERS.maxRuntime,
      sortBy: searchParams.get(PARAM_MAP.sortBy) || DEFAULT_FILTERS.sortBy,
    };
  }, [searchParams]);

  const setFilters = useCallback((updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const merged = { ...filters, ...updates };
      Object.entries(merged).forEach(([key, value]) => {
        const param = PARAM_MAP[key];
        const isDefault = JSON.stringify(value) === JSON.stringify(DEFAULT_FILTERS[key]);
        if (!value || isDefault || (Array.isArray(value) && value.length === 0)) {
          next.delete(param);
        } else if (Array.isArray(value)) {
          next.set(param, value.join(','));
        } else {
          next.set(param, String(value));
        }
      });
      return next;
    }, { replace: true });
  }, [filters, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters = useMemo(() => (
    filters.genres.length > 0 || !!filters.yearFrom || !!filters.yearTo ||
    filters.minRating > 0 || !!filters.maxRuntime || filters.sortBy !== DEFAULT_FILTERS.sortBy
  ), [filters]);

  return { filters, setFilters, clearFilters, hasActiveFilters };
}