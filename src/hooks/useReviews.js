import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useMovieReviews(movieId) {
  const { user } = useAuth();
  const [reviews, setReviews]           = useState([]);
  const [userReview, setUserReview]     = useState(null);
  const [helpfulCounts, setHelpfulCounts] = useState({});
  const [userVotedIds, setUserVotedIds] = useState(new Set());
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const requestIdRef = useRef(0);

  const fetchReviews = useCallback(async () => {
    if (!movieId) return;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, avatar_url, critic_rank)')
        .eq('movie_id', Number(movieId))
        .order('created_at', { ascending: false });

      if (requestId !== requestIdRef.current) return;
      if (fetchError) throw fetchError;

      setReviews(data || []);
      if (user) {
        setUserReview(data?.find((r) => r.user_id === user.id) || null);
      } else {
        setUserReview(null);
      }

      const reviewIds = (data || []).map((r) => r.id);
      if (reviewIds.length > 0) {
        const { data: votes, error: votesError } = await supabase
          .from('review_votes')
          .select('review_id, user_id')
          .in('review_id', reviewIds);

        if (requestId !== requestIdRef.current) return;

        if (votesError) {
          console.error('Fetch votes error:', votesError);
        } else {
          const counts = {};
          const mine = new Set();
          (votes || []).forEach((v) => {
            counts[v.review_id] = (counts[v.review_id] || 0) + 1;
            if (user && v.user_id === user.id) mine.add(v.review_id);
          });
          setHelpfulCounts(counts);
          setUserVotedIds(mine);
        }
      } else {
        setHelpfulCounts({});
        setUserVotedIds(new Set());
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        console.error('Reviews fetch error:', err);
        setError('Could not load reviews.');
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [movieId, user]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const submitReview = useCallback(async ({ rating, content, movieTitle, posterUrl, genreIds = [] }) => {
    if (!user) throw new Error('Must be logged in');
    const payload = {
      user_id:     user.id,
      movie_id:    Number(movieId),
      movie_title: movieTitle,
      poster_url:  posterUrl || null,
      rating:      parseFloat(rating),
      content:     content || null,
      genre_ids:   genreIds,
    };
    const { data, error: submitError } = await supabase
      .from('reviews')
      .upsert(payload, { onConflict: 'user_id,movie_id' })
      .select('*, profiles(full_name, avatar_url, critic_rank)')
      .single();
    if (submitError) throw submitError;
    setUserReview(data);
    setReviews((prev) => {
      const filtered = prev.filter((r) => r.user_id !== user.id);
      return [data, ...filtered];
    });
    return data;
  }, [user, movieId]);

  const deleteReview = useCallback(async () => {
    if (!user) return;
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', Number(movieId));

    if (deleteError) {
      console.error('Delete review error:', deleteError);
      throw deleteError;
    }

    setUserReview(null);
    setReviews((prev) => prev.filter((r) => r.user_id !== user.id));
  }, [user, movieId]);

  const toggleHelpful = useCallback(async (reviewId) => {
    if (!user) throw new Error('Must be logged in');
    const alreadyVoted = userVotedIds.has(reviewId);

    if (alreadyVoted) {
      const { error } = await supabase
        .from('review_votes')
        .delete()
        .eq('review_id', reviewId)
        .eq('user_id', user.id);
      if (error) throw error;
      setUserVotedIds((prev) => { const next = new Set(prev); next.delete(reviewId); return next; });
      setHelpfulCounts((prev) => ({ ...prev, [reviewId]: Math.max((prev[reviewId] || 1) - 1, 0) }));
    } else {
      const { error } = await supabase
        .from('review_votes')
        .insert({ review_id: reviewId, user_id: user.id });
      if (error) throw error;
      setUserVotedIds((prev) => new Set(prev).add(reviewId));
      setHelpfulCounts((prev) => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));
    }
  }, [user, userVotedIds]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviews.length).toFixed(1)
    : null;

  return {
    reviews, userReview, loading, error,
    submitReview, deleteReview, avgRating,
    helpfulCounts, userVotedIds, toggleHelpful,
  };
}

export function useUserReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          console.error('User reviews fetch error:', fetchError);
          setError('Could not load your reviews.');
          setReviews([]);
        } else {
          setReviews(data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('User reviews fetch error:', err);
        setError('Could not load your reviews.');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [user]);

  return { reviews, loading, error };
}