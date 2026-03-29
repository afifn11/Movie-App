import { useNavigate } from 'react-router-dom';
import AddMovieForm from '../components/features/movie/AddMovieForm/AddMovieForm';
import { useMovies } from '../context/MoviesContext';

export default function CreatePage() {
  const { addMovie } = useMovies();
  const navigate = useNavigate();

  const handleSubmit = (newMovie) => {
    addMovie(newMovie);
    navigate('/');
  };

  return <AddMovieForm onSubmit={handleSubmit} />;
}
