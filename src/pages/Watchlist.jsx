import { useWatchlist } from '../context/WatchlistContext';
import MovieGrid from '../components/features/movie/MovieGrid/MovieGrid';
import { EmptyState } from '../components/ui/StateViews/StateViews';
import { Link } from 'react-router-dom';
import styles from './Watchlist.module.css';

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <div className={styles.page}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              <span className={styles.titleAccent}>/</span> My Watchlist
            </h1>
            <p className={styles.subtitle}>
              {watchlist.length > 0
                ? `${watchlist.length} movie${watchlist.length > 1 ? 's' : ''} saved`
                : 'Your saved movies will appear here'}
            </p>
          </div>
        </div>

        {watchlist.length === 0 ? (
          <div className={styles.emptyWrap}>
            <EmptyState
              message="No movies saved yet. Browse and click the bookmark icon to save movies."
              icon={
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
            <Link to="/" className={styles.browseBtn}>Browse Movies</Link>
          </div>
        ) : (
          <MovieGrid movies={watchlist} showGenreFilter />
        )}
      </div>
    </div>
  );
}
