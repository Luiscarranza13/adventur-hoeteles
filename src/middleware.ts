import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Middleware de autenticación.
 * Protege todas las rutas /admin/* y /api/admin/* excepto /login.
 * Si no hay sesión activa, redirige a /login.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /login no necesita protección
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Solo proteger rutas admin de página y API
  const esRutaProtegida =
    pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  if (!esRutaProtegida) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Sin sesión → redirigir a login
  if (!user) {
    // Las rutas API devuelven 401 en lugar de redirigir
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
