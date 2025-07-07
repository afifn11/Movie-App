import styles from "./Movies.module.css";
import Movie from "../Movie/Movie";

function Movies({ movies, title = "Latest Movies" }) {
  return (
    <div className={styles.container}>
      <section className={styles.movies}>
        <h2 className={styles.movies__title}>{title}</h2>

        {movies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No movies found.</p>
          </div>
        ) : (
          <div className={styles.movies__container}>
            {movies.map((movie) => (
              <Movie
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                type={movie.type}
                poster={movie.poster}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Movies;