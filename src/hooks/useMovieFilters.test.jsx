import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useMovieFilters } from './useMovieFilters';

function wrapper({ children }) {
  return <MemoryRouter initialEntries={['/explore']}>{children}</MemoryRouter>;
}

describe('useMovieFilters', () => {
  it('starts with default (empty) filters', () => {
    const { result } = renderHook(() => useMovieFilters(), { wrapper });
    expect(result.current.filters.genres).toEqual([]);
    expect(result.current.filters.sortBy).toBe('popularity.desc');
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('updates genres and marks filters as active', () => {
    const { result } = renderHook(() => useMovieFilters(), { wrapper });

    act(() => {
      result.current.setFilters({ genres: [28, 12] });
    });

    expect(result.current.filters.genres).toEqual([28, 12]);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('clearFilters resets everything back to default', () => {
    const { result } = renderHook(() => useMovieFilters(), { wrapper });

    act(() => {
      result.current.setFilters({ genres: [28], minRating: 7 });
    });
    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.genres).toEqual([]);
    expect(result.current.filters.minRating).toBe(0);
    expect(result.current.hasActiveFilters).toBe(false);
  });
});