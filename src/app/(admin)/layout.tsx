import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';

  // La página de login no necesita auth ni navbar
  if (pathname.endsWith('/login')) {
    return <>{children}</>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-[#001f3f] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="font-bold text-xl text-[#ffd600]">
                Adventur Admin
              </Link>
              <div className="flex gap-4">
                <Link href="/admin/dashboard" className="hover:text-[#ffd600]">Dashboard</Link>
                <Link href="/admin/hoteles" className="hover:text-[#ffd600]">Hoteles</Link>
                <Link href="/admin/habitaciones" className="hover:text-[#ffd600]">Habitaciones</Link>
                <Link href="/admin/reservas" className="hover:text-[#ffd600]">Reservas</Link>
                <Link href="/admin/usuarios" className="hover:text-[#ffd600]">Usuarios</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">{user.email}</span>
              <form action="/api/admin/logout" method="POST">
                <button type="submit" className="text-sm hover:text-[#ffd600]">
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
