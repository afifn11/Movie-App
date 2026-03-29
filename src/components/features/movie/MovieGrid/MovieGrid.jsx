import MovieCard from '../MovieCard/MovieCard';
import { MovieCardSkeleton } from '../../../ui/Skeleton/Skeleton';
import { EmptyState } from '../../../ui/StateViews/StateViews';
import styles from './MovieGrid.module.css';

export default function MovieGrid({
  movies = [],
  title,
  loading = false,
  skeletonCount = 12,
}) {
  return (
    <section className={styles.section}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleAccent}>/</span> {title}
          </h2>
        </div>
      )}

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <EmptyState message="No movies to display." />
      ) : (
        <div className={styles.grid}>
          {movies.map((movie, i) => (
            <div
              key={movie.id}
              className={styles.cardWrapper}
              style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
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
      )}
    </section>
  );
}
