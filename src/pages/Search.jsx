import { useRef, useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';
import MovieGrid from '../components/features/movie/MovieGrid/MovieGrid';
import { PageLoader } from '../components/ui/StateViews/StateViews';
import styles from './Search.module.css';

export default function SearchPage() {
  const { query, setQuery, results, loading, error, hasMore, loadMore } = useSearch();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={styles.page}>
      <div className={`container ${styles.container}`}>
        {/* Search Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleAccent}>/</span> Search
          </h1>
          <p className={styles.subtitle}>Find any movie from millions of titles</p>
        </div>

        {/* Search Input */}
        <div className={styles.inputWrap}>
          <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie..."
            className={styles.input}
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')} aria-label="Clear search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Results */}
        <div className={styles.results}>
          {!query && (
            <div className={styles.empty}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p>Type a movie title to get started</p>
            </div>
          )}

          {query && loading && results.length === 0 && <PageLoader message="Searching..." />}

          {query && !loading && results.length === 0 && (
            <div className={styles.empty}>
              <p>No results found for <strong>"{query}"</strong></p>
            </div>
          )}

          {results.length > 0 && (
            <MovieGrid
              movies={results}
              title={`Results for "${query}"`}
              loading={false}
              loadingMore={loading && results.length > 0}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          )}
        </div>
      </div>
    </div>
  );
}
