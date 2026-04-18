'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useState } from 'react';

const esquemaReserva = z.object({
  nombreCliente: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  telefonoContacto: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  fechaIngreso: z.string().min(1, 'La fecha de ingreso es requerida'),
  fechaSalida: z.string().min(1, 'La fecha de salida es requerida'),
}).refine(data => new Date(data.fechaSalida) > new Date(data.fechaIngreso), {
  message: 'La fecha de salida debe ser posterior a la de ingreso',
  path: ['fechaSalida'],
});

type DatosFormulario = z.infer<typeof esquemaReserva>;

interface HabitacionInfo {
  id: string;
  nombre: string;
  precioNoche: number;
  hotelNombre: string;
}

interface FormularioReservaWhatsAppProps {
  habitacion: HabitacionInfo;
}

export function FormularioReservaWhatsApp({ habitacion }: FormularioReservaWhatsAppProps) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormulario>({
    resolver: zodResolver(esquemaReserva),
  });

  const onSubmit = async (data: DatosFormulario) => {
    setEnviando(true);
    setError('');
    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitacionId: habitacion.id,
          nombreCliente: data.nombreCliente,
          telefonoContacto: data.telefonoContacto,
          fechaIngreso: data.fechaIngreso,
          fechaSalida: data.fechaSalida,
        }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        setError(resultado.error || 'Error al procesar la solicitud');
        return;
      }

      if (resultado.urlWhatsApp) {
        window.open(resultado.urlWhatsApp, '_blank');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-[#001f3f]">🏨 {habitacion.hotelNombre}</h3>
        <p className="text-gray-600 mt-1">Habitación: {habitacion.nombre}</p>
        <p className="text-lg font-bold text-[#ffd600] mt-1">${habitacion.precioNoche}/noche</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Input
        label="Nombre completo"
        placeholder="Tu nombre completo"
        {...register('nombreCliente')}
        error={errors.nombreCliente?.message}
      />

      <Input
        label="Teléfono de contacto"
        placeholder="5215512345678"
        {...register('telefonoContacto')}
        error={errors.telefonoContacto?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Fecha de ingreso"
          type="date"
          {...register('fechaIngreso')}
          error={errors.fechaIngreso?.message}
        />
        <Input
          label="Fecha de salida"
          type="date"
          {...register('fechaSalida')}
          error={errors.fechaSalida?.message}
        />
      </div>

      <Button type="submit" className="w-full" disabled={enviando}>
        {enviando ? 'Procesando...' : '💬 Reservar por WhatsApp'}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        Al confirmar, se registrará tu solicitud y serás redirigido a WhatsApp para hablar directamente con recepción.
      </p>
    </form>
  );
}
