import Hero from '../components/features/movie/Hero/Hero';
import MovieGrid from '../components/features/movie/MovieGrid/MovieGrid';
import AIRecommendations from '../components/features/ai/AIRecommendations';
import { useApiMovies } from '../hooks/useApiMovies';
import { useAuth } from '../context/AuthContext';
import { useWatchlistDB } from '../hooks/useWatchlistDB';
import { useUserReviews } from '../hooks/useReviews';
import { useWatchHistory } from '../hooks/useWatchHistory';
import styles from './Home.module.css';

export default function Home() {
  const { movies, loading } = useApiMovies('popular');
  const { isAuthenticated } = useAuth();
  const { watchlist } = useWatchlistDB();
  const { reviews } = useUserReviews();
  const { history } = useWatchHistory();

  const hasPersonalData = reviews.length > 0 || history.length > 0;

  return (
    <>
      <Hero />
      <div className={`container ${styles.content}`}>

        {/* AI For You — tampil jika login dan punya data */}
        {isAuthenticated && hasPersonalData && (
          <section className={styles.forYouSection}>
            <AIRecommendations
              watchlist={watchlist}
              reviews={reviews}
              watchHistory={history}
            />
          </section>
        )}

        {/* Popular movies grid */}
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
