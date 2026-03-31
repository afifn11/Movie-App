import Button from '../../../ui/Button/Button';
import Badge from '../../../ui/Badge/Badge';
import { PageLoader, ErrorState } from '../../../ui/StateViews/StateViews';
import { IMG } from '../../../../services/movieService';
import { useWatchlistDB } from '../../../../hooks/useWatchlistDB';
import { useWatchHistory } from '../../../../hooks/useWatchHistory';
import { useAuth } from '../../../../context/AuthContext';
import ReviewSection from '../../review/ReviewSection';
import AIChatPanel from '../../ai/AIChatPanel';
import styles from './DetailMovie.module.css';

export default function DetailMovie({ movie, trailerKey, credits, loading, error, onLoginRequired }) {
  const { isAuthenticated } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlistDB();
  const { markAsWatched, hasWatched } = useWatchHistory();

  if (loading) return <PageLoader message="Loading movie details..." />;
  if (error || !movie) return <ErrorState message={error || 'Movie not found.'} />;

  const posterUrl = movie._localPoster || IMG.poster(movie.poster_path);
  const backdropUrl = IMG.backdrop(movie.backdrop_path);
  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
  const director = credits?.crew?.find((c) => c.job === 'Director')?.name;
  const saved = isInWatchlist(movie.id);
  const watched = hasWatched(movie.id);

  const watchlistMovie = {
    id: movie.id, title: movie.title, year,
    type: movie.genres?.[0]?.name || 'Movie',
    poster: posterUrl, rating: rating || 'N/A',
  };

  const handleAuthAction = async (action) => {
    if (!isAuthenticated) { onLoginRequired?.(); return; }
    await action();
  };

  return (
    <div className={styles.wrapper}>
      {backdropUrl && (
        <div className={styles.backdropBg}>
          <img src={backdropUrl} alt="" aria-hidden="true" className={styles.backdropImg} />
          <div className={styles.backdropOverlay} />
        </div>
      )}

      <div className={`container ${styles.container}`}>
        {/* Poster */}
        <div className={styles.posterCol}>
          <div className={styles.posterWrap}>
            <img
              src={posterUrl || 'https://placehold.co/400x600/111720/4a5568?text=No+Image'}
              alt={`${movie.title} poster`}
              className={styles.poster}
            />
            {rating && (
              <div className={styles.ratingPill}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <span>{rating}</span>
                <span className={styles.ratingMax}>/10</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className={styles.infoCol}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{movie.title}</h1>
            {movie.tagline && <p className={styles.tagline}>"{movie.tagline}"</p>}
          </div>

          <div className={styles.metaRow}>
            {year && <span className={styles.metaChip}>{year}</span>}
            {runtime && <span className={styles.metaChip}>{runtime}</span>}
            {movie.status && (
              <span className={`${styles.metaChip} ${movie.status === 'Released' ? styles.metaGreen : ''}`}>
                {movie.status}
              </span>
            )}
            {watched && <span className={`${styles.metaChip} ${styles.metaWatched}`}>✓ Watched</span>}
          </div>

          {movie.genres?.length > 0 && (
            <div className={styles.genres}>
              {movie.genres.map((g) => <Badge key={g.id} variant="genre">{g.name}</Badge>)}
            </div>
          )}

          <div className={styles.block}>
            <h3 className={styles.blockLabel}>Overview</h3>
            <p className={styles.overview}>{movie.overview || 'No overview available.'}</p>
          </div>

          <div className={styles.stats}>
            {director && (
              <div className={styles.stat}>
                <span className={styles.statLabel}>Director</span>
                <span className={styles.statValue}>{director}</span>
              </div>
            )}
            {movie.vote_count > 0 && (
              <div className={styles.stat}>
                <span className={styles.statLabel}>Votes</span>
                <span className={styles.statValue}>{movie.vote_count.toLocaleString()}</span>
              </div>
            )}
            {movie.budget > 0 && (
              <div className={styles.stat}>
                <span className={styles.statLabel}>Budget</span>
                <span className={styles.statValue}>${(movie.budget / 1e6).toFixed(0)}M</span>
              </div>
            )}
            {movie.revenue > 0 && (
              <div className={styles.stat}>
                <span className={styles.statLabel}>Revenue</span>
                <span className={styles.statValue}>${(movie.revenue / 1e6).toFixed(0)}M</span>
              </div>
            )}
          </div>

          {/* Actions */}
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
              onClick={() => handleAuthAction(() => toggleWatchlist(watchlistMovie))}
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
              onClick={() => handleAuthAction(() => markAsWatched(watchlistMovie))}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {watched ? 'Watched' : 'Mark as Watched'}
            </Button>
            {movie.imdb_id && (
              <Button as="a" href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank" rel="noopener noreferrer" variant="ghost" size="lg">
                IMDB
              </Button>
            )}
          </div>

          {/* AI Chat */}
          <AIChatPanel movie={{ ...movie, director }} />

          {/* Cast */}
          {credits?.cast?.length > 0 && (
            <div className={styles.block}>
              <h3 className={styles.blockLabel}>Top Cast</h3>
              <div className={styles.cast}>
                {credits.cast.slice(0, 6).map((actor) => (
                  <div key={actor.id} className={styles.castMember}>
                    <div className={styles.castAvatar}>
                      {actor.profile_path ? (
                        <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} loading="lazy" />
                      ) : (
                        <span className={styles.castAvatarFallback}>{actor.name[0]}</span>
                      )}
                    </div>
                    <span className={styles.castName}>{actor.name}</span>
                    <span className={styles.castChar}>{actor.character}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <ReviewSection movie={movie} posterUrl={posterUrl} />
        </div>
      </div>
    </div>
  );
}
