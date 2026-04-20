'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const rutas: Record<string, string> = {
  '/admin/dashboard':    'Dashboard',
  '/admin/hoteles':      'Hoteles',
  '/admin/habitaciones': 'Habitaciones',
  '/admin/usuarios':     'Usuarios',
};

interface TopbarAdminProps {
  email: string;
  fotoUrl?: string;
  nombre?: string;
}

export function TopbarAdmin({ email, fotoUrl, nombre }: TopbarAdminProps) {
  const pathname = usePathname();
  const [busqueda, setBusqueda] = useState('');
  const titulo = rutas[pathname] ?? 'Panel Admin';
  const inicial = (nombre?.[0] ?? email[0])?.toUpperCase() ?? 'A';

  return (
    <header className="bg-white border-b border-gray-100 h-14 flex items-center justify-between px-6 flex-shrink-0">
      {/* Título */}
      <div>
        <h2 className="text-sm font-bold text-[#001f3f]">{titulo}</h2>
        <p className="text-xs text-gray-400 hidden md:block">Panel de Administración</p>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        {/* Búsqueda */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-52 focus-within:border-[#ffd600] focus-within:bg-white transition-all">
          <Search size={13} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="bg-transparent text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none w-full"
          />
        </div>

        {/* Notificaciones */}
        <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#ffd600] rounded-full" />
        </button>

        {/* Avatar con foto real */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 cursor-default">
          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 relative">
            {fotoUrl ? (
              <Image
                src={fotoUrl}
                alt={nombre ?? email}
                fill
                className="object-cover"
                sizes="28px"
              />
            ) : (
              <div className="w-full h-full bg-[#001f3f] flex items-center justify-center text-[#ffd600] text-xs font-bold">
                {inicial}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-600 hidden md:block max-w-[120px] truncate">
            {nombre ?? email}
          </span>
        </div>
      </div>
    </header>
  );
}
