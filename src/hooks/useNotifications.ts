'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Notification } from '@/types';

interface UseNotificationsOptions {
  userId?: string;
  enabled?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { userId, enabled = true } = options;
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Check current permission status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Fetch notifications for the user
  useEffect(() => {
    if (!enabled || !userId) return;

    const fetchNotifications = async () => {
      setLoading(true);
      const supabase = createClient();

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        setNotifications(data as Notification[]);
        setUnreadCount(data.filter((n: { read: boolean }) => !n.read).length);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [userId, enabled]);

  // Subscribe to realtime notifications
  useEffect(() => {
    if (!enabled || !userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes' as never,
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload: { new: Notification }) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Show browser notification if permitted
          if (permission === 'granted') {
            new window.Notification(newNotification.title, {
              body: newNotification.body,
              icon: '/icon-192x192.png',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, enabled, permission]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    const result = await window.Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      const supabase = createClient();

      await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, read: true, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    const supabase = createClient();

    await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('read', false);

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true, read_at: n.read_at ?? new Date().toISOString() }))
    );
    setUnreadCount(0);
  }, [userId]);

  const sendNotification = useCallback(
    async (title: string, body: string, url?: string) => {
      if (!userId) return;

      const supabase = createClient();

      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'system',
        title,
        body,
        url: url ?? null,
        read: false,
      });
    },
    [userId]
  );

  return {
    permission,
    notifications,
    unreadCount,
    loading,
    requestPermission,
    markAsRead,
    markAllAsRead,
    sendNotification,
  };
}
