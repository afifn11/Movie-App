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

export function DetailSkeleton() {
  return (
    <div className={styles.detailSkeleton}>
      <div className={styles.detailPosterCol}>
        <Skeleton className={styles.detailPoster} />
      </div>
      <div className={styles.detailInfoCol}>
        <Skeleton className={styles.detailTitle} />
        <Skeleton className={styles.detailTagline} />
        <div className={styles.detailMetaRow}>
          <Skeleton className={styles.detailChip} />
          <Skeleton className={styles.detailChip} />
          <Skeleton className={styles.detailChip} />
        </div>
        <Skeleton className={styles.detailOverview} />
        <Skeleton className={styles.detailOverviewLine} />
        <Skeleton className={styles.detailOverviewLine} />
        <div className={styles.detailStatsRow}>
          <Skeleton className={styles.detailStat} />
          <Skeleton className={styles.detailStat} />
          <Skeleton className={styles.detailStat} />
          <Skeleton className={styles.detailStat} />
        </div>
        <div className={styles.detailActionsRow}>
          <Skeleton className={styles.detailAction} />
          <Skeleton className={styles.detailAction} />
          <Skeleton className={styles.detailAction} />
        </div>
      </div>
    </div>
  );
}