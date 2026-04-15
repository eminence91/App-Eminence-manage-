import { NextRequest, NextResponse } from 'next/server';
import { refreshSession } from '@/lib/supabase/middleware';

const SUPABASE_CONFIGURED = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Routes that do not require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/auth/callback',
  '/auth/confirm',
];

// Static / asset prefixes to skip entirely
const IGNORED_PREFIXES = ['/_next', '/api/webhooks', '/favicon.ico'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and webhook endpoints
  if (IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Demo mode: if Supabase is not configured, allow all routes (mock data)
  if (!SUPABASE_CONFIGURED) {
    // Redirect root to /dashboard for demo purposes
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Refresh the Supabase session (keeps cookies alive)
  const { user, response, supabase } = await refreshSession(request);

  // Allow public routes regardless of auth state
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    // If already authenticated and visiting login, redirect to appropriate dashboard
    if (user && pathname === '/login') {
      return redirectByRole(request, supabase, user.id);
    }
    return response;
  }

  // Redirect unauthenticated users to /login
  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Fetch the user profile to determine role-based routing
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role as string | undefined;

  // Root path: redirect to the appropriate area
  if (pathname === '/') {
    return redirectByRole(request, supabase, user.id, role);
  }

  // Role-based route protection
  if (role === 'agent' && !pathname.startsWith('/agent')) {
    // Agents can only access /agent/* paths
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/client')) {
      const url = request.nextUrl.clone();
      url.pathname = '/agent';
      return NextResponse.redirect(url);
    }
  }

  if (role === 'client' && !pathname.startsWith('/client')) {
    // Clients can only access /client/* paths
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/agent')) {
      const url = request.nextUrl.clone();
      url.pathname = '/client';
      return NextResponse.redirect(url);
    }
  }

  if (
    (role === 'super_admin' || role === 'manager') &&
    !pathname.startsWith('/dashboard') &&
    !pathname.startsWith('/api')
  ) {
    // Admins/managers visiting agent or client areas get redirected
    if (pathname.startsWith('/agent') || pathname.startsWith('/client')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

async function redirectByRole(
  request: NextRequest,
  supabase: ReturnType<typeof import('@supabase/ssr').createServerClient>,
  userId: string,
  role?: string
) {
  if (!role) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    role = profile?.role;
  }

  const url = request.nextUrl.clone();

  switch (role) {
    case 'agent':
      url.pathname = '/agent';
      break;
    case 'client':
      url.pathname = '/client';
      break;
    case 'super_admin':
    case 'manager':
    default:
      url.pathname = '/dashboard';
      break;
  }

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files and images.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
