'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'super_admin' | 'manager' | 'agent' | 'client';
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isAgent: boolean;
  isClient: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isManager: false,
  isAgent: false,
  isClient: false,
  signOut: async () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          setUser({ id: session.user.id, email: session.user.email || '' });

          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileData && mounted) {
            setProfile(profileData as Profile);
          }
        }
      } catch {
        // Supabase not configured
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    // Listen for auth changes
    try {
      const supabase = createClient();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' });
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (data) setProfile(data as Profile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } catch {
      return () => {
        mounted = false;
      };
    }
  }, []);

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch {
      // ignore
    }
  };

  const role = profile?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin: role === 'super_admin',
        isManager: role === 'manager',
        isAgent: role === 'agent',
        isClient: role === 'client',
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
