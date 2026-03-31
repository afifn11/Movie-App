import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useWatchlistDB() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (!user) { setWatchlist([]); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });
      if (error) throw error;
      setWatchlist(data || []);
    } catch (err) {
      console.error('Watchlist fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchWatchlist(); }, [fetchWatchlist]);

  const addToWatchlist = useCallback(async (movie) => {
    if (!user) return;
    const item = {
      user_id:     user.id,
      movie_id:    Number(movie.id),
      movie_title: movie.title,
      poster_url:  movie.poster || null,
      rating:      String(movie.rating || ''),
      year:        String(movie.year || ''),
      genre:       movie.type || null,
    };
    const { data, error } = await supabase
      .from('watchlist')
      .upsert(item, { onConflict: 'user_id,movie_id' })
      .select()
      .single();
    if (error) throw error;
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.movie_id === item.movie_id);
      return exists ? prev : [data, ...prev];
    });
  }, [user]);

  const removeFromWatchlist = useCallback(async (movieId) => {
    if (!user) return;
    await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', Number(movieId));
    setWatchlist((prev) => prev.filter((m) => m.movie_id !== Number(movieId)));
  }, [user]);

  const toggleWatchlist = useCallback(async (movie) => {
    const exists = watchlist.some((m) => m.movie_id === Number(movie.id));
    if (exists) await removeFromWatchlist(movie.id);
    else await addToWatchlist(movie);
  }, [watchlist, addToWatchlist, removeFromWatchlist]);

  const isInWatchlist = useCallback(
    (id) => watchlist.some((m) => m.movie_id === Number(id)),
    [watchlist]
  );

  return { watchlist, loading, addToWatchlist, removeFromWatchlist, toggleWatchlist, isInWatchlist };
}
