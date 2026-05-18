import { describe, expect, it } from 'vitest';
import {
  esquemaHotelAdmin,
  esquemaReservaPublica,
  esquemaUsuarioCrearAdmin,
} from './admin-validaciones';

describe('validaciones admin', () => {
  it('acepta hoteles completos con datos normalizados', () => {
    const result = esquemaHotelAdmin.parse({
      nombre: 'Hotel Adventur',
      descripcion: 'Hotel centrico para viajeros.',
      ciudad: 'Cajamarca',
      direccion: 'Jr. Amazonas 1079',
      telefono_whatsapp: '+51958101721',
      email_contacto: 'reservas@adventur.pe',
      estrellas: 4,
      tipo_alojamiento: 'Hotel',
      imagenes_urls: [],
      activo: true,
    });

    expect(result.estrellas).toBe(4);
    expect(result.activo).toBe(true);
  });

  it('permite crear usuarios viewer para solo lectura', () => {
    const result = esquemaUsuarioCrearAdmin.parse({
      nombreCompleto: 'Usuario Lectura',
      correo: 'viewer@adventur.pe',
      contrasena: 'segura123',
      rol: 'viewer',
      fotoUrl: '',
    });

    expect(result.rol).toBe('viewer');
  });

  it('rechaza reservas con salida anterior al ingreso', () => {
    const result = esquemaReservaPublica.safeParse({
      habitacionId: 'hab-1',
      nombreCliente: 'Cliente',
      telefonoContacto: '+51999999999',
      fechaIngreso: '2026-06-10',
      fechaSalida: '2026-06-09',
    });

    expect(result.success).toBe(false);
  });
});
