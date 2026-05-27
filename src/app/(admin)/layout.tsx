export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { SidebarAdmin } from '@/components/admin/SidebarAdmin';
import { TopbarAdmin } from '@/components/admin/TopbarAdmin';
import { obtenerAdminActual, type RolAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';

const navAdmin = [
  { href: '/admin/dashboard', label: 'Dashboard', roles: ['admin', 'colaborador', 'viewer'] },
  { href: '/admin/hoteles', label: 'Hoteles', roles: ['admin', 'colaborador'] },
  { href: '/admin/habitaciones', label: 'Habitaciones', roles: ['admin', 'colaborador'] },
  { href: '/admin/reservas', label: 'Reservas', roles: ['admin', 'colaborador'] },
  { href: '/admin/usuarios', label: 'Usuarios', roles: ['admin'] },
  { href: '/admin/configuracion', label: 'Config', roles: ['admin'] },
] as const;

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const auth = await obtenerAdminActual();

  if (!auth.autorizado) redirect('/login');

  const { data: perfil } = await createAdminClient()
    .from('usuarios')
    .select('foto_url, nombre_completo')
    .eq('id', auth.user.id)
    .single();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarAdmin email={auth.user.email ?? ''} rol={auth.rol} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopbarAdmin
          email={auth.user.email ?? ''}
          fotoUrl={perfil?.foto_url ?? undefined}
          nombre={perfil?.nombre_completo ?? undefined}
        />
        <nav className="md:hidden bg-white border-b border-gray-100 overflow-x-auto px-3 py-2">
          <div className="flex gap-2 min-w-max">
            {navAdmin
              .filter(item => (item.roles as readonly RolAdmin[]).includes(auth.rol))
              .map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-xl bg-gray-50 text-[#001f3f] text-xs font-bold border border-gray-100"
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </nav>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
