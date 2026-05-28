'use client';

import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  Settings, Save, Loader2, Globe, MessageCircle,
  Phone, Mail, AlertTriangle,
  CheckCircle2, Building2, Zap,
  ToggleLeft, ToggleRight, RefreshCw, Link2, Image, Users, Star
} from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface Configuracion {
  nombre_negocio: string;
  slogan: string;
  descripcion: string;
  email_contacto: string;
  telefono_principal: string;
  whatsapp_numero: string;
  whatsapp_mensaje_reserva: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  twitter_url: string;
  modo_mantenimiento: boolean;
  mensaje_mantenimiento: string;
  reservas_activas: boolean;
  moneda_default: string;
  hero_avatar_1: string;
  hero_avatar_2: string;
  hero_avatar_3: string;
  hero_clientes_count: number;
  hero_rating: number;
}

const configVacia: Configuracion = {
  nombre_negocio: 'Adventur Hoteles',
  slogan: 'Atrévete y descubre',
  descripcion: '',
  email_contacto: '',
  telefono_principal: '',
  whatsapp_numero: '',
  whatsapp_mensaje_reserva: 'Hola, me interesa reservar una habitación.',
  facebook_url: '',
  instagram_url: '',
  tiktok_url: '',
  twitter_url: '',
  modo_mantenimiento: false,
  mensaje_mantenimiento: 'Sitio en mantenimiento. Volvemos pronto.',
  reservas_activas: true,
  moneda_default: 'USD',
  hero_avatar_1: '',
  hero_avatar_2: '',
  hero_avatar_3: '',
  hero_clientes_count: 1050,
  hero_rating: 4.9,
};

type Seccion = 'negocio' | 'whatsapp' | 'redes' | 'hero' | 'sistema';

const secciones: { id: Seccion; label: string; Icon: typeof Settings; desc: string }[] = [
  { id: 'negocio',   label: 'Negocio',       Icon: Building2,      desc: 'Información general' },
  { id: 'whatsapp',  label: 'WhatsApp',       Icon: MessageCircle,  desc: 'Reservas y contacto' },
  { id: 'redes',     label: 'Redes Sociales', Icon: Globe,          desc: 'Links y perfiles' },
  { id: 'hero',      label: 'Hero / Inicio',  Icon: Image,          desc: 'Avatares y estadísticas' },
  { id: 'sistema',   label: 'Sistema',        Icon: Settings,       desc: 'Mantenimiento y reservas' },
];

function Toggle({ activo, onChange, labelOn, labelOff }: { activo: boolean; onChange: (v: boolean) => void; labelOn: string; labelOff: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!activo)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
        activo
          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {activo ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
      {activo ? labelOn : labelOff}
    </button>
  );
}

