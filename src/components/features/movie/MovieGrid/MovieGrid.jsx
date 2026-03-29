import { useState, useEffect } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import GenreFilter from '../GenreFilter/GenreFilter';
import { MovieCardSkeleton } from '../../../ui/Skeleton/Skeleton';
import { EmptyState } from '../../../ui/StateViews/StateViews';
import Button from '../../../ui/Button/Button';
import { movieService } from '../../../../services/movieService';
import styles from './MovieGrid.module.css';

export default function MovieGrid({
  movies = [],
  title,
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  showGenreFilter = false,
  skeletonCount = 12,
}) {
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);

  useEffect(() => {
    if (!showGenreFilter) return;
    movieService.getGenres()
      .then((data) => setGenres(data.genres || []))
      .catch(() => {});
  }, [showGenreFilter]);

  const filtered = activeGenre
    ? movies.filter((m) =>
        m.genre_ids?.includes(activeGenre) ||
        m.type === genres.find((g) => g.id === activeGenre)?.name
      )
    : movies;

  return (
    <section className={styles.section}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleAccent}>/</span> {title}
          </h2>
          {!loading && movies.length > 0 && (
            <span className={styles.count}>{filtered.length} films</span>
          )}
        </div>
      )}

      {showGenreFilter && (
        <GenreFilter
          genres={genres}
          activeGenre={activeGenre}
          onChange={setActiveGenre}
        />
      )}

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState message={activeGenre ? 'No movies match this genre.' : 'No movies to display.'} />
      ) : (
        <>
          <div className={styles.grid}>
            {filtered.map((movie, i) => (
              <div
                key={movie.id}
                className={styles.cardWrapper}
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              >
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  year={movie.year}
                  type={movie.type}
                  poster={movie.poster}
                  rating={movie.rating}
                />
              </div>
            ))}
          </div>

          {/* Load More */}
          {onLoadMore && hasMore && (
            <div className={styles.loadMore}>
              <Button
                variant="secondary"
                size="lg"
                onClick={onLoadMore}
                loading={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
