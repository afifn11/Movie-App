import styles from './Skeleton.module.css';

export function Skeleton({ className = '', style = {} }) {
  return <div className={`${styles.skeleton} ${className}`} style={style} aria-hidden="true" />;
}

export function MovieCardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <Skeleton className={styles.posterSkeleton} />
      <div className={styles.contentSkeleton}>
        <Skeleton className={styles.titleSkeleton} />
        <Skeleton className={styles.metaSkeleton} />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className={styles.heroSkeleton}>
      <Skeleton className={styles.heroBg} />
    </div>
  );
}
