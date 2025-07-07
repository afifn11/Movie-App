import { useEffect, useState } from "react";
import {
  Container,
  HeroSection,
  HeroLeft,
  HeroRight,
  Title,
  Genre,
  Description,
  Image,
  LoadingText,
} from "./Hero.styled";
import Button from "../ui/Button";
import endpoints from "../../utils/constants/endpoints";

const API_KEY = import.meta.env.VITE_API_KEY;

function Hero() {
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    getTrendingMovie();
  }, []);

  async function getTrendingMovie() {
    try {
      // 1. Ambil movie trending
      const res = await fetch(endpoints.trending);
      const data = await res.json();
      const firstMovie = data.results[0];

      // 2. Ambil detail lengkap movie (termasuk genres)
      const detailRes = await fetch(`https://api.themoviedb.org/3/movie/${firstMovie.id}?api_key=${API_KEY}`);
      const detailData = await detailRes.json();
      setMovie(detailData);
      setGenreList(detailData.genres.map((genre) => genre.name));

      // 3. Ambil trailer YouTube
      const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${firstMovie.id}/videos?api_key=${API_KEY}`);
      const videoData = await videoRes.json();
      const trailer = videoData.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      if (trailer) setTrailerKey(trailer.key);
    } catch (error) {
      console.error("Error fetching movie/trailer/genres:", error);
    }
  }

  if (!movie) {
    return <LoadingText>Loading...</LoadingText>;
  }

  return (
    <Container>
      <HeroSection>
        <HeroLeft>
          <Title>{movie.title}</Title>
          <Genre>Genre: {genreList.length > 0 ? genreList.join(", ") : "N/A"}</Genre>
          <Description>{movie.overview}</Description>
          {trailerKey && (
            <a
              href={`https://www.youtube.com/watch?v=${trailerKey}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Button variant="primary" size="md">Watch Trailer</Button>
            </a>
          )}
        </HeroLeft>
        <HeroRight>
          <Image
            src={
              movie.backdrop_path
                ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                : "https://via.placeholder.com/500x300?text=No+Image"
            }
            alt={movie.title}
          />
        </HeroRight>
      </HeroSection>
    </Container>
  );
}

export default Hero;
