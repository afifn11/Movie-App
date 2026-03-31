import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useMovieLists() {
  const { user } = useAuth();
  const [lists, setLists]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLists = useCallback(async () => {
    if (!user) { setLists([]); setLoading(false); return; }
    const { data } = await supabase
      .from('movie_lists')
      .select('*, list_items(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setLists(data || []);
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
    await supabase.from('movie_lists').delete().eq('id', listId);
    setLists((prev) => prev.filter((l) => l.id !== listId));
  }, []);

  const updateList = useCallback(async (listId, updates) => {
    const { data, error } = await supabase
      .from('movie_lists')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', listId)
      .select()
      .single();
    if (error) throw error;
    setLists((prev) => prev.map((l) => l.id === listId ? data : l));
    return data;
  }, []);

  return { lists, loading, createList, deleteList, updateList, refetch: fetchLists };
}

export function useListDetail(listId) {
  const [list, setList]   = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!listId) return;
    Promise.all([
      supabase.from('movie_lists').select('*, profiles(full_name, avatar_url)').eq('id', listId).single(),
      supabase.from('list_items').select('*').eq('list_id', listId).order('added_at', { ascending: false }),
    ]).then(([{ data: listData }, { data: itemsData }]) => {
      setList(listData);
      setItems(itemsData || []);
      setLoading(false);
    });
  }, [listId]);

  const addToList = useCallback(async (movie) => {
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
  }, [listId]);

  const removeFromList = useCallback(async (movieId) => {
    await supabase
      .from('list_items')
      .delete()
      .eq('list_id', Number(listId))
      .eq('movie_id', Number(movieId));
    setItems((prev) => prev.filter((i) => i.movie_id !== Number(movieId)));
  }, [listId]);

  const isOwner = user && list && list.user_id === user.id;

  return { list, items, loading, addToList, removeFromList, isOwner };
}
