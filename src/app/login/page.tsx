'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail, Lock, LogIn, Loader2, ArrowLeft,
  Eye, EyeOff, Shield, CheckCircle2,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: data.error || 'Credenciales inválidas.',
          confirmButtonColor: '#001f3f',
        });
        return;
      }
      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        timer: 1400,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      router.push('/admin/dashboard');
    } catch {
      await Swal.fire({ icon: 'error', title: 'Error de conexión', confirmButtonColor: '#001f3f' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-[Poppins,sans-serif]">

      {/* ══════════════════════════════════════════════════════════════
          PANEL IZQUIERDO — imagen HD a pantalla completa
      ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[58%] relative flex-col overflow-hidden">

        {/* Imagen HD — sin opacity para que se vea nítida */}
        <Image
          src="/imagen5.jpg"
          alt="Hotel de lujo en Perú"
          fill
          className="object-cover object-center"
          priority
          quality={100}
          sizes="60vw"
        />

        {/* Overlay muy sutil — solo para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/85 via-[#001f3f]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/70 via-transparent to-[#001f3f]/20" />

        {/* ── Logo ── */}
        <div className="relative z-10 p-8 xl:p-12">
          <div className="flex items-center gap-3">
            <Image
              src="/logoadventur2.png"
              alt="Adventur"
              width={48}
              height={48}
              className="object-contain drop-shadow-lg"
            />
            <div className="leading-none">
              <p className="font-black text-white text-lg uppercase tracking-tight drop-shadow">ADVENTUR</p>
              <p className="text-[#ffd600] text-[9px] font-black uppercase tracking-[0.3em] mt-0.5">
                Hoteles · Perú
              </p>
            </div>
          </div>
        </div>

        {/* ── Contenido central ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-end p-8 xl:p-12 pb-10 xl:pb-14">

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-5">
            <div className="h-px w-8 bg-[#ffd600]" />
            <span className="text-[#ffd600] text-[10px] font-black uppercase tracking-[0.25em]">
              Panel de Administración
            </span>
          </div>

          {/* Título */}
          <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
            Gestiona tu red<br />de hoteles<br />
            <span className="text-[#ffd600]">en todo el Perú</span>
          </h2>

          <p className="text-white/60 text-sm xl:text-base leading-relaxed max-w-xs mb-8">
            Hoteles, habitaciones, reservas y configuración — todo desde un solo lugar.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-3">
            {[
              'Gestión completa de hoteles y habitaciones',
              'Reservas en tiempo real por WhatsApp',
              'Panel de estadísticas y reportes',
            ].map(txt => (
              <div key={txt} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ffd600]/20 border border-[#ffd600]/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={11} className="text-[#ffd600]" />
                </div>
                <span className="text-white/70 text-xs xl:text-sm">{txt}</span>
              </div>
            ))}
          </div>

          {/* Divider + copyright */}
          <div className="mt-10 pt-6 border-t border-white/10">
            <p className="text-white/30 text-[10px] font-medium">
              © {new Date().getFullYear()} Adventur · HORIZONTE ANDINO COMPANY E.I.R.L.
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          PANEL DERECHO — formulario
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-white">

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffd600]/[0.04] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#001f3f]/[0.03] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative w-full max-w-[420px] px-6 py-10 sm:px-8">

          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <Image src="/logoadventur2.png" alt="Adventur" width={40} height={40} className="object-contain" />
            <div className="leading-none">
              <p className="font-black text-[#001f3f] text-sm uppercase tracking-tight">ADVENTUR</p>
              <p className="text-[#ffd600] text-[8px] font-black uppercase tracking-[0.2em] mt-0.5">Hoteles</p>
            </div>
          </div>

          {/* ── Encabezado ── */}
          <div className="mb-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#001f3f]/5 border border-[#001f3f]/10 rounded-full px-3.5 py-1.5 mb-5">
              <Shield size={11} className="text-[#001f3f]" />
              <span className="text-[9px] font-black text-[#001f3f] tracking-[0.18em] uppercase">
                Acceso Seguro
              </span>
            </div>

            <h1 className="text-2xl sm:text-[1.75rem] font-black text-[#001f3f] tracking-tight leading-tight mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-slate-400 text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* ── Formulario ── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-black text-[#001f3f] tracking-[0.15em] uppercase mb-2"
              >
                Correo electrónico
              </label>
              <div className="relative group">
                <Mail
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-[#001f3f]"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@adventur.pe"
                  required
                  autoComplete="email"
                  className="w-full h-[52px] pl-11 pr-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-[#001f3f] text-sm font-medium outline-none transition-all duration-200 focus:bg-white focus:border-[#ffd600] focus:ring-4 focus:ring-[#ffd600]/10 placeholder:text-slate-300 hover:border-slate-200"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-black text-[#001f3f] tracking-[0.15em] uppercase mb-2"
              >
                Contraseña
              </label>
              <div className="relative group">
                <Lock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-[#001f3f]"
                />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full h-[52px] pl-11 pr-12 rounded-2xl border-2 border-slate-100 bg-slate-50 text-[#001f3f] text-sm font-medium outline-none transition-all duration-200 focus:bg-white focus:border-[#ffd600] focus:ring-4 focus:ring-[#ffd600]/10 placeholder:text-slate-300 hover:border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#001f3f] transition-colors p-1 rounded-lg"
                  aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] rounded-2xl bg-[#001f3f] text-white font-black text-sm flex items-center justify-center gap-2.5 uppercase tracking-[0.1em] shadow-[0_8px_30px_rgba(0,31,63,0.22)] hover:bg-[#002d5a] hover:shadow-[0_12px_40px_rgba(0,31,63,0.32)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <LogIn size={17} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold hover:text-[#001f3f] transition-colors group"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-200" />
              Volver al inicio
            </Link>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Conexión segura</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