export default function PaginaConfiguracion() {
  const [config, setConfig] = useState<Configuracion>(configVacia);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [seccion, setSeccion] = useState<Seccion>('negocio');

  const cargar = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/configuracion');
      if (!res.ok) throw new Error('No autorizado');
      const data = await res.json();
      setConfig({ ...configVacia, ...data });
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cargar(); }, [cargar]);

  const guardar = async () => {
    // Validaciones básicas
    const erroresConfig: string[] = [];
    if (!config.nombre_negocio.trim()) erroresConfig.push('El nombre del negocio es requerido');
    if (!config.whatsapp_numero.trim()) erroresConfig.push('El número de WhatsApp es requerido');
    else if (!/^\+?\d[\d\s-]{7,20}$/.test(config.whatsapp_numero.trim())) erroresConfig.push('Formato de WhatsApp inválido (ej: 5215512345678)');
    if (config.email_contacto && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email_contacto)) erroresConfig.push('Email de contacto inválido');
    if (config.facebook_url && !config.facebook_url.startsWith('http')) erroresConfig.push('URL de Facebook inválida (debe empezar con http)');
    if (config.instagram_url && !config.instagram_url.startsWith('http')) erroresConfig.push('URL de Instagram inválida');
    if (config.tiktok_url && !config.tiktok_url.startsWith('http')) erroresConfig.push('URL de TikTok inválida');
    if (config.twitter_url && !config.twitter_url.startsWith('http')) erroresConfig.push('URL de Twitter inválida');

    if (erroresConfig.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Revisa los datos',
        html: erroresConfig.map(e => `<li style="text-align:left">${e}</li>`).join(''),
        confirmButtonColor: '#001f3f',
      });
      return;
    }

    setGuardando(true);
    try {
      const res = await fetch('/api/admin/configuracion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? 'No se pudo guardar la configuracion.');
      setConfig({ ...configVacia, ...data });
      await Swal.fire({
        icon: 'success',
        title: '¡Configuración guardada!',
        text: 'Los cambios se aplicaron correctamente.',
        timer: 1800,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar la configuración.', confirmButtonColor: '#001f3f' });
    } finally { setGuardando(false); }
  };

  const set = (key: keyof Configuracion, value: string | boolean | number) =>
    setConfig(c => ({ ...c, [key]: value }));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#001f3f] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Cargando configuración...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#001f3f] flex items-center gap-2">
            <Settings size={22} /> Configuración
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Gestiona la configuración global del sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cargar}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-all text-sm"
          >
            <RefreshCw size={14} /> Recargar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="flex items-center gap-2 bg-[#ffd600] text-[#001f3f] font-bold px-5 py-2 rounded-xl hover:bg-yellow-300 active:scale-95 transition-all text-sm shadow-sm disabled:opacity-60"
          >
            {guardando ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Guardar cambios
          </button>
        </div>
      </div>

      {/* Alertas de estado */}
      {config.modo_mantenimiento && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
          <p className="text-amber-700 text-sm font-medium">
            El sitio está en <strong>modo mantenimiento</strong>. Los visitantes verán el mensaje de mantenimiento.
          </p>
        </div>
      )}
      {!config.reservas_activas && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm font-medium">
            Las <strong>reservas están desactivadas</strong>. Los clientes no podrán hacer reservas.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navegación lateral */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-2xl border border-gray-100 p-2 space-y-1">
            {secciones.map(({ id, label, Icon, desc }) => (
              <button
                key={id}
                onClick={() => setSeccion(id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                  seccion === id
                    ? 'bg-[#001f3f] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} className={seccion === id ? 'text-[#ffd600]' : 'text-gray-400'} />
                <div>
                  <p className={`text-sm font-semibold ${seccion === id ? 'text-white' : 'text-gray-700'}`}>{label}</p>
                  <p className={`text-xs ${seccion === id ? 'text-gray-300' : 'text-gray-400'}`}>{desc}</p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 space-y-6">

          {/* ── NEGOCIO ── */}
          {seccion === 'negocio' && (
            <>
              <SectionHeader Icon={Building2} title="Información del Negocio" desc="Datos generales de tu empresa" />
              <div className="space-y-4">
                <Input
                  label="Nombre del negocio"
                  value={config.nombre_negocio}
                  onChange={e => set('nombre_negocio', e.target.value)}
                  placeholder="Adventur Hoteles"
                  icon={<Building2 size={15} />}
                />
                <Input
                  label="Slogan"
                  value={config.slogan}
                  onChange={e => set('slogan', e.target.value)}
                  placeholder="Atrévete y descubre"
                  icon={<Zap size={15} />}
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] focus:bg-white transition-all text-sm text-gray-800 placeholder:text-gray-300 resize-none"
                    rows={3}
                    value={config.descripcion}
                    onChange={e => set('descripcion', e.target.value)}
                    placeholder="Describe tu negocio..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email de contacto"
                    type="email"
                    value={config.email_contacto}
                    onChange={e => set('email_contacto', e.target.value)}
                    placeholder="contacto@adventur.com"
                    icon={<Mail size={15} />}
                  />
                  <Input
                    label="Teléfono principal"
                    value={config.telefono_principal}
                    onChange={e => set('telefono_principal', e.target.value)}
                    placeholder="+51 999 999 999"
                    icon={<Phone size={15} />}
                  />
                </div>
              </div>
            </>
          )}

          {/* ── WHATSAPP ── */}
          {seccion === 'whatsapp' && (
            <>
              <SectionHeader Icon={MessageCircle} title="Configuración de WhatsApp" desc="Número y mensajes para reservas" />
              <div className="space-y-4">
                <Input
                  label="Número de WhatsApp"
                  value={config.whatsapp_numero}
                  onChange={e => set('whatsapp_numero', e.target.value)}
                  placeholder="5215512345678"
                  icon={<MessageCircle size={15} />}
                  hint="Incluye el código de país sin el + (ej: 5215512345678)"
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Mensaje de reserva predeterminado
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] focus:bg-white transition-all text-sm text-gray-800 placeholder:text-gray-300 resize-none"
                    rows={4}
                    value={config.whatsapp_mensaje_reserva}
                    onChange={e => set('whatsapp_mensaje_reserva', e.target.value)}
                    placeholder="Hola, me interesa reservar una habitación."
                  />
                  <p className="text-xs text-gray-400 mt-1">Este mensaje se enviará automáticamente al hacer una reserva.</p>
                </div>

                {/* Preview */}
                {config.whatsapp_numero && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 size={13} /> Vista previa del enlace
                    </p>
                    <a
                      href={`https://wa.me/${config.whatsapp_numero}?text=${encodeURIComponent(config.whatsapp_mensaje_reserva)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 underline break-all"
                    >
                      {`https://wa.me/${config.whatsapp_numero}`}
                    </a>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── REDES SOCIALES ── */}
          {seccion === 'redes' && (
            <>
              <SectionHeader Icon={Globe} title="Redes Sociales" desc="Links a tus perfiles en redes" />
              <div className="space-y-4">
                <Input
                  label="Facebook"
                  value={config.facebook_url}
                  onChange={e => set('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/adventurhoteles"
                  icon={<Link2 size={15} />}
                />
                <Input
                  label="Instagram"
                  value={config.instagram_url}
                  onChange={e => set('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/adventurhoteles"
                  icon={<Link2 size={15} />}
                />
                <Input
                  label="TikTok"
                  value={config.tiktok_url}
                  onChange={e => set('tiktok_url', e.target.value)}
                  placeholder="https://tiktok.com/@adventurhoteles"
                  icon={<Link2 size={15} />}
                />
                <Input
                  label="Twitter / X"
                  value={config.twitter_url}
                  onChange={e => set('twitter_url', e.target.value)}
                  placeholder="https://twitter.com/adventurhoteles"
                  icon={<Link2 size={15} />}
                />

                {/* Preview redes */}
                {(config.facebook_url || config.instagram_url || config.tiktok_url || config.twitter_url) && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Redes configuradas</p>
                    <div className="flex flex-wrap gap-2">
                      {config.facebook_url && <SocialBadge label="Facebook" color="bg-blue-600" />}
                      {config.instagram_url && <SocialBadge label="Instagram" color="bg-pink-500" />}
                      {config.tiktok_url && <SocialBadge label="TikTok" color="bg-gray-900" />}
                      {config.twitter_url && <SocialBadge label="Twitter/X" color="bg-sky-500" />}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── HERO ── */}
          {seccion === 'hero' && (
            <>
              <SectionHeader Icon={Image} title="Hero / Inicio" desc="Fotos de avatares y estadísticas de la sección principal" />
              <div className="space-y-6">

                {/* Avatares */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users size={13} className="text-[#001f3f]" />
                    Fotos de avatares (círculos de clientes)
                  </p>
                  <p className="text-xs text-gray-400 mb-4">Pega la URL pública de la foto de cada cliente. Si dejas el campo vacío se mostrará una inicial.</p>
                  <div className="space-y-3">
                    {([
                      { key: 'hero_avatar_1' as const, label: 'Avatar 1 (izquierda)', inicial: 'A' },
                      { key: 'hero_avatar_2' as const, label: 'Avatar 2 (centro)', inicial: 'H' },
                      { key: 'hero_avatar_3' as const, label: 'Avatar 3 (derecha)', inicial: 'P' },
                    ] as const).map(({ key, label, inicial }) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-gray-200 bg-gradient-to-br from-[#ffd600] to-[#001f3f] flex items-center justify-center text-xs font-black text-white">
                          {config[key] ? (
                            <img src={config[key]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            inicial
                          )}
                        </div>
                        <div className="flex-1">
                          <Input
                            label={label}
                            value={config[key]}
                            onChange={e => set(key, e.target.value)}
                            placeholder="https://ejemplo.com/foto-cliente.jpg"
                            icon={<Link2 size={15} />}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Star size={13} className="text-[#001f3f]" />
                    Estadísticas del hero
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Cantidad de clientes
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={9999999}
                        step={1}
                        value={config.hero_clientes_count}
                        onChange={e => set('hero_clientes_count', e.target.value)}
                        className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] focus:bg-white transition-all text-sm text-gray-800"
                      />
                      <p className="text-xs text-gray-400 mt-1">Se muestra como "+1,050 clientes"</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Calificación (0–5)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={5}
                        step={0.1}
                        value={config.hero_rating}
                        onChange={e => set('hero_rating', e.target.value)}
                        className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] focus:bg-white transition-all text-sm text-gray-800"
                      />
                      <p className="text-xs text-gray-400 mt-1">Ej: 4.9 → muestra "★★★★★ 4.9"</p>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-[#001f3f] rounded-xl p-4">
                  <p className="text-xs font-bold text-[#ffd600] uppercase tracking-wider mb-3">Vista previa</p>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5">
                      {[
                        { k: 'hero_avatar_1' as const, i: 'A' },
                        { k: 'hero_avatar_2' as const, i: 'H' },
                        { k: 'hero_avatar_3' as const, i: 'P' },
                      ].map(({ k, i }, idx) => (
                        <div
                          key={k}
                          className="w-8 h-8 rounded-full border-2 border-[#001f3f] overflow-hidden shrink-0 bg-gradient-to-br from-[#ffd600] to-[#001f3f] flex items-center justify-center text-[10px] font-black text-white"
                          style={{ filter: `brightness(${1 - idx * 0.08})` }}
                        >
                          {config[k] ? <img src={config[k]} alt="" className="w-full h-full object-cover" /> : i}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-0.5 mb-0.5">
                        {'★★★★★'.split('').map((s, i) => (
                          <span key={i} className="text-[#ffd600] text-xs">{s}</span>
                        ))}
                        <span className="text-white text-xs font-black ml-1">{Number(config.hero_rating).toFixed(1)}</span>
                      </div>
                      <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                        +{Number(config.hero_clientes_count).toLocaleString('es-PE')} clientes
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* ── SISTEMA ── */}
          {seccion === 'sistema' && (
            <>
              <SectionHeader Icon={Settings} title="Configuración del Sistema" desc="Mantenimiento y reservas" />
              <div className="space-y-6">

                {/* Modo mantenimiento */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-sm font-bold text-[#001f3f]">Modo Mantenimiento</p>
                      <p className="text-xs text-gray-500 mt-0.5">Cuando está activo, el sitio público muestra un mensaje de mantenimiento.</p>
                    </div>
                    <Toggle
                      activo={config.modo_mantenimiento}
                      onChange={v => set('modo_mantenimiento', v)}
                      labelOn="Activo"
                      labelOff="Inactivo"
                    />
                  </div>
                  {config.modo_mantenimiento && (
                    <div>
                      <label htmlFor="mensaje-mantenimiento" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Mensaje de mantenimiento
                      </label>
                      <textarea
                        id="mensaje-mantenimiento"
                        className="w-full px-4 py-3 border-0 border-b-2 border-amber-300 bg-amber-50 rounded-t-lg focus:outline-none focus:border-[#ffd600] transition-all text-sm text-gray-800 resize-none"
                        rows={2}
                        value={config.mensaje_mantenimiento}
                        onChange={e => set('mensaje_mantenimiento', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Reservas activas */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#001f3f]">Reservas por WhatsApp</p>
                      <p className="text-xs text-gray-500 mt-0.5">Permite o bloquea que los clientes hagan reservas desde el sitio web.</p>
                    </div>
                    <Toggle
                      activo={config.reservas_activas}
                      onChange={v => set('reservas_activas', v)}
                      labelOn="Activas"
                      labelOff="Desactivadas"
                    />
                  </div>
                </div>

                {/* Moneda por defecto */}
                <div className="hidden">
                  <p className="text-sm font-bold text-[#001f3f] mb-1">Moneda por defecto</p>
                  <p className="text-xs text-gray-500 mb-3">Se usará como moneda predeterminada al crear habitaciones.</p>
                  <div className="flex gap-3">
                    {(['USD', 'PEN'] as const).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => set('moneda_default', m)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                          config.moneda_default === m
                            ? 'bg-[#001f3f] text-[#ffd600] border-[#001f3f]'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span aria-hidden="true">$</span>
                        {m === 'USD' ? '$ Dólar (USD)' : 'S/ Sol (PEN)'}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function SectionHeader({ Icon, title, desc }: { Icon: typeof Settings; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
      <div className="w-9 h-9 bg-[#001f3f] rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon size={17} className="text-[#ffd600]" />
      </div>
      <div>
        <h2 className="font-bold text-[#001f3f] text-base">{title}</h2>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

function SocialBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`${color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
      {label}
    </span>
  );
}
