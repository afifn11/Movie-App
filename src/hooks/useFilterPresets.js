import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useFilterPresets() {
  const { user } = useAuth();
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchPresets = useCallback(async () => {
    if (!user) { setPresets([]); setLoading(false); return; }
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('filter_presets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Fetch presets error:', fetchError);
      setError('Could not load saved filters.');
      setPresets([]);
    } else {
      setPresets(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchPresets(); }, [fetchPresets]);

  const savePreset = useCallback(async (name, params) => {
    if (!user) throw new Error('Must be logged in');
    const { data, error } = await supabase
      .from('filter_presets')
      .upsert({ user_id: user.id, name: name.trim(), params }, { onConflict: 'user_id,name' })
      .select()
      .single();
    if (error) throw error;
    setPresets((prev) => [data, ...prev.filter((p) => p.name !== data.name)]);
    return data;
  }, [user]);

  const deletePreset = useCallback(async (id) => {
    if (!user) return;
    const { error } = await supabase.from('filter_presets').delete().eq('id', id);
    if (error) throw error;
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }, [user]);

  return { presets, loading, error, savePreset, deletePreset };
}