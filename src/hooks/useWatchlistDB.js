import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useWatchlistDB() {
  const { user, watchlist, setWatchlist } = useAuth();
  const [loading, setLoading] = useState(false);

  const addToWatchlist = useCallback(async (movie) => {
    if (!user) return;
    setLoading(true);
    try {
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
        const safePrev = prev || [];
        const exists = safePrev.some((m) => m.movie_id === item.movie_id);
        return exists ? safePrev : [data, ...safePrev];
      });
    } catch (err) {
      console.error('Error adding to watchlist:', err);
    } finally {
      setLoading(false);
    }
  }, [user, setWatchlist]);

  const removeFromWatchlist = useCallback(async (movieId) => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', Number(movieId));
        
      if (error) throw error;
      
      // Update state global
      setWatchlist((prev) => (prev || []).filter((m) => m.movie_id !== Number(movieId)));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    } finally {
      setLoading(false);
    }
  }, [user, setWatchlist]);

  const toggleWatchlist = useCallback(async (movie) => {
    const currentList = watchlist || [];
    const exists = currentList.some((m) => m.movie_id === Number(movie.id));
    if (exists) await removeFromWatchlist(movie.id);
    else await addToWatchlist(movie);
  }, [watchlist, addToWatchlist, removeFromWatchlist]);

  const isInWatchlist = useCallback(
    (id) => (watchlist || []).some((m) => m.movie_id === Number(id)),
    [watchlist]
  );

  return { 
    watchlist: watchlist || [], 
    loading, 
    addToWatchlist, 
    removeFromWatchlist, 
    toggleWatchlist, 
    isInWatchlist 
  };
}