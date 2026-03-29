import Hero from '../components/features/movie/Hero/Hero';
import MovieGrid from '../components/features/movie/MovieGrid/MovieGrid';
import { useMovies } from '../context/MoviesContext';
import styles from './Home.module.css';

export default function Home() {
  const { localMovies } = useMovies();

  return (
    <>
      <Hero />
      <div className={`container ${styles.content}`}>
        <MovieGrid
          movies={localMovies}
          title="My Collection"
        />
      </div>
    </>
  );
}
