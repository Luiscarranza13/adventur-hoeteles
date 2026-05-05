'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { toast } from 'sonner';
import { DayPicker } from 'react-day-picker';
import { format, differenceInCalendarDays, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/style.css';
import {
  User, Phone, Calendar, MessageCircle,
  Loader2, CheckCircle2, AlertCircle, Hotel, Star, ChevronDown
} from 'lucide-react';

const hoy = startOfDay(new Date());

const esquemaReserva = z.object({
  nombreCliente: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  telefonoContacto: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
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
  hotelNombre: string;
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
          error ? 'border-red-400' : abierto ? 'border-[#ffd600] bg-white' : 'border-gray-200 hover:border-gray-300'
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
              today: 'font-bold text-[#001f3f]',
              selected: 'bg-[#001f3f] text-white rounded-lg',
              day_button: 'w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-sm',
              nav: 'flex items-center justify-between mb-2',
              month_caption: 'text-sm font-bold text-[#001f3f] capitalize',
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

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<DatosFormulario>({
    resolver: zodResolver(esquemaReserva),
  });

  const fechaIngreso = watch('fechaIngreso');
  const fechaSalida = watch('fechaSalida');

  const noches = fechaIngreso && fechaSalida
    ? Math.max(0, differenceInCalendarDays(fechaSalida, fechaIngreso))
    : 0;

  const enviar = async (datos: DatosFormulario) => {
    setEnviando(true);
    try {
      const respuesta = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitacionId: habitacion.id,
          nombreCliente: datos.nombreCliente,
          telefonoContacto: datos.telefonoContacto,
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
      toast.error('Error de conexión', { description: 'Verifica tu conexión a internet e intenta de nuevo.' });
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
        <h3 className="text-xl font-bold text-[#001f3f] mb-2">¡Solicitud registrada!</h3>
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
      <div className="bg-[#001f3f] rounded-2xl p-5 text-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#ffd600] rounded-xl flex items-center justify-center flex-shrink-0">
            <Hotel size={18} className="text-[#001f3f]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#ffd600] text-xs font-bold uppercase tracking-wider">{habitacion.hotelNombre}</p>
            <p className="text-white font-bold mt-0.5 truncate">{habitacion.nombre}</p>
            <div className="flex items-center gap-1 mt-1">
              {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-[#ffd600] fill-[#ffd600]" />)}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-extrabold text-[#ffd600]">${habitacion.precioNoche}</p>
            <p className="text-gray-400 text-xs">/noche</p>
          </div>
        </div>
        {noches > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-gray-300 text-sm">{noches} {noches === 1 ? 'noche' : 'noches'}</span>
            <span className="text-[#ffd600] font-extrabold text-lg">${habitacion.precioNoche * noches} total</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
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

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none mt-3">
            <Phone size={16} />
          </div>
          <Input
            label="Teléfono de contacto"
            placeholder="5215512345678"
            className="pl-9"
            {...register('telefonoContacto')}
            error={errors.telefonoContacto?.message}
          />
        </div>

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

      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3.5">
        <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-blue-700 text-xs leading-relaxed">
          Al confirmar, se registrará tu solicitud y serás redirigido a WhatsApp para hablar directamente con recepción.
        </p>
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {enviando
          ? <><Loader2 size={18} className="animate-spin" /> Procesando...</>
          : <><MessageCircle size={18} /> Reservar por WhatsApp</>
        }
      </button>
    </form>
  );
}
