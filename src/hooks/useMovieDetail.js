import { useState, useEffect } from 'react';
import { movieService, transformMovie, getTrailerKey } from '../services/movieService';

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
