import Hero from '../../components/features/movie/Hero/Hero';
import MovieGrid from '../../components/features/movie/MovieGrid/MovieGrid';
import { ErrorState } from '../../components/ui/StateViews/StateViews';
import { useApiMovies } from '../../hooks/useApiMovies';
import styles from '../MovieListPage.module.css';

export default function TopRatedPage() {
  const { movies, loading, loadingMore, error, hasMore, loadMore } = useApiMovies('topRated');

  if (error && !loading) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <>
      <Hero />
      <div className={`container ${styles.content}`}>
        <MovieGrid
          movies={movies}
          title="Top Rated"
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          showGenreFilter
        />
      </div>
    </>
  );
}
