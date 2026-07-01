import styles from './DetailMovie.module.css';

export default function MovieStats({ director, voteCount, budget, revenue }) {
  return (
    <div className={styles.stats}>
      {director && (
        <div className={styles.stat}>
          <span className={styles.statLabel}>Director</span>
          <span className={styles.statValue}>{director}</span>
        </div>
      )}
      {voteCount > 0 && (
        <div className={styles.stat}>
          <span className={styles.statLabel}>Votes</span>
          <span className={styles.statValue}>{voteCount.toLocaleString()}</span>
        </div>
      )}
      {budget > 0 && (
        <div className={styles.stat}>
          <span className={styles.statLabel}>Budget</span>
          <span className={styles.statValue}>${(budget / 1e6).toFixed(0)}M</span>
        </div>
      )}
      {revenue > 0 && (
        <div className={styles.stat}>
          <span className={styles.statLabel}>Revenue</span>
          <span className={styles.statValue}>${(revenue / 1e6).toFixed(0)}M</span>
        </div>
      )}
    </div>
  );
}