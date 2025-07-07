import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DetailMovie from "../../components/DetailMovie";
import Movies from "../../components/Movies/Movies";
import endpoints from "../../utils/constants/endpoints";

function Detail() {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function getRecommendationMovies() {
      try {
        const response = await axios.get(endpoints.recommendation(id));
        const transformed = response.data.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          year: new Date(movie.release_date).getFullYear(),
          type: "Movie",
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }));
        setMovies(transformed);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    }

    getRecommendationMovies();
  }, [id]);

  return (
    <>
      <DetailMovie />
      <Movies movies={movies} title="Recommended Movies" />
    </>
  );
}

export default Detail;