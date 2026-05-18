import { describe, expect, it } from 'vitest';
import { mapHabitacionDb, mapHotelDb } from './mappers';

describe('mappers DB a dominio', () => {
  it('mapea hoteles snake_case a camelCase', () => {
    const hotel = mapHotelDb({
      id: 'hotel-1',
      nombre: 'Hotel Adventur',
      descripcion: 'Descripcion',
      ciudad: 'Cajamarca',
      direccion: 'Centro',
      telefono_whatsapp: '+51958101721',
      imagenes_urls: ['https://example.com/hotel.jpg'],
      estrellas: 4,
      tipo_alojamiento: 'Hotel',
      activo: true,
      fecha_creacion: '2026-01-01T00:00:00Z',
    });

    expect(hotel.telefonoWhatsapp).toBe('+51958101721');
    expect(hotel.imagenesUrls).toHaveLength(1);
    expect(hotel.activo).toBe(true);
  });

  it('mapea habitaciones con defaults seguros', () => {
    const habitacion = mapHabitacionDb({
      id: 'hab-1',
      hotel_id: 'hotel-1',
      nombre: 'Suite',
      tipo_habitacion: 'SUI',
      capacidad_personas: 2,
      precio_noche: '120',
      esta_disponible: true,
      fecha_creacion: '2026-01-01T00:00:00Z',
    });

    expect(habitacion.hotelId).toBe('hotel-1');
    expect(habitacion.moneda).toBe('USD');
    expect(habitacion.estadoMantenimiento).toBe('disponible');
  });
});
