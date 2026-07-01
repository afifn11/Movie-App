import styles from './DetailMovie.module.css';

export default function MoviePoster({ posterUrl, title, rating }) {
  return (
    <div className={styles.posterWrap}>
      <img
        src={posterUrl || 'https://placehold.co/400x600/111720/4a5568?text=No+Image'}
        alt={`${title} poster`}
        className={styles.poster}
      />
      {rating && (
        <div className={styles.ratingPill}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          <span>{rating}</span>
          <span className={styles.ratingMax}>/10</span>
        </div>
      )}
    </div>
  );
}