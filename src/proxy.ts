import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseEnv } from '@/lib/env';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const esPublica =
    pathname === '/login' ||
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/logout';

  if (esPublica) return NextResponse.next();

  const esRutaProtegida =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin');

  if (!esRutaProtegida) return NextResponse.next();

  const response = NextResponse.next({ request: { headers: request.headers } });
  const env = getSupabaseEnv();

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
