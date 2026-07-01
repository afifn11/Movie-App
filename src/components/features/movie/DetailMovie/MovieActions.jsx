import Button from '../../../ui/Button/Button';
import styles from './DetailMovie.module.css';

export default function MovieActions({ trailerKey, saved, watched, imdbId, isAuthenticated, onToggleWatchlist, onMarkWatched, onAddToList }) {
  return (
    <div className={styles.actions}>
      {trailerKey && (
        <Button as="a" href={`https://www.youtube.com/watch?v=${trailerKey}`}
          target="_blank" rel="noopener noreferrer" variant="primary" size="lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3L19 12L5 21V3Z"/></svg>
          Watch Trailer
        </Button>
      )}
      <Button
        variant={saved ? 'danger' : 'secondary'} size="lg"
        onClick={onToggleWatchlist}
      >
        <svg width="16" height="16" viewBox="0 0 24 24"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        {saved ? 'In Watchlist' : 'Add to Watchlist'}
      </Button>
      <Button
        variant={watched ? 'secondary' : 'ghost'} size="lg"
        onClick={onMarkWatched}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
        {watched ? 'Watched' : 'Mark as Watched'}
      </Button>
      {isAuthenticated && (
        <Button
          variant="ghost" size="lg"
          onClick={onAddToList}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add to List
        </Button>
      )}
      {imdbId && (
        <Button as="a" href={`https://www.imdb.com/title/${imdbId}`}
          target="_blank" rel="noopener noreferrer" variant="ghost" size="lg">
          IMDB
        </Button>
      )}
    </div>
  );
}