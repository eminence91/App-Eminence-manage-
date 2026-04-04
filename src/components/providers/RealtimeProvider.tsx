'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface RealtimeNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

interface RealtimeContextType {
  notifications: RealtimeNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  isConnected: false,
});

export function useRealtimeNotifications() {
  return useContext(RealtimeContext);
}

interface Props {
  userId?: string;
  children: ReactNode;
}

export function RealtimeProvider({ userId, children }: Props) {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    try {
      const supabase = createClient();

      // Fetch existing notifications
      supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
        .then(({ data }) => {
          if (data) setNotifications(data as RealtimeNotification[]);
        });

      // Subscribe to new notifications
      const channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const newNotif = payload.new as RealtimeNotification;
            setNotifications((prev) => [newNotif, ...prev]);

            // Browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(newNotif.title, {
                body: newNotif.body,
                icon: '/icons/icon.svg',
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const updated = payload.new as RealtimeNotification;
            setNotifications((prev) =>
              prev.map((n) => (n.id === updated.id ? updated : n))
            );
          }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Supabase not configured
    }
  }, [userId]);

  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      try {
        const supabase = createClient();
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id);
      } catch {
        // ignore if supabase not configured
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    if (!userId) return;
    try {
      const supabase = createClient();
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
    } catch {
      // ignore
    }
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <RealtimeContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, isConnected }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}
