import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MovieCard.module.css';

const FALLBACK = 'https://placehold.co/400x600/111720/4a5568?text=No+Image';

export default function MovieCard({ id, title, year, type, poster, rating }) {
  const [imgSrc, setImgSrc] = useState(poster || FALLBACK);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link to={`/movie/${id}`} className={styles.card} title={title}>
      <div className={styles.posterWrap}>
        {/* Skeleton shimmer while loading */}
        {!imgLoaded && <div className={styles.imgSkeleton} />}

        <img
          src={imgSrc}
          alt={`${title} poster`}
          className={`${styles.poster} ${imgLoaded ? styles.posterVisible : ''}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgSrc(FALLBACK); setImgLoaded(true); }}
        />

        {/* Hover overlay */}
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <span className={styles.viewBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              View Details
            </span>
          </div>
        </div>

        {/* Rating badge */}
        {rating && rating !== 'N/A' && (
          <div className={styles.ratingBadge}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            {rating}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          {year && <span className={styles.year}>{year}</span>}
          {type && <span className={styles.type}>{type}</span>}
        </div>
      </div>
    </Link>
  );
}
