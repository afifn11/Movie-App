import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import Movies from "../../components/Movies/Movies";
import Hero from "../../components/Hero/Hero";
import endpoints from "../../utils/constants/endpoints";
import { MoviesContext } from '../../context/MoviesContext';

function TopRatedMovie() {
  const { apiMovies, setApiMovies } = useContext(MoviesContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(endpoints.top_rated);

      const transformed = response.data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        year: new Date(movie.release_date).getFullYear(),
        type: movie.genre_ids.length > 0 ? "Movie" : "Unknown",
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://via.placeholder.com/500x750?text=No+Image",
      }));

      setApiMovies(prev => ({
        ...prev,
        topRated: transformed
      }));
      setError(null);
    } catch (err) {
      console.error("Error fetching top rated movies:", err);
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [setApiMovies]);

  useEffect(() => {
    if (apiMovies.topRated.length === 0) {
      fetchMovies();
    } else {
      setLoading(false);
    }
  }, [apiMovies.topRated.length, fetchMovies]);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading Top Rated Movies...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchMovies} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Hero movie={apiMovies.topRated[0]} />
      <Movies movies={apiMovies.topRated} title="Top Rated Movies" />
    </>
  );
}

export default TopRatedMovie;