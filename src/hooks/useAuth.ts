'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Profile, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      return data as Profile | null;
    },
    [supabase]
  );

  useEffect(() => {
    // Get initial session
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const profile = await fetchProfile(user.id);
        setState({ user, profile, loading: false });
      } else {
        setState({ user: null, profile: null, loading: false });
      }
    };

    init();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({ user: session.user, profile, loading: false });
      } else if (event === 'SIGNED_OUT') {
        setState({ user: null, profile: null, loading: false });
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setState((prev) => ({ ...prev, user: session.user }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, loading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setState((prev) => ({ ...prev, loading: false }));
        throw error;
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        setState({ user: data.user, profile, loading: false });
      }

      return data;
    },
    [supabase, fetchProfile]
  );

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    await supabase.auth.signOut();
    setState({ user: null, profile: null, loading: false });
  }, [supabase]);

  const role = state.profile?.role as UserRole | undefined;

  return {
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    signIn,
    signOut,
    isAdmin: role === 'super_admin',
    isManager: role === 'manager',
    isAgent: role === 'agent',
    isClient: role === 'client',
    isAdminOrManager: role === 'super_admin' || role === 'manager',
  };
}
