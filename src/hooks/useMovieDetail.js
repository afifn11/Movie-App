import { useState, useEffect } from 'react';
import { movieService, transformMovie, getTrailerKey } from '../services/movieService';
import { LOCAL_MOVIES } from '../utils/constants/data';

// TMDB IDs are purely numeric. IMDB IDs start with "tt" or "local-".
const isTmdbId = (id) => /^\d+$/.test(String(id));

export function useMovieDetail(id) {
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- Local movie (IMDB id like "tt..." or "local-...") ---
        if (!isTmdbId(id)) {
          const local = LOCAL_MOVIES.find((m) => String(m.id) === String(id));
          if (local) {
            if (!cancelled) {
              // Shape it to match what DetailMovie expects
              setMovie({
                id: local.id,
                title: local.title,
                overview: local.overview || '',
                poster_path: null,   // use local poster directly via fallback
                backdrop_path: null,
                genres: local.type ? [{ id: 0, name: local.type }] : [],
                vote_average: local.rating ? parseFloat(local.rating) : null,
                vote_count: 0,
                release_date: local.year ? `${local.year}-01-01` : null,
                runtime: null,
                status: 'Released',
                tagline: '',
                budget: 0,
                revenue: 0,
                imdb_id: id,
                // carry the raw poster URL so DetailMovie can use it
                _localPoster: local.poster,
              });
              setTrailerKey(null);
              setRecommendations([]);
              setCredits({ cast: [], crew: [] });
            }
          } else {
            if (!cancelled) setError('Movie not found.');
          }
          if (!cancelled) setLoading(false);
          return;
        }

        // --- TMDB numeric id ---
        const [detail, videos, recs, creds] = await Promise.all([
          movieService.getDetail(id),
          movieService.getVideos(id),
          movieService.getRecommendations(id),
          movieService.getCredits(id),
        ]);

        if (!cancelled) {
          setMovie(detail);
          setTrailerKey(getTrailerKey(videos));
          setRecommendations(recs.results.slice(0, 10).map(transformMovie));
          setCredits({
            cast: creds.cast?.slice(0, 8) ?? [],
            crew: creds.crew ?? [],
          });
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load movie details.');
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [id]);

  return { movie, trailerKey, recommendations, credits, loading, error };
}
