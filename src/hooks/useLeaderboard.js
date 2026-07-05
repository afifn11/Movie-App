import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useLeaderboard(limit = 50) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase
      .rpc('get_leaderboard', { limit_count: limit })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          console.error('Leaderboard fetch error:', fetchError);
          setError('Could not load leaderboard.');
          setEntries([]);
        } else {
          setEntries(data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Leaderboard fetch error:', err);
        setError('Could not load leaderboard.');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [limit]);

  return { entries, loading, error };
}