import { Link } from 'react-router-dom';
import { useLeaderboard } from '../hooks/useLeaderboard';
import CriticBadge from '../components/ui/CriticBadge/CriticBadge';
import { PageLoader, ErrorState } from '../components/ui/StateViews/StateViews';
import styles from './Leaderboard.module.css';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { entries, loading, error } = useLeaderboard(50);

  if (loading) return <PageLoader message="Loading leaderboard..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.heading}>Top Critics</h1>
      <p className={styles.subheading}>Ranked by total reviews written on Netfif Cinema.</p>

      {entries.length === 0 ? (
        <p className={styles.empty}>No reviews yet. Be the first to climb the leaderboard!</p>
      ) : (
        <div className={styles.list}>
          {entries.map((entry, index) => {
            const initials = (entry.full_name || 'A').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
            return (
              <div key={entry.id} className={styles.row}>
                <div className={styles.rank}>
                  {index < 3 ? MEDALS[index] : `#${index + 1}`}
                </div>

                {entry.avatar_url ? (
                  <img src={entry.avatar_url} alt={entry.full_name} className={styles.avatar} />
                ) : (
                  <span className={styles.initials}>{initials}</span>
                )}

                <div className={styles.info}>
                  <div className={styles.nameRow}>
                    <span className={styles.name}>{entry.full_name || 'Anonymous'}</span>
                    <CriticBadge rank={entry.critic_rank} compact />
                  </div>
                  <div className={styles.stats}>
                    {entry.review_count} review{entry.review_count !== 1 ? 's' : ''}
                    {entry.longest_streak > 1 && ` · 🔥 ${entry.longest_streak} day streak`}
                    {entry.badge_count > 0 && ` · 🏅 ${entry.badge_count} badge${entry.badge_count !== 1 ? 's' : ''}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className={styles.footerNote}>
        Want to climb the ranks? <Link to="/">Find a movie to review</Link>.
      </p>
    </div>
  );
}