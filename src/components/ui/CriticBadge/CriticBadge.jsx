import styles from './CriticBadge.module.css';

const RANK_STYLES = {
  'Casual Viewer':   styles.rankCasual,
  'Film Enthusiast': styles.rankEnthusiast,
  'Critic':          styles.rankCritic,
  'Senior Critic':   styles.rankSenior,
  'Master Critic':   styles.rankMaster,
};

export default function CriticBadge({ rank, compact = false }) {
  if (!rank) return null;
  const rankClass = RANK_STYLES[rank] || styles.rankCasual;

  return (
    <span className={`${styles.badge} ${rankClass} ${compact ? styles.badgeCompact : ''}`}>
      {rank}
    </span>
  );
}