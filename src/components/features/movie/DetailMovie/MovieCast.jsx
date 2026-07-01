import styles from './DetailMovie.module.css';

export default function MovieCast({ cast }) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className={styles.block}>
      <h3 className={styles.blockLabel}>Top Cast</h3>
      <div className={styles.cast}>
        {cast.slice(0, 6).map((actor) => (
          <div key={actor.id} className={styles.castMember}>
            <div className={styles.castAvatar}>
              {actor.profile_path ? (
                <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} loading="lazy" />
              ) : (
                <span className={styles.castAvatarFallback}>{actor.name[0]}</span>
              )}
            </div>
            <span className={styles.castName}>{actor.name}</span>
            <span className={styles.castChar}>{actor.character}</span>
          </div>
        ))}
      </div>
    </div>
  );
}