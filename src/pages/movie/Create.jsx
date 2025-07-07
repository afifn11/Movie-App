// src/pages/movie/Create.jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AddMovieForm from "../../components/AddMovieForm/AddMovieForm";
import Hero from "../../components/Hero/Hero";
import { MoviesContext } from '../../context/MoviesContext';

function CreateMovie() {
  const { localMovies, setLocalMovies } = useContext(MoviesContext);
  const navigate = useNavigate();

  const handleSubmit = (newMovie) => {
    setLocalMovies([...localMovies, newMovie]);
    navigate('/');
  };

  return (
    <>
      <Hero />
      <AddMovieForm onSubmit={handleSubmit} />
    </>
  );
}

export default CreateMovie;