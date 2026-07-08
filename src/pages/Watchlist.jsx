import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWatchlistDB } from '../hooks/useWatchlistDB';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/features/movie/MovieGrid/MovieGrid';
import { EmptyState } from '../components/ui/StateViews/StateViews';
import LoginModal from '../components/features/auth/LoginModal';
import { Link } from 'react-router-dom';
import styles from './Watchlist.module.css';

export default function WatchlistPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { watchlist, loading } = useWatchlistDB();
  const [loginOpen, setLoginOpen] = useState(false);

  // transform for MovieGrid
  const movies = watchlist.map((w) => ({
    id: w.movie_id,
    title: w.movie_title,
    year: w.year,
    type: w.genre,
    poster: w.poster_url,
    rating: w.rating,
  }));

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={`container ${styles.container}`}>
          <div className={styles.header}>
            <h1 className={styles.title}><span className={styles.titleAccent}>/</span> {t('watchlist.title')}</h1>
          </div>
          <div className={styles.emptyWrap}>
            <EmptyState
              message={t('watchlist.signInMessage')}
              icon={
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              }
            />
            <button className={styles.browseBtn} onClick={() => setLoginOpen(true)}>
              {t('common.signInGoogle')}
            </button>
          </div>
        </div>
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}><span className={styles.titleAccent}>/</span> {t('watchlist.title')}</h1>
            <p className={styles.subtitle}>
              {loading ? t('watchlist.loading') : movies.length > 0
                ? t('watchlist.savedCount', { count: movies.length })
                : t('watchlist.emptySubtitle')}
            </p>
          </div>
        </div>

        {!loading && movies.length === 0 ? (
          <div className={styles.emptyWrap}>
            <EmptyState
              message={t('watchlist.emptyMessage')}
              icon={
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              }
            />
            <Link to="/" className={styles.browseBtn}>{t('watchlist.browseMovies')}</Link>
          </div>
        ) : (
          <MovieGrid movies={movies} loading={loading} showGenreFilter />
        )}
      </div>
    </div>
  );
}
