import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useUserBadges(userId) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!userId) { setBadges([]); setLoading(false); return; }

    setLoading(true);
    setError(null);

    supabase
      .from('user_badges')
      .select('badge_id, earned_at, badges(name, description, icon, sort_order)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          console.error('Fetch user badges error:', fetchError);
          setError('Could not load badges.');
          setBadges([]);
        } else {
          setBadges(data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Fetch user badges error:', err);
        setError('Could not load badges.');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  return { badges, loading, error };
}