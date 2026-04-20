'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/Input';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  User, Phone, Calendar, MessageCircle,
  Loader2, CheckCircle2, AlertCircle, Hotel, Star
} from 'lucide-react';

const hoy = () => new Date().toISOString().split('T')[0];

const esquemaReserva = z.object({
  nombreCliente: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  telefonoContacto: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  fechaIngreso: z.string().min(1, 'La fecha de ingreso es requerida'),
  fechaSalida: z.string().min(1, 'La fecha de salida es requerida'),
})
  .refine(data => data.fechaIngreso >= hoy(), {
    message: 'La fecha de ingreso no puede ser en el pasado',
    path: ['fechaIngreso'],
  })
  .refine(data => data.fechaSalida > data.fechaIngreso, {
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

export function FormularioReservaWhatsApp({ habitacion }: { habitacion: HabitacionResumen }) {
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<DatosFormulario>({
    resolver: zodResolver(esquemaReserva),
  });

  const fechaIngreso = watch('fechaIngreso');
  const fechaSalida = watch('fechaSalida');

  const noches = (() => {
    if (!fechaIngreso || !fechaSalida) return 0;
    const diff = new Date(fechaSalida).getTime() - new Date(fechaIngreso).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  })();

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
          fechaIngreso: datos.fechaIngreso,
          fechaSalida: datos.fechaSalida,
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
      toast.success('¡Solicitud enviada!', {
        description: 'Serás redirigido a WhatsApp en un momento.',
      });

      setTimeout(() => {
        if (resultado.urlWhatsApp) {
          window.open(resultado.urlWhatsApp, '_blank');
        }
      }, 1200);

    } catch {
      toast.error('Error de conexión', {
        description: 'Verifica tu conexión a internet e intenta de nuevo.',
      });
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

      {/* Resumen de la habitación */}
      <div className="bg-[#001f3f] rounded-2xl p-5 text-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#ffd600] rounded-xl flex items-center justify-center flex-shrink-0">
            <Hotel size={18} className="text-[#001f3f]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#ffd600] text-xs font-bold uppercase tracking-wider">{habitacion.hotelNombre}</p>
            <p className="text-white font-bold mt-0.5 truncate">{habitacion.nombre}</p>
            <div className="flex items-center gap-1 mt-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={10} className="text-[#ffd600] fill-[#ffd600]" />
              ))}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-extrabold text-[#ffd600]">${habitacion.precioNoche}</p>
            <p className="text-gray-400 text-xs">/noche</p>
          </div>
        </div>

        {/* Resumen de noches */}
        {noches > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-gray-300 text-sm">{noches} {noches === 1 ? 'noche' : 'noches'}</span>
            <span className="text-[#ffd600] font-extrabold text-lg">${habitacion.precioNoche * noches} total</span>
          </div>
        )}
      </div>

      {/* Campos */}
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
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none mt-3">
              <Calendar size={16} />
            </div>
            <Input
              label="Fecha de ingreso"
              type="date"
              min={hoy()}
              className="pl-9"
              {...register('fechaIngreso')}
              error={errors.fechaIngreso?.message}
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none mt-3">
              <Calendar size={16} />
            </div>
            <Input
              label="Fecha de salida"
              type="date"
              min={hoy()}
              className="pl-9"
              {...register('fechaSalida')}
              error={errors.fechaSalida?.message}
            />
          </div>
        </div>
      </div>

      {/* Aviso */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3.5">
        <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-blue-700 text-xs leading-relaxed">
          Al confirmar, se registrará tu solicitud y serás redirigido a WhatsApp para hablar directamente con recepción.
        </p>
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={enviando}
        className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {enviando ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <MessageCircle size={18} />
            Reservar por WhatsApp
          </>
        )}
      </button>
    </form>
  );
}
