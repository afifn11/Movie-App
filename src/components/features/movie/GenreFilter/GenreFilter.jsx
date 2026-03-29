import styles from './GenreFilter.module.css';

export default function GenreFilter({ genres = [], activeGenre, onChange }) {
  if (genres.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
        <button
          className={`${styles.chip} ${!activeGenre ? styles.chipActive : ''}`}
          onClick={() => onChange(null)}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`${styles.chip} ${activeGenre === genre.id ? styles.chipActive : ''}`}
            onClick={() => onChange(genre.id === activeGenre ? null : genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}
