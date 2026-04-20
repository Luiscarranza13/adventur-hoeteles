'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/Input';
import { Hotel, Mail, Lock, LogIn, Loader2, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: data.error || 'Credenciales inválidas. Verifica tu correo y contraseña.',
          confirmButtonColor: '#001f3f',
          confirmButtonText: 'Intentar de nuevo',
        });
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Acceso concedido. Redirigiendo al panel...',
        confirmButtonColor: '#ffd600',
        confirmButtonText: 'Continuar',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      router.push('/admin/dashboard');
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
        confirmButtonColor: '#001f3f',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Panel izquierdo decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#001f3f] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffd600]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffd600]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-[#ffd600] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#ffd600]/20">
            <Hotel size={36} className="text-[#001f3f]" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Adventur Hoteles</h1>
          <p className="text-gray-400 text-lg">Panel de Administración</p>
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {[
              { n: 'Hoteles', desc: 'Gestiona tu red' },
              { n: 'WhatsApp', desc: 'Reservas directas' },
              { n: '0%', desc: 'Sin comisiones' },
              { n: '24/7', desc: 'Control total' },
            ].map(({ n, desc }) => (
              <div key={n} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-[#ffd600] font-extrabold text-lg">{n}</p>
                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-[#001f3f] rounded-xl flex items-center justify-center">
              <Hotel size={20} className="text-[#ffd600]" />
            </div>
            <span className="font-extrabold text-[#001f3f] text-xl">Adventur Hoteles</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-extrabold text-[#001f3f] mb-1">Iniciar Sesión</h2>
            <p className="text-gray-500 text-sm mb-8">Accede al panel de administración</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 mt-3 pointer-events-none" />
                <Input
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@adventur.com"
                  className="pl-9"
                  required
                />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 mt-3 pointer-events-none" />
                <Input
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 bg-[#001f3f] text-white font-bold py-3.5 rounded-xl hover:bg-[#002d5a] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#001f3f]/20"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Verificando...</>
                ) : (
                  <><LogIn size={18} /> Iniciar Sesión</>
                )}
              </button>
            </form>
          </div>

          <div className="text-center mt-5">
            <Link href="/" className="inline-flex items-center gap-1.5 text-gray-400 text-sm hover:text-[#001f3f] transition-colors">
              <ArrowLeft size={14} /> Volver al sitio público
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
