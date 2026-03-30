import Hero from '../components/features/movie/Hero/Hero';
import MovieGrid from '../components/features/movie/MovieGrid/MovieGrid';
import { useApiMovies } from '../hooks/useApiMovies';
import styles from './Home.module.css';

export default function Home() {
  const { movies, loading } = useApiMovies('popular');

  return (
    <>
      <Hero />
      <div className={`container ${styles.content}`}>
        <MovieGrid
          movies={movies}
          title="Popular Right Now"
          loading={loading}
          showGenreFilter
        />
      </div>
    </>
  );
}
