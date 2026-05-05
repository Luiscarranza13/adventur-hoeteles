'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Hotel, BedDouble, Users, LogOut, Settings } from 'lucide-react';
import Swal from 'sweetalert2';

interface SidebarAdminProps {
  email: string;
}

const navItems = [
  { href: '/admin/dashboard',     label: 'Dashboard',     Icon: LayoutDashboard },
  { href: '/admin/hoteles',       label: 'Hoteles',       Icon: Hotel },
  { href: '/admin/habitaciones',  label: 'Habitaciones',  Icon: BedDouble },
  { href: '/admin/usuarios',      label: 'Usuarios',      Icon: Users },
  { href: '/admin/configuracion', label: 'Configuración', Icon: Settings },
];

export function SidebarAdmin({ email }: SidebarAdminProps) {
  const pathname = usePathname();
  const router = useRouter();

  const cerrarSesion = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión en el panel de administración',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente',
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        router.push('/login');
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cerrar la sesión',
        confirmButtonColor: '#001f3f',
      });
    }
  };

  return (
    <aside className="w-60 bg-[#001f3f] flex flex-col flex-shrink-0 h-full shadow-xl">
      <div className="h-16 flex items-center px-5 border-b border-white/10 flex-shrink-0 gap-3">
        <img 
          src="/logoadventur2.png" 
          alt="Adventur Logo" 
          className="w-8 h-8 flex-shrink-0 object-contain"
        />
        <div>
          <p className="text-white font-bold text-sm leading-tight">Adventur</p>
          <p className="text-[#ffd600] text-xs font-semibold">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest px-5 mb-2">Menú</p>
        {navItems.map(({ href, label, Icon }) => {
          const activo = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all mx-2 rounded-lg mb-0.5 ${
                activo
                  ? 'bg-[#ffd600] text-[#001f3f] font-bold shadow-sm'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} strokeWidth={activo ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10 flex-shrink-0">
        <p className="text-xs text-gray-500 truncate mb-3">{email}</p>
        <button
          onClick={cerrarSesion}
          className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 py-2 rounded-lg transition-all"
        >
          <LogOut size={13} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
