const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const IMG = {
  poster: (path) => path ? `${IMAGE_BASE}/w500${path}` : null,
  backdrop: (path) => path ? `${IMAGE_BASE}/w1280${path}` : null,
  posterSm: (path) => path ? `${IMAGE_BASE}/w342${path}` : null,
};

const buildUrl = (path, params = {}) => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
};

const apiFetch = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

export const movieService = {
  getTrending: () => apiFetch(buildUrl('/trending/movie/day')),
  getPopular: (page = 1) => apiFetch(buildUrl('/movie/popular', { page })),
  getNowPlaying: (page = 1) => apiFetch(buildUrl('/movie/now_playing', { page })),
  getTopRated: (page = 1) => apiFetch(buildUrl('/movie/top_rated', { page })),
  getDetail: (id) => apiFetch(buildUrl(`/movie/${id}`)),
  getVideos: (id) => apiFetch(buildUrl(`/movie/${id}/videos`)),
  getRecommendations: (id) => apiFetch(buildUrl(`/movie/${id}/recommendations`)),
  getCredits: (id) => apiFetch(buildUrl(`/movie/${id}/credits`)),
};

export const transformMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
  rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
  type: 'Movie',
  poster: IMG.poster(movie.poster_path),
  backdrop: IMG.backdrop(movie.backdrop_path),
  overview: movie.overview,
  genre_ids: movie.genre_ids || [],
});

export const getTrailerKey = (videos) => {
  if (!videos?.results) return null;
  const trailer = videos.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  return trailer?.key ?? null;
};
