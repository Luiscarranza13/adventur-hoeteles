'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, Loader2, ArrowLeft, Eye, EyeOff, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        await Swal.fire({ icon: 'error', title: 'Acceso denegado', text: data.error || 'Credenciales inválidas.', confirmButtonColor: '#06284a' });
        return;
      }
      await Swal.fire({ icon: 'success', title: '¡Bienvenido!', timer: 1400, timerProgressBar: true, showConfirmButton: false });
      router.push('/admin/dashboard');
    } catch {
      await Swal.fire({ icon: 'error', title: 'Error de conexión', confirmButtonColor: '#06284a' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef1f8] px-4 py-10">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_1px_1px,#cbd5e1_1px,transparent_0)] [background-size:22px_22px]" />

      {/* Tarjeta */}
      <div className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-2xl shadow-slate-300/50 p-8 sm:p-10 md:p-12 animate-enter">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-[#FFD600]">
            <Shield size={16} />
            <span className="text-xs font-black tracking-[0.2em] uppercase">Panel de Administración</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#06284a] tracking-tight leading-tight">
            Iniciar Sesión
          </h1>
          <p className="text-slate-500 text-base sm:text-lg mt-3">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-[#06284a] tracking-[0.18em] uppercase">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@empresa.com"
                required
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-slate-700 text-base outline-none transition focus:border-[#FFD600] focus:ring-4 focus:ring-[#FFD600]/20 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-[#06284a] tracking-[0.18em] uppercase">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-white text-slate-700 text-base outline-none transition focus:border-[#FFD600] focus:ring-4 focus:ring-[#FFD600]/20 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#06284a] transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-[#06284a] text-white font-black text-base flex items-center justify-center gap-3 shadow-lg shadow-[#06284a]/30 hover:bg-[#08345f] active:scale-[0.98] transition disabled:opacity-60 mt-2"
          >
            {loading
              ? <><Loader2 size={20} className="animate-spin" /> Verificando...</>
              : <><LogIn size={20} /> Iniciar Sesión</>
            }
          </button>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <Link href="/" className="flex items-center gap-1.5 text-slate-500 text-sm font-bold hover:text-[#06284a] transition group">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Shield size={14} className="text-emerald-500" />
            <span>Conexión segura</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes enter {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-enter { animation: enter 0.5s ease-out both; }
      `}</style>
    </div>
  );
}
