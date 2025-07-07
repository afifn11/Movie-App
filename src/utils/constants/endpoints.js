const API_KEY = import.meta.env.VITE_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

const endpoints = {
  popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
  now_playing: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
  top_rated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
  trending: `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`,
  detail: (id) => `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`,
  video: (id) => `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`,
  recommendation: (id) => `${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}`
};

export default endpoints;
