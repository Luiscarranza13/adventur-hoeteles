'use client';

import { useState, useEffect } from 'react';

interface Usuario {
  id: string; nombre_completo: string; correo: string;
  telefono: string | null; rol: string; fecha_creacion: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/usuarios').then(r => r.json()).then(setUsuarios).catch(console.error).finally(() => setLoading(false));
  }, []);

  const rolBadge = (rol: string) => {
    const s: Record<string, string> = { admin: 'bg-[#ffd600] text-[#001f3f]', recepcionista: 'bg-blue-100 text-blue-800' };
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${s[rol] || 'bg-gray-100 text-gray-800'}`}>{rol}</span>;
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#001f3f] mb-8">Usuarios del Sistema</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Nombre', 'Correo', 'Teléfono', 'Rol', 'Registro'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-[#001f3f]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#001f3f]">{u.nombre_completo}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.correo}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.telefono || 'No registrado'}</td>
                <td className="px-6 py-4">{rolBadge(u.rol)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.fecha_creacion).toLocaleDateString('es-ES')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {usuarios.length === 0 && <div className="p-8 text-center text-gray-500">No hay usuarios</div>}
      </div>
    </div>
  );
}
