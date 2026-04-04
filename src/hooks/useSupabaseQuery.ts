'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_CONFIGURED) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

export interface UseSupabaseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook pour charger des données depuis Supabase.
 * Retourne gracieusement null si Supabase n'est pas configuré,
 * permettant aux pages de basculer vers des données de démonstration.
 */
export function useSupabaseQuery<T>(
  queryFn: (supabase: SupabaseClient) => Promise<T>,
  deps: unknown[] = []
): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(SUPABASE_CONFIGURED);
  const [error, setError] = useState<string | null>(
    SUPABASE_CONFIGURED ? null : null
  );
  const mountedRef = useRef(true);
  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  const fetchData = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await queryFnRef.current(supabase);
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        const message =
          err instanceof Error ? err.message : 'Erreur inconnue';
        setError(message);
        console.error('[useSupabaseQuery]', message);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook pour exécuter des mutations Supabase (create, update, delete).
 * Retourne { execute, loading, error }.
 */
export function useSupabaseMutation<TArgs extends unknown[], TResult>(
  mutationFn: (supabase: SupabaseClient, ...args: TArgs) => Promise<TResult>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      const supabase = getSupabase();
      if (!supabase) {
        setError('Supabase n\'est pas configuré');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await mutationFn(supabase, ...args);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erreur inconnue';
        setError(message);
        console.error('[useSupabaseMutation]', message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn]
  );

  return { execute, loading, error };
}

export { SUPABASE_CONFIGURED };
