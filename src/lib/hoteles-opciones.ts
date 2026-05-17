import type { TipoAlojamiento } from '@/modules/hoteles/dominio/entidades/Hotel';

export const ICONOS_TIPO_ALOJAMIENTO: Record<TipoAlojamiento, string> = {
  Hotel: 'Hotel',
  Hostal: 'Hostal',
  'Apart-hotel': 'Apart-hotel',
  Resort: 'Resort',
  Ecolodge: 'Ecolodge',
  Albergue: 'Albergue',
};

export const TIPOS_ALOJAMIENTO = Object.entries(ICONOS_TIPO_ALOJAMIENTO).map(
  ([val]) => ({ val: val as TipoAlojamiento, emoji: '' }),
);

export const CATEGORIA_OPCIONES = [
  { val: '', label: 'Todas', stars: 0 },
  { val: '5', label: 'Luxury', stars: 5 },
  { val: '4', label: 'Premium', stars: 4 },
  { val: '3', label: 'Estándar', stars: 3 },
  { val: '2', label: 'Económico', stars: 2 },
  { val: '1', label: 'Básico', stars: 1 },
];

export const CATEGORIAS_HERO = [
  { value: '', label: 'Cualquier clase' },
  { value: '5', label: 'Luxury (5 ★)' },
  { value: '4', label: 'Premium (4 ★)' },
  { value: '3', label: 'Estándar (3 ★)' },
];

export const PRECIO_OPCIONES = [
  { val: '', label: 'Cualquier precio' },
  { val: 'hasta100', label: 'Hasta S/100' },
  { val: '100a300', label: 'S/100 - S/300' },
  { val: 'mas300', label: 'Más de S/300' },
];

export const ORDEN_OPCIONES = [
  { val: '', label: 'Recomendados' },
  { val: 'estrellas_desc', label: 'Mayor categoría' },
  { val: 'estrellas_asc', label: 'Menor categoría' },
  { val: 'precio_asc', label: 'Menor precio' },
  { val: 'precio_desc', label: 'Mayor precio' },
  { val: 'nombre', label: 'A-Z' },
];

export function normalizarTextoFiltro(valor: string) {
  return valor.trim().toLowerCase();
}

export interface ParametrosHoteles {
  ciudad?: string;
  estrellas?: string;
  orden?: string;
  q?: string;
  tipo?: string;
  precio?: string;
  vista?: string;
}

export function construirUrlHoteles(
  actuales: ParametrosHoteles,
  cambios: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  if (actuales.ciudad) params.set('ciudad', actuales.ciudad);
  if (actuales.estrellas) params.set('estrellas', actuales.estrellas);
  if (actuales.orden) params.set('orden', actuales.orden);
  if (actuales.q) params.set('q', actuales.q);
  if (actuales.tipo) params.set('tipo', actuales.tipo);
  if (actuales.precio) params.set('precio', actuales.precio);
  if (actuales.vista && actuales.vista !== 'grid') params.set('vista', actuales.vista);

  Object.entries(cambios).forEach(([key, value]) => {
    if (value === undefined || value === '') params.delete(key);
    else params.set(key, value);
  });

  const query = params.toString();
  return `/hoteles${query ? `?${query}` : ''}`;
}
