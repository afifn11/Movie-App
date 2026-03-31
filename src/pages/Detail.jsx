import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailMovie from '../components/features/movie/DetailMovie/DetailMovie';
import MovieGrid from '../components/features/movie/MovieGrid/MovieGrid';
import LoginModal from '../components/features/auth/LoginModal';
import { useMovieDetail } from '../hooks/useMovieDetail';
import styles from './movie/DetailPage.module.css';

export default function DetailPage() {
  const { id } = useParams();
  const { movie, trailerKey, recommendations, credits, loading, error } = useMovieDetail(id);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className={styles.page}>
      <DetailMovie
        movie={movie}
        trailerKey={trailerKey}
        credits={credits}
        loading={loading}
        error={error}
        onLoginRequired={() => setLoginOpen(true)}
      />
      {!loading && recommendations.length > 0 && (
        <div className={`container ${styles.recs}`}>
          <MovieGrid movies={recommendations} title="More Like This" />
        </div>
      )}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
