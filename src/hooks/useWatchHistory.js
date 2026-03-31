import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useWatchHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setHistory([]); setLoading(false); return; }
    supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', user.id)
      .order('watched_at', { ascending: false })
      .then(({ data }) => { setHistory(data || []); setLoading(false); });
  }, [user]);

  const markAsWatched = useCallback(async (movie) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('watch_history')
      .upsert({
        user_id:     user.id,
        movie_id:    Number(movie.id),
        movie_title: movie.title,
        poster_url:  movie.poster || null,
        genre:       movie.type || null,
        watched_at:  new Date().toISOString(),
      }, { onConflict: 'user_id,movie_id' })
      .select()
      .single();
    if (error) throw error;
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.movie_id !== Number(movie.id));
      return [data, ...filtered];
    });
  }, [user]);

  const removeFromHistory = useCallback(async (movieId) => {
    if (!user) return;
    await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', Number(movieId));
    setHistory((prev) => prev.filter((h) => h.movie_id !== Number(movieId)));
  }, [user]);

  const hasWatched = useCallback(
    (id) => history.some((h) => h.movie_id === Number(id)),
    [history]
  );

  return { history, loading, markAsWatched, removeFromHistory, hasWatched };
}
