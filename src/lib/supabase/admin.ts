import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client with service role key.
 * ONLY use in server-side API routes / server actions.
 * This client bypasses Row Level Security.
 */
export const createAdminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
