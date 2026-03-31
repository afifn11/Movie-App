import { useAuth } from '../../../../context/AuthContext';
import { useWatchlistDB } from '../../../../hooks/useWatchlistDB';
import styles from './WatchlistButton.module.css';

export default function WatchlistButton({ movie, className = '', onLoginRequired }) {
  const { isAuthenticated } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlistDB();
  const saved = isInWatchlist(movie.id);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }
    await toggleWatchlist(movie);
  };

  return (
    <button
      className={`${styles.btn} ${saved ? styles.saved : ''} ${className}`}
      onClick={handleClick}
      aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
      title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <svg width="14" height="14" viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  );
}
