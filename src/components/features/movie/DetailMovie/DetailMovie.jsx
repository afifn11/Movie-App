import { useState } from 'react';
import { ErrorState } from '../../../ui/StateViews/StateViews';
import { DetailSkeleton } from '../../../ui/Skeleton/Skeleton';
import { IMG } from '../../../../services/movieService';
import { useWatchlistDB } from '../../../../hooks/useWatchlistDB';
import { useWatchHistory } from '../../../../hooks/useWatchHistory';
import { useAuth } from '../../../../context/AuthContext';
import AddToListModal from '../../lists/AddToListModal';
import ReviewSection from '../../review/ReviewSection';
import AIChatPanel from '../../ai/AIChatPanel';
import styles from './DetailMovie.module.css';

// 🛡️ Mengimpor Sub-Komponen yang Diekstrak (SRP)
import MoviePoster from './MoviePoster';
import MovieMeta from './MovieMeta';
import MovieStats from './MovieStats';
import MovieActions from './MovieActions';
import MovieCast from './MovieCast';

export default function DetailMovie({ movie, trailerKey, credits, loading, error, onLoginRequired }) {
  // 🛡️ SEMUA hook harus dipanggil di sini, di atas, SEBELUM early return apa pun.
  const { isAuthenticated } = useAuth();
  const [listModalOpen, setListModalOpen] = useState(false);
  const [actionError, setActionError] = useState(null);
  const { isInWatchlist, toggleWatchlist } = useWatchlistDB();
  const { markAsWatched, hasWatched } = useWatchHistory();

  if (loading) return <div className="container"><DetailSkeleton /></div>;
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
    try {
      setActionError(null);
      await action();
    } catch (err) {
      console.error('Action failed:', err);
      setActionError('Something went wrong. Please try again.');
    }
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

        {/* Kolom Poster Terpisah */}
        <div className={styles.posterCol}>
          <MoviePoster posterUrl={posterUrl} title={movie.title} rating={rating} />
        </div>

        {/* Kolom Konten Utama */}
        <div className={styles.infoCol}>
          <MovieMeta
            title={movie.title}
            tagline={movie.tagline}
            year={year}
            runtime={runtime}
            status={movie.status}
            watched={watched}
            genres={movie.genres}
            overview={movie.overview}
          />

          <MovieStats
            director={director}
            voteCount={movie.vote_count}
            budget={movie.budget}
            revenue={movie.revenue}
          />

          <MovieActions
            trailerKey={trailerKey}
            saved={saved}
            watched={watched}
            imdbId={movie.imdb_id}
            isAuthenticated={isAuthenticated}
            onToggleWatchlist={() => handleAuthAction(() => toggleWatchlist(watchlistMovie))}
            onMarkWatched={() => handleAuthAction(() => markAsWatched(watchlistMovie))}
            onAddToList={() => setListModalOpen(true)}
            shareTitle={movie.title}
            shareText={`Check out "${movie.title}"${year ? ` (${year})` : ''} on Netfif Cinema!`}
            shareUrl={`${window.location.origin}/movie/${movie.id}`}
          />

          {actionError && <p className={styles.actionError}>{actionError}</p>}

          <AIChatPanel movie={{ ...movie, director }} />

          <MovieCast cast={credits?.cast} />

          <ReviewSection movie={movie} posterUrl={posterUrl} />
        </div>
      </div>

      {/* Modal Terpisah */}
      <AddToListModal
        isOpen={listModalOpen}
        onClose={() => setListModalOpen(false)}
        movie={watchlistMovie}
      />
    </div>
  );
}