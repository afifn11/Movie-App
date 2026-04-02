import { useAuth } from '../context/AuthContext';
import { useUserReviews } from '../hooks/useReviews';
import { useWatchlistDB } from '../hooks/useWatchlistDB';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { useMovieLists } from '../hooks/useMovieLists';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import styles from './Profile.module.css';

const FALLBACK = 'https://placehold.co/40x60/111720/4a5568?text=?';

function ActivityItem({ to, posterUrl, title, sub }) {
  return (
    <Link to={to} className={styles.activityItem}>
      <img
        src={posterUrl || FALLBACK}
        alt={title}
        className={styles.activityPoster}
        onError={(e) => { e.target.src = FALLBACK; }}
      />
      <div className={styles.activityInfo}>
        <p className={styles.activityTitle}>{title}</p>
        <span className={styles.activitySub}>{sub}</span>
      </div>
    </Link>
  );
}

export default function ProfilePage() {
  const { profile, user, signOut } = useAuth();
  const { reviews }   = useUserReviews();
  const { watchlist } = useWatchlistDB();
  const { history }   = useWatchHistory();
  const { lists }     = useMovieLists();

  const name    = profile?.full_name || user?.user_metadata?.full_name || 'User';
  const avatar  = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const joined  = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

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
            {joined && <p className={styles.joined}>Member since {joined}</p>}
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
              <div className={styles.stat}>
                <span className={styles.statNum}>{lists.length}</span>
                <span className={styles.statLabel}>Lists</span>
              </div>
              {avgRating && (
                <div className={styles.stat}>
                  <span className={`${styles.statNum} ${styles.statGold}`}>⭐ {avgRating}</span>
                  <span className={styles.statLabel}>Avg Rating</span>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>Sign Out</Button>
          </div>
        </div>

        {/* Activity Grid */}
        <div className={styles.activityGrid}>

          {/* Recent Reviews */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Reviews</h2>
            </div>
            {reviews.length === 0 ? (
              <p className={styles.empty}>No reviews yet. <Link to="/" className={styles.emptyLink}>Browse films</Link></p>
            ) : (
              <div className={styles.activityList}>
                {reviews.slice(0, 6).map((r) => (
                  <ActivityItem key={r.id} to={`/movie/${r.movie_id}`}
                    posterUrl={r.poster_url} title={r.movie_title}
                    sub={`⭐ ${r.rating}/10 · ${new Date(r.created_at).toLocaleDateString()}`}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Recently Watched */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recently Watched</h2>
            </div>
            {history.length === 0 ? (
              <p className={styles.empty}>Nothing watched yet.</p>
            ) : (
              <div className={styles.activityList}>
                {history.slice(0, 6).map((h) => (
                  <ActivityItem key={h.id} to={`/movie/${h.movie_id}`}
                    posterUrl={h.poster_url} title={h.movie_title}
                    sub={new Date(h.watched_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  />
                ))}
              </div>
            )}
          </section>

          {/* My Lists */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>My Lists</h2>
              <Link to="/lists" className={styles.cardMore}>Manage →</Link>
            </div>
            {lists.length === 0 ? (
              <p className={styles.empty}><Link to="/lists" className={styles.emptyLink}>Create your first list</Link></p>
            ) : (
              <div className={styles.listCards}>
                {lists.slice(0, 4).map((l) => (
                  <Link key={l.id} to={`/lists/${l.id}`} className={styles.listCard}>
                    <div className={styles.listCardTop}>
                      <span className={styles.listName}>{l.name}</span>
                      {l.is_public && <span className={styles.publicTag}>Public</span>}
                    </div>
                    <span className={styles.listCount}>{l.list_items?.[0]?.count ?? 0} films</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Watchlist preview */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Watchlist</h2>
              <Link to="/watchlist" className={styles.cardMore}>See all →</Link>
            </div>
            {watchlist.length === 0 ? (
              <p className={styles.empty}>Your watchlist is empty.</p>
            ) : (
              <div className={styles.posterStrip}>
                {watchlist.slice(0, 8).map((w) => (
                  <Link key={w.id} to={`/movie/${w.movie_id}`} className={styles.stripItem}>
                    <img src={w.poster_url || FALLBACK} alt={w.movie_title}
                      className={styles.stripPoster}
                      onError={(e) => { e.target.src = FALLBACK; }}
                    />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
