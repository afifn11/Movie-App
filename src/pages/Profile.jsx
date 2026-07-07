import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useUserReviews } from '../hooks/useReviews';
import { useWatchlistDB } from '../hooks/useWatchlistDB';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { useMovieLists } from '../hooks/useMovieLists';
import { useUserBadges } from '../hooks/useUserBadges';
import { Link, Navigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import Avatar from '../components/ui/Avatar/Avatar';
import CriticBadge from '../components/ui/CriticBadge/CriticBadge';
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
  const { t } = useTranslation();
  const { profile, user, signOut, loading: authLoading } = useAuth();
  const { reviews }   = useUserReviews();
  const { watchlist } = useWatchlistDB();
  const { history }   = useWatchHistory();
  const { lists }     = useMovieLists();
  const { badges: earnedBadges, loading: badgesLoading } = useUserBadges(user?.id);

  if (!user && !authLoading) {
    return <Navigate to="/" replace />;
  }

  if (authLoading) {
    return <div className={styles.page}><div className="container">{t('profile.loading')}</div></div>;
  }

  const name    = profile?.full_name || user?.user_metadata?.full_name || 'User';
  const avatar  = profile?.avatar_url || user?.user_metadata?.avatar_url;
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
            <Avatar src={avatar} name={name} size={88} />
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>{name}</h1>
              {profile?.critic_rank && <CriticBadge rank={profile.critic_rank} />}
            </div>
            <p className={styles.email}>{user?.email}</p>
            {joined && <p className={styles.joined}>Member since {joined}</p>}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{watchlist.length}</span>
                <span className={styles.statLabel}>{t('profile.watchlist')}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>{history.length}</span>
                <span className={styles.statLabel}>{t('profile.watched')}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>{reviews.length}</span>
                <span className={styles.statLabel}>{t('profile.reviews')}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>{lists.length}</span>
                <span className={styles.statLabel}>{t('profile.lists')}</span>
              </div>
              {avgRating && (
                <div className={styles.stat}>
                  <span className={`${styles.statNum} ${styles.statGold}`}>⭐ {avgRating}</span>
                  <span className={styles.statLabel}>{t('profile.avgRating')}</span>
                </div>
              )}
              {profile?.longest_streak > 1 && (
                <div className={styles.stat}>
                  <span className={styles.statNum}>🔥 {profile.longest_streak}</span>
                  <span className={styles.statLabel}>{t('profile.bestStreak')}</span>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>{t('profile.signOut')}</Button>
          </div>
        </div>

        {/* Badges Earned */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Badges Earned</h2>
            <Link to="/leaderboard" className={styles.cardMore}>Leaderboard →</Link>
          </div>
          {badgesLoading ? (
            <p className={styles.empty}>Loading badges...</p>
          ) : earnedBadges.length === 0 ? (
            <p className={styles.empty}>No badges yet. Write your first review to earn one!</p>
          ) : (
            <div className={styles.badgeGrid}>
              {earnedBadges.map((eb) => (
                <div key={eb.badge_id} className={styles.badgeItem} title={eb.badges?.description}>
                  <span className={styles.badgeIcon}>{eb.badges?.icon}</span>
                  <span className={styles.badgeName}>{eb.badges?.name}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Activity Grid */}
        <div className={styles.activityGrid}>

          {/* Recent Reviews */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{t('profile.recentReviews')}</h2>
            </div>
            {reviews.length === 0 ? (
              <p className={styles.empty}>{t('profile.noReviewsYet')} <Link to="/" className={styles.emptyLink}>{t('profile.browseFilms')}</Link></p>
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
              <h2 className={styles.cardTitle}>{t('profile.recentlyWatched')}</h2>
            </div>
            {history.length === 0 ? (
              <p className={styles.empty}>{t('profile.nothingWatchedYet')}</p>
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
              <h2 className={styles.cardTitle}>{t('profile.myLists')}</h2>
              <Link to="/lists" className={styles.cardMore}>Manage →</Link>
            </div>
            {lists.length === 0 ? (
              <p className={styles.empty}><Link to="/lists" className={styles.emptyLink}>{t('profile.createFirstList')}</Link></p>
            ) : (
              <div className={styles.listCards}>
                {lists.slice(0, 4).map((l) => (
                  <Link key={l.id} to={`/lists/${l.id}`} className={styles.listCard}>
                    <div className={styles.listCardTop}>
                      <span className={styles.listName}>{l.name}</span>
                      {l.is_public && <span className={styles.publicTag}>{t('profile.public')}</span>}
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
              <h2 className={styles.cardTitle}>{t('profile.watchlist')}</h2>
              <Link to="/watchlist" className={styles.cardMore}>See all →</Link>
            </div>
            {watchlist.length === 0 ? (
              <p className={styles.empty}>{t('profile.watchlistEmpty')}</p>
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