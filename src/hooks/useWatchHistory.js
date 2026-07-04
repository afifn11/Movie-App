import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useWatchHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', user.id)
      .order('watched_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          console.error('Watch history fetch error:', fetchError);
          setError('Could not load watch history.');
          setHistory([]);
        } else {
          setHistory(data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Watch history fetch error:', err);
        setError('Could not load watch history.');
        setLoading(false);
      });

    return () => { cancelled = true; };
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
    const { error } = await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', Number(movieId));

    if (error) {
      console.error('Remove from history error:', error);
      throw error; // biarkan komponen pemanggil menampilkan pesan error
    }

    setHistory((prev) => prev.filter((h) => h.movie_id !== Number(movieId)));
  }, [user]);

  const hasWatched = useCallback(
    (id) => history.some((h) => h.movie_id === Number(id)),
    [history]
  );

  return { history, loading, error, markAsWatched, removeFromHistory, hasWatched };
}