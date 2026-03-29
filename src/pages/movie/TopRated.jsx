import Hero from '../../components/features/movie/Hero/Hero';
import MovieGrid from '../../components/features/movie/MovieGrid/MovieGrid';
import { ErrorState } from '../../components/ui/StateViews/StateViews';
import { useApiMovies } from '../../hooks/useApiMovies';
import styles from '../MovieListPage.module.css';

export default function TopRatedPage() {
  const { movies, loading, error, retry } = useApiMovies('topRated');

  if (error && !loading) return <ErrorState message={error} onRetry={retry} />;

  return (
    <>
      <Hero />
      <div className={`container ${styles.content}`}>
        <MovieGrid movies={movies} title="Top Rated" loading={loading} />
      </div>
    </>
  );
}
