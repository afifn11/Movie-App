import { useEffect, useState } from 'react';
import { movieService, getTrailerKey, IMG } from '../../../../services/movieService';
import Button from '../../../ui/Button/Button';
import Badge from '../../../ui/Badge/Badge';
import { HeroSkeleton } from '../../../ui/Skeleton/Skeleton';
import styles from './Hero.module.css';

export default function Hero() {
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchHeroMovie() {
      try {
        const trending = await movieService.getTrending();
        const first = trending.results[0];

        const [detail, videos] = await Promise.all([
          movieService.getDetail(first.id),
          movieService.getVideos(first.id),
        ]);

        if (!cancelled) {
          setMovie(detail);
          setGenres(detail.genres?.slice(0, 3).map((g) => g.name) ?? []);
          setTrailerKey(getTrailerKey(videos));
        }
      } catch (err) {
        console.error('Hero fetch error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchHeroMovie();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <HeroSkeleton />;
  if (!movie) return null;

  const backdropUrl = IMG.backdrop(movie.backdrop_path);
  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';

  return (
    <div className={styles.hero}>
      {/* Backdrop */}
      {backdropUrl && (
        <div className={styles.backdrop}>
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className={styles.backdropImg}
          />
        </div>
      )}

      {/* Gradient overlays */}
      <div className={styles.gradientBottom} />
      <div className={styles.gradientLeft} />
      <div className={styles.noise} />

      {/* Content */}
      <div className={`container ${styles.content}`}>
        <div className={styles.inner}>
          {/* Badges */}
          <div className={styles.badges}>
            <Badge variant="accent">🔥 Trending Now</Badge>
            {rating && (
              <Badge variant="rating">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                {rating}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className={styles.title}>{movie.title}</h1>

          {/* Meta */}
          <div className={styles.meta}>
            {year && <span className={styles.metaItem}>{year}</span>}
            {runtime && (
              <>
                <span className={styles.metaDot}>·</span>
                <span className={styles.metaItem}>{runtime}</span>
              </>
            )}
            {genres.length > 0 && (
              <>
                <span className={styles.metaDot}>·</span>
                <span className={styles.metaItem}>{genres.join(', ')}</span>
              </>
            )}
          </div>

          {/* Overview */}
          <p className={styles.overview}>{movie.overview}</p>

          {/* Actions */}
          <div className={styles.actions}>
            {trailerKey && (
              <Button
                as="a"
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3L19 12L5 21V3Z"/>
                </svg>
                Watch Trailer
              </Button>
            )}
            <Button
              as="a"
              href={`/movie/${movie.id}`}
              variant="secondary"
              size="lg"
            >
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
