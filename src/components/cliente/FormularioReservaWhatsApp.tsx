'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { DayPicker } from 'react-day-picker';
import { format, differenceInCalendarDays, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/style.css';
import {
  User, Calendar, MessageCircle,
  Loader2, CheckCircle2, AlertCircle, Hotel, Star, ChevronDown, Search, BanIcon,
} from 'lucide-react';
import { useConfiguracionWeb } from '@/hooks/useConfiguracionWeb';

interface PaisTelefono {
  iso: string;
  codigo: string;
  pais: string;
  bandera: string;
  digitosMin: number;
  digitosMax: number;
}

const PAISES: PaisTelefono[] = [
  { iso: 'PE', codigo: '+51',  pais: 'Perú',          bandera: '🇵🇪', digitosMin: 9,  digitosMax: 9  },
  { iso: 'CO', codigo: '+57',  pais: 'Colombia',      bandera: '🇨🇴', digitosMin: 10, digitosMax: 10 },
  { iso: 'EC', codigo: '+593', pais: 'Ecuador',       bandera: '🇪🇨', digitosMin: 9,  digitosMax: 10 },
  { iso: 'BO', codigo: '+591', pais: 'Bolivia',       bandera: '🇧🇴', digitosMin: 8,  digitosMax: 8  },
  { iso: 'CL', codigo: '+56',  pais: 'Chile',         bandera: '🇨🇱', digitosMin: 9,  digitosMax: 9  },
  { iso: 'AR', codigo: '+54',  pais: 'Argentina',     bandera: '🇦🇷', digitosMin: 10, digitosMax: 11 },
  { iso: 'BR', codigo: '+55',  pais: 'Brasil',        bandera: '🇧🇷', digitosMin: 10, digitosMax: 11 },
  { iso: 'MX', codigo: '+52',  pais: 'México',        bandera: '🇲🇽', digitosMin: 10, digitosMax: 10 },
  { iso: 'VE', codigo: '+58',  pais: 'Venezuela',     bandera: '🇻🇪', digitosMin: 10, digitosMax: 10 },
  { iso: 'UY', codigo: '+598', pais: 'Uruguay',       bandera: '🇺🇾', digitosMin: 8,  digitosMax: 9  },
  { iso: 'PY', codigo: '+595', pais: 'Paraguay',      bandera: '🇵🇾', digitosMin: 9,  digitosMax: 9  },
  { iso: 'PA', codigo: '+507', pais: 'Panamá',        bandera: '🇵🇦', digitosMin: 8,  digitosMax: 8  },
  { iso: 'CR', codigo: '+506', pais: 'Costa Rica',    bandera: '🇨🇷', digitosMin: 8,  digitosMax: 8  },
  { iso: 'GT', codigo: '+502', pais: 'Guatemala',     bandera: '🇬🇹', digitosMin: 8,  digitosMax: 8  },
  { iso: 'HN', codigo: '+504', pais: 'Honduras',      bandera: '🇭🇳', digitosMin: 8,  digitosMax: 8  },
  { iso: 'SV', codigo: '+503', pais: 'El Salvador',   bandera: '🇸🇻', digitosMin: 8,  digitosMax: 8  },
  { iso: 'NI', codigo: '+505', pais: 'Nicaragua',     bandera: '🇳🇮', digitosMin: 8,  digitosMax: 8  },
  { iso: 'CU', codigo: '+53',  pais: 'Cuba',          bandera: '🇨🇺', digitosMin: 8,  digitosMax: 8  },
  { iso: 'DO', codigo: '+1',   pais: 'R. Dominicana', bandera: '🇩🇴', digitosMin: 10, digitosMax: 10 },
  { iso: 'HT', codigo: '+509', pais: 'Haití',         bandera: '🇭🇹', digitosMin: 8,  digitosMax: 8  },
  { iso: 'US', codigo: '+1',   pais: 'EE.UU.',        bandera: '🇺🇸', digitosMin: 10, digitosMax: 10 },
  { iso: 'CA', codigo: '+1',   pais: 'Canadá',        bandera: '🇨🇦', digitosMin: 10, digitosMax: 10 },
  { iso: 'ES', codigo: '+34',  pais: 'España',        bandera: '🇪🇸', digitosMin: 9,  digitosMax: 9  },
  { iso: 'PT', codigo: '+351', pais: 'Portugal',      bandera: '🇵🇹', digitosMin: 9,  digitosMax: 9  },
  { iso: 'FR', codigo: '+33',  pais: 'Francia',       bandera: '🇫🇷', digitosMin: 9,  digitosMax: 9  },
  { iso: 'DE', codigo: '+49',  pais: 'Alemania',      bandera: '🇩🇪', digitosMin: 10, digitosMax: 11 },
  { iso: 'IT', codigo: '+39',  pais: 'Italia',        bandera: '🇮🇹', digitosMin: 9,  digitosMax: 10 },
  { iso: 'GB', codigo: '+44',  pais: 'Reino Unido',   bandera: '🇬🇧', digitosMin: 10, digitosMax: 10 },
  { iso: 'AU', codigo: '+61',  pais: 'Australia',     bandera: '🇦🇺', digitosMin: 9,  digitosMax: 9  },
  { iso: 'JP', codigo: '+81',  pais: 'Japón',         bandera: '🇯🇵', digitosMin: 10, digitosMax: 11 },
  { iso: 'CN', codigo: '+86',  pais: 'China',         bandera: '🇨🇳', digitosMin: 11, digitosMax: 11 },
];

const PAIS_DEFECTO = PAISES[0];

const hoy = startOfDay(new Date());

const esquemaReserva = z.object({
  nombreCliente: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  telefonoContacto: z
    .string()
    .min(5, 'Ingresa el número de teléfono')
    .max(15, 'El número es demasiado largo')
    .regex(/^\d+$/, 'Solo dígitos, sin espacios ni guiones'),
  fechaIngreso: z.date({ error: 'La fecha de ingreso es requerida' }),
  fechaSalida: z.date({ error: 'La fecha de salida es requerida' }),
}).refine(d => !isBefore(d.fechaIngreso, hoy), {
  message: 'La fecha de ingreso no puede ser en el pasado',
  path: ['fechaIngreso'],
}).refine(d => d.fechaSalida > d.fechaIngreso, {
  message: 'La fecha de salida debe ser posterior a la de ingreso',
  path: ['fechaSalida'],
});

type DatosFormulario = z.infer<typeof esquemaReserva>;

interface HabitacionResumen {
  id: string;
  nombre: string;
  precioNoche: number;
  moneda?: 'PEN' | 'USD';
  hotelNombre: string;
  hotelEstrellas?: number;
}

function SelectorCodigoPais({
  value,
  onChange,
  tieneError,
}: {
  value: PaisTelefono;
  onChange: (p: PaisTelefono) => void;
  tieneError?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
        setBusqueda('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtrados = busqueda
    ? PAISES.filter(p =>
        p.pais.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigo.includes(busqueda)
      )
    : PAISES;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className={`flex items-center gap-1.5 h-full px-3 py-3 border-0 border-b-2 bg-gray-50 rounded-tl-lg text-sm transition-all focus:outline-none ${
          tieneError
            ? 'border-red-400'
            : abierto
            ? 'border-(--brand-yellow) bg-white'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className="text-base leading-none">{value.bandera}</span>
        <span className="text-xs font-bold text-gray-600 tabular-nums">{value.codigo}</span>
        <ChevronDown
          size={11}
          className={`text-gray-400 transition-transform ${abierto ? 'rotate-180' : ''}`}
        />
      </button>

      {abierto && (
        <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <Search size={13} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar país o código..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="bg-transparent text-xs flex-1 outline-none text-gray-700 placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>
          <ul className="max-h-56 overflow-y-auto">
            {filtrados.map(p => (
              <li key={p.iso}>
                <button
                  type="button"
                  onClick={() => { onChange(p); setAbierto(false); setBusqueda(''); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 ${
                    p.iso === value.iso ? 'bg-(--brand-yellow)/10' : ''
                  }`}
                >
                  <span className="text-base leading-none">{p.bandera}</span>
                  <span className="text-xs font-medium text-gray-700 flex-1">{p.pais}</span>
                  <span className="text-xs text-gray-400 font-mono tabular-nums">{p.codigo}</span>
                </button>
              </li>
            ))}
            {filtrados.length === 0 && (
              <li className="text-xs text-gray-400 text-center py-6">Sin resultados</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function SelectorFecha({
  label,
  value,
  onChange,
  error,
  disabled,
  minDate,
}: {
  label: string;
  value?: Date;
  onChange: (d: Date | undefined) => void;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setAbierto(!abierto)}
        className={`w-full flex items-center justify-between px-4 py-3 border-0 border-b-2 bg-gray-50 rounded-t-lg text-sm transition-all focus:outline-none ${
          error ? 'border-red-400' : abierto ? 'border-(--brand-yellow) bg-white' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={`flex items-center gap-2 ${value ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
          <Calendar size={14} />
          {value ? format(value, 'dd MMM yyyy', { locale: es }) : 'Seleccionar fecha'}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${abierto ? 'rotate-180' : ''}`} />
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {abierto && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2">
          <DayPicker
            mode="single"
            selected={value}
            onSelect={d => { onChange(d); setAbierto(false); }}
            disabled={minDate ? { before: minDate } : { before: hoy }}
            locale={es}
            classNames={{
              today: 'font-bold text-(--brand-navy)',
              selected: 'bg-(--brand-navy) text-white rounded-lg',
              day_button: 'w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-sm',
              nav: 'flex items-center justify-between mb-2',
              month_caption: 'text-sm font-bold text-(--brand-navy) capitalize',
            }}
          />
        </div>
      )}
    </div>
  );
}

export function FormularioReservaWhatsApp({ habitacion }: { habitacion: HabitacionResumen }) {
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [paisSeleccionado, setPaisSeleccionado] = useState<PaisTelefono>(PAIS_DEFECTO);
  const config = useConfiguracionWeb();
  const simbolo = habitacion.moneda === 'PEN' ? 'S/' : '$';

  if (!config.reservas_activas) {
    return (
      <div className="text-center py-10 px-4">
        <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <BanIcon size={28} className="text-amber-500" />
        </div>
        <h3 className="text-base font-bold text-(--brand-navy) mb-2">Reservas temporalmente desactivadas</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {config.mensaje_mantenimiento || 'Estamos realizando mejoras. Vuelve pronto.'}
        </p>
      </div>
    );
  }

  const {
    register, handleSubmit, control, watch, setError,
    formState: { errors },
  } = useForm<DatosFormulario>({ resolver: zodResolver(esquemaReserva) });

  // eslint-disable-next-line react-hooks/incompatible-library
  const fechaIngreso = watch('fechaIngreso');
  const fechaSalida = watch('fechaSalida');

  const noches = fechaIngreso && fechaSalida
    ? Math.max(0, differenceInCalendarDays(fechaSalida, fechaIngreso))
    : 0;

  const enviar = async (datos: DatosFormulario) => {
    const soloDigitos = datos.telefonoContacto.replace(/\D/g, '');
    const { digitosMin, digitosMax, pais, codigo } = paisSeleccionado;

    if (soloDigitos.length < digitosMin || soloDigitos.length > digitosMax) {
      const rango =
        digitosMin === digitosMax ? `${digitosMin} dígitos` : `${digitosMin}–${digitosMax} dígitos`;
      setError('telefonoContacto', {
        message: `Para ${pais} el número debe tener ${rango}`,
      });
      return;
    }

    const telefonoCompleto = `${codigo.replace('+', '')}${soloDigitos}`;

    setEnviando(true);
    try {
      const respuesta = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitacionId: habitacion.id,
          nombreCliente: datos.nombreCliente,
          telefonoContacto: telefonoCompleto,
          fechaIngreso: format(datos.fechaIngreso, 'yyyy-MM-dd'),
          fechaSalida: format(datos.fechaSalida, 'yyyy-MM-dd'),
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        toast.error(resultado.error ?? 'Error al procesar la solicitud', {
          description: 'Intenta de nuevo o contacta al hotel directamente.',
        });
        return;
      }

      setExito(true);
      toast.success('¡Solicitud enviada!', { description: 'Serás redirigido a WhatsApp en un momento.' });

      setTimeout(() => {
        if (resultado.urlWhatsApp) window.open(resultado.urlWhatsApp, '_blank');
      }, 1200);
    } catch {
      toast.error('Error de conexión', { description: 'Verifica tu conexión e intenta de nuevo.' });
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-(--brand-navy) mb-2">¡Solicitud registrada!</h3>
        <p className="text-gray-500 text-sm">Abriendo WhatsApp para confirmar con el hotel...</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
          <Loader2 size={14} className="animate-spin" />
          Redirigiendo...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(enviar)} className="space-y-5">

      {/* Resumen de habitación */}
      <div className="bg-(--brand-navy) rounded-2xl p-5 text-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-(--brand-yellow) rounded-xl flex items-center justify-center shrink-0">
            <Hotel size={18} className="text-(--brand-navy)" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-(--brand-yellow) text-xs font-bold uppercase tracking-wider">{habitacion.hotelNombre}</p>
            <p className="text-white font-bold mt-0.5 truncate">{habitacion.nombre}</p>
            {habitacion.hotelEstrellas && habitacion.hotelEstrellas > 0 && (
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: habitacion.hotelEstrellas }).map((_, i) => (
                  <Star key={i} size={10} className="text-(--brand-yellow) fill-(--brand-yellow)" />
                ))}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-extrabold text-(--brand-yellow) leading-none">{simbolo}{habitacion.precioNoche}</p>
            <p className="text-gray-400 text-xs mt-0.5">/noche</p>
          </div>
        </div>
        {noches > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-gray-300 text-sm">{noches} {noches === 1 ? 'noche' : 'noches'}</span>
            <span className="text-(--brand-yellow) font-extrabold text-lg">{simbolo}{habitacion.precioNoche * noches} total</span>
          </div>
        )}
      </div>

      {/* Campos */}
      <div className="space-y-4">

        {/* Nombre */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none mt-3">
            <User size={16} />
          </div>
          <Input
            label="Nombre completo"
            placeholder="Tu nombre completo"
            className="pl-9"
            {...register('nombreCliente')}
            error={errors.nombreCliente?.message}
          />
        </div>

        {/* Teléfono con selector de país */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Teléfono de contacto
          </label>
          <div className={`flex rounded-t-lg border-b-2 transition-colors ${
            errors.telefonoContacto ? 'border-red-400' : 'border-gray-200'
          }`}>
            <SelectorCodigoPais
              value={paisSeleccionado}
              onChange={setPaisSeleccionado}
              tieneError={!!errors.telefonoContacto}
            />
            <div className="w-px bg-gray-200 shrink-0" />
            <input
              type="tel"
              inputMode="numeric"
              placeholder={`${paisSeleccionado.digitosMin}${paisSeleccionado.digitosMin !== paisSeleccionado.digitosMax ? `–${paisSeleccionado.digitosMax}` : ''} dígitos`}
              {...register('telefonoContacto')}
              className="flex-1 min-w-0 px-3 py-3 bg-gray-50 text-sm text-gray-800 outline-none placeholder-gray-400 focus:bg-white transition-colors rounded-tr-lg"
            />
          </div>
          {errors.telefonoContacto && (
            <p className="mt-1 text-xs text-red-500">{errors.telefonoContacto.message}</p>
          )}
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="fechaIngreso"
            control={control}
            render={({ field }) => (
              <SelectorFecha
                label="Fecha de ingreso"
                value={field.value}
                onChange={field.onChange}
                error={errors.fechaIngreso?.message}
                minDate={hoy}
              />
            )}
          />
          <Controller
            name="fechaSalida"
            control={control}
            render={({ field }) => (
              <SelectorFecha
                label="Fecha de salida"
                value={field.value}
                onChange={field.onChange}
                error={errors.fechaSalida?.message}
                minDate={fechaIngreso ?? hoy}
              />
            )}
          />
        </div>
      </div>

      {/* Aviso */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3.5">
        <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-blue-700 text-xs leading-relaxed">
          Al confirmar, se registrará tu solicitud y serás redirigido a WhatsApp para hablar directamente con recepción.
        </p>
      </div>

      {/* Botón submit */}
      <button
        type="submit"
        disabled={enviando}
        className="w-full flex items-center justify-center gap-2.5 bg-(--whatsapp-green) hover:bg-(--whatsapp-green-hover) active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {enviando
          ? <><Loader2 size={18} className="animate-spin" /> Procesando...</>
          : <><MessageCircle size={18} /> Reservar por WhatsApp</>
        }
      </button>
    </form>
  );
}
