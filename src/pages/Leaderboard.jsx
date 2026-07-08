import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLeaderboard } from '../hooks/useLeaderboard';
import CriticBadge from '../components/ui/CriticBadge/CriticBadge';
import Avatar from '../components/ui/Avatar/Avatar';
import { PageLoader, ErrorState } from '../components/ui/StateViews/StateViews';
import styles from './Leaderboard.module.css';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { t } = useTranslation();
  const { entries, loading, error } = useLeaderboard(50);

  if (loading) return <PageLoader message="Loading leaderboard..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.heading}>Top Critics</h1>
      <p className={styles.empty}>{t('leaderboard.empty')}</p>

      {entries.length === 0 ? (
        <p className={styles.empty}>No reviews yet. Be the first to climb the leaderboard!</p>
      ) : (
        <div className={styles.list}>
          {entries.map((entry, index) => {
            return (
              <div key={entry.id} className={styles.row}>
                <div className={styles.rank}>
                  {index < 3 ? MEDALS[index] : `#${index + 1}`}
                </div>

                <Avatar src={entry.avatar_url} name={entry.full_name || t('leaderboard.anonymous')} size={44} />

                <div className={styles.info}>
                  <div className={styles.nameRow}>
                    <span className={styles.name}>{entry.full_name || t('leaderboard.anonymous')}</span>
                    <CriticBadge rank={entry.critic_rank} compact />
                  </div>
                  <div className={styles.stats}>
                    {t('leaderboard.review', { count: entry.review_count })}
                    {entry.longest_streak > 1 && ` · ${t('leaderboard.streakDays', { count: entry.longest_streak })}`}
                    {entry.badge_count > 0 && ` · ${t('leaderboard.badge', { count: entry.badge_count })}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className={styles.footerNote}>
        {t('leaderboard.footerNote')} <Link to="/">{t('leaderboard.findMovie')}</Link>.
      </p>
    </div>
  );
}