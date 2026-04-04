'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type PostgresEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeTableOptions<T extends Record<string, unknown>> {
  table: string;
  schema?: string;
  event?: PostgresEvent;
  filter?: string;
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: T) => void;
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
  enabled?: boolean;
}

/**
 * Subscribe to Supabase Realtime Postgres changes on a table.
 */
export function useRealtimeTable<T extends Record<string, unknown>>(
  options: UseRealtimeTableOptions<T>
) {
  const {
    table,
    schema = 'public',
    event = '*',
    filter,
    onInsert,
    onUpdate,
    onDelete,
    onChange,
    enabled = true,
  } = options;

  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();

    const channelName = `realtime:${schema}:${table}:${filter ?? 'all'}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as never,
        {
          event,
          schema,
          table,
          ...(filter ? { filter } : {}),
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          onChange?.(payload);

          if (payload.eventType === 'INSERT') {
            onInsert?.(payload.new as T);
          } else if (payload.eventType === 'UPDATE') {
            onUpdate?.(payload.new as T);
          } else if (payload.eventType === 'DELETE') {
            onDelete?.(payload.old as T);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, schema, event, filter, enabled, onInsert, onUpdate, onDelete, onChange]);

  return channelRef;
}

interface UseRealtimeBroadcastOptions {
  channel: string;
  event: string;
  onMessage?: (payload: Record<string, unknown>) => void;
  enabled?: boolean;
}

/**
 * Subscribe to Supabase Realtime broadcast events.
 */
export function useRealtimeBroadcast(options: UseRealtimeBroadcastOptions) {
  const { channel: channelName, event, onMessage, enabled = true } = options;

  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();

    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event }, (payload) => {
        onMessage?.(payload.payload as Record<string, unknown>);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName, event, enabled, onMessage]);

  const send = (payload: Record<string, unknown>) => {
    channelRef.current?.send({
      type: 'broadcast',
      event,
      payload,
    });
  };

  return { send, channel: channelRef };
}
