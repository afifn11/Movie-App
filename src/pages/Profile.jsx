import { useAuth } from '../context/AuthContext';
import { useUserReviews } from '../hooks/useReviews';
import { useWatchlistDB } from '../hooks/useWatchlistDB';
import { useWatchHistory } from '../hooks/useWatchHistory';
import AIRecommendations from '../components/features/ai/AIRecommendations';
import MoodPicker from '../components/features/ai/MoodPicker';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const { reviews } = useUserReviews();
  const { watchlist } = useWatchlistDB();
  const { history } = useWatchHistory();

  const name   = profile?.full_name || user?.user_metadata?.full_name || 'User';
  const avatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + parseFloat(r.rating), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className={styles.page}>
      <div className={`container ${styles.container}`}>

        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrap}>
            {avatar ? (
              <img src={avatar} alt={name} className={styles.avatar} />
            ) : (
              <span className={styles.avatarInitials}>{initials}</span>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{name}</h1>
            <p className={styles.email}>{user?.email}</p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{watchlist.length}</span>
                <span className={styles.statLabel}>Watchlist</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>{history.length}</span>
                <span className={styles.statLabel}>Watched</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>{reviews.length}</span>
                <span className={styles.statLabel}>Reviews</span>
              </div>
              {avgRating && (
                <div className={styles.stat}>
                  <span className={`${styles.statNum} ${styles.statGold}`}>⭐ {avgRating}</span>
                  <span className={styles.statLabel}>Avg Rating</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Left */}
          <div className={styles.mainCol}>
            {/* AI Recommendations */}
            <section className={styles.section}>
              <AIRecommendations
                watchlist={watchlist}
                reviews={reviews}
                watchHistory={history}
              />
            </section>

            {/* Mood Picker */}
            <section className={styles.section}>
              <MoodPicker watchHistory={history} />
            </section>
          </div>

          {/* Right */}
          <div className={styles.sideCol}>
            {/* Recent Reviews */}
            {reviews.length > 0 && (
              <section className={styles.sideSection}>
                <h3 className={styles.sideTitle}>Recent Reviews</h3>
                <div className={styles.reviewList}>
                  {reviews.slice(0, 5).map((r) => (
                    <Link key={r.id} to={`/movie/${r.movie_id}`} className={styles.reviewItem}>
                      {r.poster_url ? (
                        <img src={r.poster_url} alt={r.movie_title} className={styles.reviewPoster} />
                      ) : (
                        <div className={styles.reviewPosterFallback} />
                      )}
                      <div className={styles.reviewInfo}>
                        <p className={styles.reviewTitle}>{r.movie_title}</p>
                        <span className={styles.reviewRating}>⭐ {r.rating}/10</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Recent History */}
            {history.length > 0 && (
              <section className={styles.sideSection}>
                <h3 className={styles.sideTitle}>Recently Watched</h3>
                <div className={styles.reviewList}>
                  {history.slice(0, 5).map((h) => (
                    <Link key={h.id} to={`/movie/${h.movie_id}`} className={styles.reviewItem}>
                      {h.poster_url ? (
                        <img src={h.poster_url} alt={h.movie_title} className={styles.reviewPoster} />
                      ) : (
                        <div className={styles.reviewPosterFallback} />
                      )}
                      <div className={styles.reviewInfo}>
                        <p className={styles.reviewTitle}>{h.movie_title}</p>
                        <span className={styles.reviewDate}>
                          {new Date(h.watched_at).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
