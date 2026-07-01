import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [watchlist, setWatchlist] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchUserData(session.user.id);
        else { 
          setProfile(null); 
          setWatchlist([]); 
          setLoading(false); 
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const [profileRes, watchlistRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('watchlist').select('*').eq('user_id', userId).order('added_at', { ascending: false })
      ]);
      setProfile(profileRes.data);
      setWatchlist(watchlistRes.data || []);
    } catch (err) {
      console.error('User data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  // 🛡️ Memutus Re-render Cascade dengan memoisasi context value
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