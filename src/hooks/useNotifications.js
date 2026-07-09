import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) { setNotifications([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (error) {
      console.error('Fetch notifications error:', error);
      setNotifications([]);
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { 
    fetchNotifications(); 
  }, [fetchNotifications]);

  useEffect(() => {
    if (!user) return;
    
    // 🛡️ FIX: Gunakan Math.random() alih-alih Date.now()
    // Ini menjamin ID 100% unik meskipun 2 komponen memanggil hook ini di milidetik yang persis sama.
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const channelName = `notifications_${user.id}_${uniqueId}`;
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications((prev) => [payload.new, ...prev].slice(0, 20));
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(channel); 
    };
  }, [user]);

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) console.error('Mark as read error:', error);
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    const { error } = await supabase.from('notifications').update({ read: true }).in('id', unreadIds);
    if (error) console.error('Mark all as read error:', error);
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, unreadCount, markAsRead, markAllAsRead };
}