import { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guard untuk race condition: hanya response dari request TERAKHIR yang boleh
  // menulis ke state. Mencegah auth event beruntun saling menimpa data.
  const latestRequestId = useRef(0);
  const isMounted = useRef(true);

  const fetchUserData = useCallback(async (userId) => {
    const requestId = ++latestRequestId.current;
    try {
      const [profileRes, watchlistRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('watchlist').select('*').eq('user_id', userId).order('added_at', { ascending: false }),
      ]);

      // Kalau ada request baru yang sudah jalan setelah ini, atau komponen sudah unmount,
      // buang hasil ini — jangan menimpa state dengan data usang.
      if (requestId !== latestRequestId.current || !isMounted.current) return;

      if (profileRes.error) {
        console.error('Profile fetch error:', profileRes.error);
      }
      if (watchlistRes.error) {
        console.error('Watchlist fetch error:', watchlistRes.error);
      }

      setProfile(profileRes.data ?? null);
      setWatchlist(watchlistRes.data || []);
    } catch (err) {
      if (requestId === latestRequestId.current && isMounted.current) {
        console.error('User data fetch error:', err);
      }
    } finally {
      if (requestId === latestRequestId.current && isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted.current) return;
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted.current) return;
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          latestRequestId.current++; // batalkan request fetchUserData yang mungkin masih pending
          setProfile(null);
          setWatchlist([]);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setWatchlist([]);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
    return data;
  }, [user]);

  const contextValue = useMemo(() => ({
    user,
    profile,
    watchlist,
    setWatchlist,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  }), [user, profile, watchlist, loading, signInWithGoogle, signOut, updateProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};