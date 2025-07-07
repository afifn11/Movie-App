import { useState } from 'react';
import MoviesContext from './MoviesContext';
import data from '../utils/constants/data';

const MoviesProvider = ({ children }) => {
  const [localMovies, setLocalMovies] = useState(data);
  const [apiMovies, setApiMovies] = useState({
    popular: [],
    nowPlaying: [],
    topRated: []
  });
  
  return (
    <MoviesContext.Provider value={{ 
      localMovies, 
      setLocalMovies,
      apiMovies,
      setApiMovies
    }}>
      {children}
    </MoviesContext.Provider>
  );
};

export default MoviesProvider;