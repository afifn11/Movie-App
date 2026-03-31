import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useMovieReviews(movieId) {
  const { user } = useAuth();
  const [reviews, setReviews]       = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading]       = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!movieId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, avatar_url)')
        .eq('movie_id', Number(movieId))
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReviews(data || []);
      if (user) {
        setUserReview(data?.find((r) => r.user_id === user.id) || null);
      }
    } catch (err) {
      console.error('Reviews fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [movieId, user]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const submitReview = useCallback(async ({ rating, content, movieTitle, posterUrl }) => {
    if (!user) throw new Error('Must be logged in');
    const payload = {
      user_id:     user.id,
      movie_id:    Number(movieId),
      movie_title: movieTitle,
      poster_url:  posterUrl || null,
      rating:      parseFloat(rating),
      content:     content || null,
    };
    const { data, error } = await supabase
      .from('reviews')
      .upsert(payload, { onConflict: 'user_id,movie_id' })
      .select('*, profiles(full_name, avatar_url)')
      .single();
    if (error) throw error;
    setUserReview(data);
    setReviews((prev) => {
      const filtered = prev.filter((r) => r.user_id !== user.id);
      return [data, ...filtered];
    });
    return data;
  }, [user, movieId]);

  const deleteReview = useCallback(async () => {
    if (!user) return;
    await supabase
      .from('reviews')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', Number(movieId));
    setUserReview(null);
    setReviews((prev) => prev.filter((r) => r.user_id !== user.id));
  }, [user, movieId]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviews.length).toFixed(1)
    : null;

  return { reviews, userReview, loading, submitReview, deleteReview, avgRating };
}

export function useUserReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setReviews([]); setLoading(false); return; }
    supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setReviews(data || []); setLoading(false); });
  }, [user]);

  return { reviews, loading };
}
