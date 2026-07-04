import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useMovieLists() {
  const { user } = useAuth();
  const [lists, setLists]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchLists = useCallback(async () => {
    if (!user) { setLists([]); setLoading(false); return; }
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('movie_lists')
      .select('*, list_items(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Fetch lists error:', fetchError);
      setError('Could not load your lists.');
      setLists([]);
    } else {
      setLists(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchLists(); }, [fetchLists]);

  const createList = useCallback(async ({ name, description, isPublic = false }) => {
    if (!user) throw new Error('Must be logged in');
    const { data, error } = await supabase
      .from('movie_lists')
      .insert({ user_id: user.id, name, description, is_public: isPublic })
      .select()
      .single();
    if (error) throw error;
    setLists((prev) => [data, ...prev]);
    return data;
  }, [user]);

  const deleteList = useCallback(async (listId) => {
    if (!user) return;
    const { error } = await supabase.from('movie_lists').delete().eq('id', listId);
    if (error) throw error;
    setLists((prev) => prev.filter((l) => l.id !== listId));
  }, [user]);

  const updateList = useCallback(async (listId, updates) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('movie_lists')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', listId)
      .select()
      .single();
    if (error) throw error;
    setLists((prev) => prev.map((l) => l.id === listId ? data : l));
    return data;
  }, [user]);

  const getListsContainingMovie = useCallback(async (movieId) => {
    if (!lists.length) return new Set();
    const { data, error } = await supabase
      .from('list_items')
      .select('list_id')
      .eq('movie_id', Number(movieId))
      .in('list_id', lists.map(l => l.id));
    if (error) {
      console.error('getListsContainingMovie error:', error);
      return new Set();
    }
    return new Set((data || []).map(d => d.list_id));
  }, [lists]);

  const addMovieToList = useCallback(async (listId, movie) => {
    if (!user) return;
    const { error } = await supabase
      .from('list_items')
      .upsert({
        list_id:     Number(listId),
        movie_id:    Number(movie.id),
        movie_title: movie.title,
        poster_url:  movie.poster || null,
        year:        String(movie.year || ''),
      }, { onConflict: 'list_id,movie_id' });
    if (error) throw error;
  }, [user]);

  return {
    lists, loading, error, createList, deleteList, updateList, refetch: fetchLists,
    getListsContainingMovie, addMovieToList
  };
}

export function useListDetail(listId) {
  const [list, setList]       = useState(null);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const { user } = useAuth();
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!listId) return;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    Promise.all([
      supabase.from('movie_lists').select('*, profiles(full_name, avatar_url)').eq('id', listId).single(),
      supabase.from('list_items').select('*').eq('list_id', listId).order('added_at', { ascending: false }),
    ])
      .then(([{ data: listData, error: listError }, { data: itemsData, error: itemsError }]) => {
        if (requestId !== requestIdRef.current) return; // stale response, buang

        if (listError) console.error('List fetch error:', listError);
        if (itemsError) console.error('List items fetch error:', itemsError);

        setList(listData);
        setItems(itemsData || []);
        if (listError && itemsError) setError('Could not load this list.');
        setLoading(false);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        console.error('List detail fetch error:', err);
        setError('Could not load this list.');
        setLoading(false);
      });
  }, [listId]);

  const addToList = useCallback(async (movie) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('list_items')
      .upsert({
        list_id:     Number(listId),
        movie_id:    Number(movie.id),
        movie_title: movie.title,
        poster_url:  movie.poster || null,
        year:        String(movie.year || ''),
      }, { onConflict: 'list_id,movie_id' })
      .select()
      .single();
    if (error) throw error;
    setItems((prev) => {
      const exists = prev.some((i) => i.movie_id === Number(movie.id));
      return exists ? prev : [data, ...prev];
    });
  }, [listId, user]);

  const removeFromList = useCallback(async (movieId) => {
    if (!user) return;
    const { error } = await supabase
      .from('list_items')
      .delete()
      .eq('list_id', Number(listId))
      .eq('movie_id', Number(movieId));
    if (error) throw error;
    setItems((prev) => prev.filter((i) => i.movie_id !== Number(movieId)));
  }, [listId, user]);

  const isOwner = user && list && list.user_id === user.id;

  return { list, items, loading, error, addToList, removeFromList, isOwner };
}