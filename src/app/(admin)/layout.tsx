import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SidebarAdmin } from '@/components/admin/SidebarAdmin';
import { TopbarAdmin } from '@/components/admin/TopbarAdmin';

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Obtener foto_url del usuario actual
  const { data: perfil } = await supabase
    .from('usuarios')
    .select('foto_url, nombre_completo')
    .eq('id', user.id)
    .single();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarAdmin email={user.email ?? ''} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopbarAdmin
          email={user.email ?? ''}
          fotoUrl={perfil?.foto_url ?? undefined}
          nombre={perfil?.nombre_completo ?? undefined}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
