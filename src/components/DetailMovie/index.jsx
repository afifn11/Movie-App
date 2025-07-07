import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../ui/Button";
import StyledDetailMovie from "./DetailMovie.styled";
import endpoints from "../../utils/constants/endpoints";

function DetailMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    async function fetchMovieDetail() {
      try {
        const res = await fetch(endpoints.detail(id));
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Gagal fetch detail:", err);
      }
    }

    async function fetchTrailer() {
      try {
        const res = await fetch(endpoints.video(id));
        const data = await res.json();
        const trailer = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (err) {
        console.error("Gagal fetch trailer:", err);
      }
    }

    fetchMovieDetail();
    fetchTrailer();
  }, [id]);

  if (!movie) return <p style={{ textAlign: "center" }}>Loading detail movie...</p>;

  return (
    <StyledDetailMovie>
      <div className="poster">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image"
          }
          alt={movie.title}
        />
      </div>

      <div className="info">
        <h2>{movie.title}</h2>
        <h3>
          Genres:{" "}
          {movie.genres && movie.genres.length > 0
            ? movie.genres.map((g) => g.name).join(", ")
            : "N/A"}
        </h3>
        <p>{movie.overview}</p>

        {trailerKey && (
          <a
            href={`https://www.youtube.com/watch?v=${trailerKey}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary">Watch Trailer</Button>
          </a>
        )}
      </div>
    </StyledDetailMovie>
  );
}

export default DetailMovie;