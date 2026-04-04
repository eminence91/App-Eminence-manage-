'use client';

import React, { createContext, useContext } from 'react';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { getDashboardStats, getServices, type DashboardStats, type ServiceFilters } from '@/lib/supabase/queries';

interface DashboardData {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const DashboardDataContext = createContext<DashboardData>({
  stats: null,
  loading: false,
  error: null,
  refetch: () => {},
});

export function useDashboardData() {
  return useContext(DashboardDataContext);
}

export default function DashboardDataProvider({ children }: { children: React.ReactNode }) {
  const { data: stats, loading, error, refetch } = useSupabaseQuery(
    (supabase) => getDashboardStats(supabase),
    []
  );

  return (
    <DashboardDataContext.Provider value={{ stats, loading, error, refetch }}>
      {children}
    </DashboardDataContext.Provider>
  );
}
