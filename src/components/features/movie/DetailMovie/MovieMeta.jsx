import Badge from '../../../ui/Badge/Badge';
import styles from './DetailMovie.module.css';

export default function MovieMeta({ title, tagline, year, runtime, status, watched, genres, overview }) {
  return (
    <>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        {tagline && <p className={styles.tagline}>"{tagline}"</p>}
      </div>

      <div className={styles.metaRow}>
        {year && <span className={styles.metaChip}>{year}</span>}
        {runtime && <span className={styles.metaChip}>{runtime}</span>}
        {status && (
          <span className={`${styles.metaChip} ${status === 'Released' ? styles.metaGreen : ''}`}>
            {status}
          </span>
        )}
        {watched && <span className={`${styles.metaChip} ${styles.metaWatched}`}>✓ Watched</span>}
      </div>

      {genres?.length > 0 && (
        <div className={styles.genres}>
          {genres.map((g) => <Badge key={g.id} variant="genre">{g.name}</Badge>)}
        </div>
      )}

      <div className={styles.block}>
        <h3 className={styles.blockLabel}>Overview</h3>
        <p className={styles.overview}>{overview || 'No overview available.'}</p>
      </div>
    </>
  );
}