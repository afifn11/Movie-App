import { useContext } from "react";
import Hero from "../components/Hero/Hero";
import Movies from "../components/Movies/Movies";
import MoviesContext from "../context/MoviesContext";

function Home() {
  const { localMovies } = useContext(MoviesContext);

  return (
    <>
      <Hero />
      <Movies movies={localMovies} title="Latest Movies" />
    </>
  );
}

export default Home;