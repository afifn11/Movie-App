import { useParams } from 'react-router-dom';
import DetailMovie from '../components/features/movie/DetailMovie/DetailMovie';
import MovieGrid from '../components/features/movie/MovieGrid/MovieGrid';
import { useMovieDetail } from '../hooks/useMovieDetail';
import styles from './movie/DetailPage.module.css';

export default function DetailPage() {
  const { id } = useParams();
  const { movie, trailerKey, recommendations, credits, loading, error } = useMovieDetail(id);

  return (
    <div className={styles.page}>
      <DetailMovie
        movie={movie}
        trailerKey={trailerKey}
        credits={credits}
        loading={loading}
        error={error}
      />
      {!loading && recommendations.length > 0 && (
        <div className={`container ${styles.recs}`}>
          <MovieGrid movies={recommendations} title="More Like This" />
        </div>
      )}
    </div>
  );
}
