import { createContext, useState } from 'react';
import data from '../utils/constants/data';

// 1. Buat context-nya
const MoviesContext = createContext();

// 2. Buat provider-nya
function MoviesProvider({ children }) {
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
}

// 3. Ekspor keduanya
export { MoviesContext, MoviesProvider };
export default MoviesContext;