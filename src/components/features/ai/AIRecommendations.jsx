import { useState, useEffect } from 'react';
import { getPersonalRecommendations } from '../../../lib/gemini';
import { movieService } from '../../../services/movieService';
import { Link } from 'react-router-dom';
import styles from './AIRecommendations.module.css';

export default function AIRecommendations({ watchlist, reviews, watchHistory }) {
  const [recs, setRecs]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [fetched, setFetched] = useState(false);

  const hasEnoughData = reviews.length > 0 || watchHistory.length > 0;

  const fetchRecs = async () => {
    try {
      setLoading(true);
      setError(null);
      const raw = await getPersonalRecommendations({ watchlist, reviews, watchHistory });
      if (!raw) { setFetched(true); setLoading(false); return; }

      const enriched = await Promise.all(
        raw.map(async (rec) => {
          try {
            const data = await movieService.search(rec.searchQuery, 1);
            const match = data.results[0];
            return {
              ...rec,
              tmdbId: match?.id || null,
              poster: match?.poster_path
                ? `https://image.tmdb.org/t/p/w342${match.poster_path}`
                : null,
              tmdbRating: match?.vote_average?.toFixed(1) || null,
            };
          } catch { return { ...rec, tmdbId: null, poster: null }; }
        })
      );
      setRecs(enriched);
      setFetched(true);
    } catch (err) {
      setError('Could not load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!hasEnoughData) {
    return (
      <div className={styles.emptyState}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.09 8.26L19 9.27L15 14.14L16.18 21.02L12 17.77L7.82 21.02L9 14.14L5 9.27L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <p>Rate a few films to unlock AI-powered personal recommendations.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            <span className={styles.accent}>/</span> For You
          </h3>
          <p className={styles.subtitle}>
            AI recommendations based on your taste profile
          </p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchRecs} disabled={loading}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>
            <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {fetched ? 'Refresh' : 'Generate'}
        </button>
      </div>

      {!fetched && !loading && (
        <div className={styles.cta}>
          <p>Click <strong>Generate</strong> to get AI recommendations tailored to your taste.</p>
        </div>
      )}

      {loading && (
        <div className={styles.loadingState}>
          <span className={styles.spinner} />
          <p>Analyzing your taste profile...</p>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {recs.length > 0 && (
        <div className={styles.grid}>
          {recs.map((rec, i) => (
            <div key={i} className={styles.card}>
              {rec.poster ? (
                <img src={rec.poster} alt={rec.title} className={styles.poster} />
              ) : (
                <div className={styles.posterFallback} />
              )}
              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <h4 className={styles.filmTitle}>{rec.title}</h4>
                  <span className={styles.year}>{rec.year}</span>
                </div>
                {rec.tmdbRating && (
                  <span className={styles.rating}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    {rec.tmdbRating}
                  </span>
                )}
                <p className={styles.reason}>{rec.reason}</p>
                {rec.tmdbId && (
                  <Link to={`/movie/${rec.tmdbId}`} className={styles.link}>
                    View Details →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
