'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/Input';
import { FormDrawer } from '@/components/admin/FormDrawer';
import { createClient } from '@/lib/supabase/client';
import type { Usuario } from '@/modules/usuarios';
import Swal from 'sweetalert2';
import Image from 'next/image';
import {
  Users, Plus, Pencil, Trash2, Shield,
  UserCheck, Mail, Phone, Calendar, Save,
  Loader2, Camera, Upload, X
} from 'lucide-react';

type FormUsuario = {
  nombreCompleto: string; correo: string;
  contrasena: string; telefono: string;
  rol: 'admin' | 'cliente';
  fotoUrl: string;
};

const formVacio: FormUsuario = {
  nombreCompleto: '', correo: '', contrasena: '',
  telefono: '', rol: 'cliente', fotoUrl: '',
};

function AvatarUsuario({ nombre, fotoUrl, size = 'md' }: { nombre: string; fotoUrl?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-20 h-20 text-2xl' };
  const cls = sizes[size];

  if (fotoUrl) {
    return (
      <div className={`${cls} rounded-full overflow-hidden flex-shrink-0 relative`}>
        <Image src={fotoUrl} alt={nombre} fill className="object-cover" sizes="80px" />
      </div>
    );
  }

  return (
    <div className={`${cls} bg-[#001f3f] rounded-full flex items-center justify-center text-[#ffd600] font-bold flex-shrink-0`}>
      {nombre[0]?.toUpperCase()}
    </div>
  );
}

export default function PaginaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormUsuario>(formVacio);
  const [guardando, setGuardando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const res = await fetch('/api/admin/usuarios');
      setUsuarios(await res.json());
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  };

  const abrirNuevo = () => { setForm(formVacio); setEditandoId(null); setDrawerOpen(true); };
  const abrirEditar = (u: Usuario & { fotoUrl?: string }) => {
    setForm({
      nombreCompleto: u.nombreCompleto, correo: u.correo,
      contrasena: '', telefono: u.telefono ?? '',
      rol: u.rol, fotoUrl: u.fotoUrl ?? '',
    });
    setEditandoId(u.id); setDrawerOpen(true);
  };

  const subirFoto = async (archivo: File) => {
    setSubiendoFoto(true);
    try {
      const supabase = createClient();
      const ext = archivo.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = `avatares/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('imagenes').upload(path, archivo, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('imagenes').getPublicUrl(path);
      setForm(f => ({ ...f, fotoUrl: data.publicUrl }));
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo subir la foto.', confirmButtonColor: '#001f3f' });
    } finally { setSubiendoFoto(false); }
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const method = editandoId ? 'PUT' : 'POST';
      const body = editandoId
        ? { id: editandoId, nombreCompleto: form.nombreCompleto, telefono: form.telefono, rol: form.rol, fotoUrl: form.fotoUrl }
        : { ...form };
      const res = await fetch('/api/admin/usuarios', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error desconocido');
      }
      setDrawerOpen(false);
      await Swal.fire({ icon: 'success', title: editandoId ? '¡Usuario actualizado!' : '¡Usuario creado!', timer: 1500, showConfirmButton: false, timerProgressBar: true });
      setForm(formVacio); setEditandoId(null); cargar();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err instanceof Error ? err.message : 'No se pudo guardar.', confirmButtonColor: '#001f3f' });
    } finally { setGuardando(false); }
  };

  const eliminar = async (id: string, nombre: string) => {
    const result = await Swal.fire({
      icon: 'warning', title: '¿Eliminar usuario?',
      html: `Se eliminará a <strong>${nombre}</strong>.<br><small class="text-gray-500">Esta acción no se puede deshacer.</small>`,
      showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`/api/admin/usuarios?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      Swal.fire({ icon: 'success', title: 'Usuario eliminado', timer: 1200, showConfirmButton: false });
      cargar();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar.', confirmButtonColor: '#001f3f' });
    }
  };

  const badgeRol = (rol: string) => {
    const config: Record<string, { cls: string; Icon: typeof Shield; label: string }> = {
      admin:   { cls: 'bg-[#ffd600] text-[#001f3f] border-yellow-300', Icon: Shield,    label: 'Admin' },
      cliente: { cls: 'bg-blue-100 text-blue-800 border-blue-200',     Icon: UserCheck, label: 'Cliente' },
    };
    const { cls, Icon, label } = config[rol] ?? { cls: 'bg-gray-100 text-gray-700 border-gray-200', Icon: Users, label: rol };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cls}`}>
        <Icon size={11} /> {label}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#001f3f] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Cargando usuarios...</p>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#001f3f] flex items-center gap-2">
              <Users size={22} /> Usuarios del Sistema
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{usuarios.length} usuarios registrados</p>
          </div>
          <button onClick={abrirNuevo}
            className="flex items-center gap-2 bg-[#001f3f] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#002d5a] active:scale-95 transition-all text-sm shadow-sm">
            <Plus size={16} /> Nuevo Usuario
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Usuario', 'Contacto', 'Rol', 'Registro', 'Acciones'].map(col => (
                    <th key={col} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usuarios.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <AvatarUsuario nombre={u.nombreCompleto} fotoUrl={(u as Usuario & { fotoUrl?: string }).fotoUrl} size="md" />
                        <p className="font-semibold text-[#001f3f] text-sm">{u.nombreCompleto}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600 flex items-center gap-1.5"><Mail size={12} className="text-gray-400" />{u.correo}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5"><Phone size={11} />{u.telefono ?? 'No registrado'}</p>
                    </td>
                    <td className="px-5 py-4">{badgeRol(u.rol)}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={11} />{new Date(u.fechaCreacion).toLocaleDateString('es-ES')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => abrirEditar(u as Usuario & { fotoUrl?: string })} className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" title="Editar">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => eliminar(u.id, u.nombreCompleto)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {usuarios.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No hay usuarios registrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      <FormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editandoId ? 'Editar Usuario' : 'Nuevo Usuario'}
        subtitle={editandoId ? 'Modifica los datos del usuario' : 'Crea un nuevo acceso al panel'}
        icon={<Users size={15} className="text-[#001f3f]" />}
      >
        <form onSubmit={guardar} className="space-y-5">

          {/* Foto de perfil */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Foto de Perfil
            </label>
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div className="relative flex-shrink-0">
                {form.fotoUrl ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden relative border-4 border-[#ffd600]/30">
                    <Image src={form.fotoUrl} alt="Foto de perfil" fill className="object-cover" sizes="80px" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#001f3f] flex items-center justify-center border-4 border-[#ffd600]/20">
                    <span className="text-[#ffd600] text-2xl font-bold">
                      {form.nombreCompleto[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                {/* Botón de cámara sobre el avatar */}
                <button
                  type="button"
                  onClick={() => fotoInputRef.current?.click()}
                  disabled={subiendoFoto}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#ffd600] rounded-full flex items-center justify-center shadow-md hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-60"
                >
                  {subiendoFoto
                    ? <Loader2 size={13} className="text-[#001f3f] animate-spin" />
                    : <Camera size={13} className="text-[#001f3f]" />}
                </button>
              </div>

              {/* Zona de acción */}
              <div className="flex-1">
                <input
                  ref={fotoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && subirFoto(e.target.files[0])}
                />
                <button
                  type="button"
                  onClick={() => fotoInputRef.current?.click()}
                  disabled={subiendoFoto}
                  className="flex items-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#ffd600] text-gray-500 hover:text-[#001f3f] text-sm font-medium px-4 py-2.5 rounded-xl transition-all w-full justify-center disabled:opacity-60"
                >
                  {subiendoFoto ? (
                    <><Loader2 size={14} className="animate-spin" /> Subiendo...</>
                  ) : (
                    <><Upload size={14} /> Subir foto</>
                  )}
                </button>
                {form.fotoUrl && (
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, fotoUrl: '' }))}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 mt-2 mx-auto transition-colors"
                  >
                    <X size={11} /> Quitar foto
                  </button>
                )}
                <p className="text-xs text-gray-400 mt-1.5 text-center">JPG, PNG o WEBP · Máx. 2MB</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-5">
            <Input
              label="Nombre completo"
              value={form.nombreCompleto}
              onChange={e => setForm({ ...form, nombreCompleto: e.target.value })}
              placeholder="Ej: Juan Pérez"
              icon={<Users size={15} />}
              required
            />
            <Input
              label="Correo electrónico"
              type="email"
              value={form.correo}
              onChange={e => setForm({ ...form, correo: e.target.value })}
              placeholder="usuario@hotel.com"
              icon={<Mail size={15} />}
              disabled={!!editandoId}
              required={!editandoId}
              hint={editandoId ? 'El correo no se puede modificar' : undefined}
            />
            {!editandoId && (
              <Input
                label="Contraseña"
                type="password"
                value={form.contrasena}
                onChange={e => setForm({ ...form, contrasena: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                hint="El usuario podrá cambiarla después"
                required
              />
            )}
            <Input
              label="Teléfono (opcional)"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
              placeholder="+51 999 999 999"
              icon={<Phone size={15} />}
            />
          </div>

          {/* Selector de rol */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Rol del usuario
            </label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { val: 'cliente', Icon: UserCheck, label: 'Cliente',       desc: 'Acceso básico al sistema' },
                { val: 'admin',   Icon: Shield,    label: 'Administrador', desc: 'Acceso completo al panel' },
              ] as const).map(({ val, Icon, label, desc }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setForm({ ...form, rol: val })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                    form.rol === val ? 'border-[#001f3f] bg-[#001f3f]/5' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.rol === val ? 'bg-[#001f3f]' : 'bg-gray-200'}`}>
                    <Icon size={18} className={form.rol === val ? 'text-[#ffd600]' : 'text-gray-400'} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${form.rol === val ? 'text-[#001f3f]' : 'text-gray-500'}`}>{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={guardando || subiendoFoto}
              className="flex-1 flex items-center justify-center gap-2 bg-[#ffd600] text-[#001f3f] font-bold py-3 rounded-xl hover:bg-yellow-300 active:scale-[0.98] transition-all disabled:opacity-60 text-sm shadow-sm shadow-[#ffd600]/30"
            >
              {guardando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editandoId ? 'Guardar cambios' : 'Crear Usuario'}
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="px-5 border border-gray-200 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-all text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </FormDrawer>
    </>
  );
}
