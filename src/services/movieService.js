const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;

if (!READ_ACCESS_TOKEN) {
  console.error("CRITICAL ERROR: Missing VITE_TMDB_READ_TOKEN environment variable.");
  throw new Error('Missing VITE_TMDB_READ_TOKEN environment variable. Please check your .env file.');
}

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const IMG = {
  poster: (path) => path ? `${IMAGE_BASE}/w500${path}` : null,
  backdrop: (path) => path ? `${IMAGE_BASE}/w1280${path}` : null,
  posterSm: (path) => path ? `${IMAGE_BASE}/w342${path}` : null,
};

const buildUrl = (path, params = {}) => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
};

// 🛡️ Menambahkan timeout handling sebesar 10 detik (10000ms)
const apiFetch = async (url, { timeoutMs = 10000 } = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
    
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    
    // Harus di-await di dalam try-block agar catch dapat menangkap error parsing/abort
    return await res.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`[Timeout] Request aborted after ${timeoutMs}ms: ${url}`);
      throw new Error('Request timed out. Please check your internet connection.');
    }
    throw error;
  } finally {
    // 🛡️ Membersihkan timer agar tidak memicu memory leak
    clearTimeout(timeoutId);
  }
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
  search: (query, page = 1) => apiFetch(buildUrl('/search/movie', { query, page })),
  getGenres: () => apiFetch(buildUrl('/genre/movie/list')),

  // Deep Custom Filtering
  discover: (filters = {}, page = 1) => {
    const params = { page, sort_by: filters.sortBy || 'popularity.desc', 'vote_count.gte': 50 };
    if (filters.genres?.length) params.with_genres = filters.genres.join(',');
    if (filters.yearFrom) params['primary_release_date.gte'] = `${filters.yearFrom}-01-01`;
    if (filters.yearTo) params['primary_release_date.lte'] = `${filters.yearTo}-12-31`;
    if (filters.minRating > 0) params['vote_average.gte'] = filters.minRating;
    if (filters.maxRuntime) params['with_runtime.lte'] = filters.maxRuntime;
    return apiFetch(buildUrl('/discover/movie', params));
  },
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