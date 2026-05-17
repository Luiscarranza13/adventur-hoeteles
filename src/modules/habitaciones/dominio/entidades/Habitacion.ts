export type TipoHabitacion =
  | 'SGL'
  | 'DBL'
  | 'TWN'
  | 'TPL'
  | 'QDL'
  | 'FAM'
  | 'SUI';

export type TipoCama = 'KB' | 'QB' | 'TB';

export type RegimeAlimentacion = 'RO' | 'BB' | 'HB' | 'FB' | 'AI';

export type EstadoMantenimiento = 'disponible' | 'mantenimiento' | 'bloqueado';

export type Moneda = 'USD' | 'PEN';

export const ETIQUETAS_TIPO_HABITACION: Record<TipoHabitacion, string> = {
  SGL: 'Single (1 persona)',
  DBL: 'Doble (matrimonial)',
  TWN: 'Twin (2 camas)',
  TPL: 'Triple (3 personas)',
  QDL: 'Cuádruple (4 personas)',
  FAM: 'Familiar',
  SUI: 'Suite',
};

export const ETIQUETAS_TIPO_CAMA: Record<TipoCama, string> = {
  KB: 'King Bed',
  QB: 'Queen Bed',
  TB: 'Twin Beds',
};

export const ETIQUETAS_REGIMEN: Record<RegimeAlimentacion, string> = {
  RO: 'Solo habitación',
  BB: 'Cama y desayuno',
  HB: 'Media pensión',
  FB: 'Pensión completa',
  AI: 'Todo incluido',
};

export interface Habitacion {
  id: string;
  hotelId: string;
  nombre: string;
  descripcion?: string;
  numeroHabitacion?: string;
  tipoHabitacion: TipoHabitacion;
  tipoCama?: TipoCama;
  regimenAlimentacion?: RegimeAlimentacion;
  capacidadPersonas: number;
  cantidadCamas: number;
  precioNoche: number;
  moneda: Moneda;
  amenidades: string[];
  imagenesUrls: string[];
  estaDisponible: boolean;
  estadoMantenimiento: EstadoMantenimiento;
  fechaCreacion: Date;
}

export interface DatosNuevaHabitacion {
  hotelId: string;
  nombre: string;
  descripcion?: string;
  numeroHabitacion?: string;
  tipoHabitacion?: TipoHabitacion;
  tipoCama?: TipoCama;
  regimenAlimentacion?: RegimeAlimentacion;
  capacidadPersonas: number;
  cantidadCamas?: number;
  precioNoche: number;
  moneda?: Moneda;
  amenidades?: string[];
  imagenesUrls?: string[];
  estaDisponible?: boolean;
  estadoMantenimiento?: EstadoMantenimiento;
}

export interface DatosActualizarHabitacion {
  nombre?: string;
  descripcion?: string;
  numeroHabitacion?: string;
  tipoHabitacion?: TipoHabitacion;
  tipoCama?: TipoCama;
  regimenAlimentacion?: RegimeAlimentacion;
  capacidadPersonas?: number;
  cantidadCamas?: number;
  precioNoche?: number;
  moneda?: Moneda;
  amenidades?: string[];
  imagenesUrls?: string[];
  estaDisponible?: boolean;
  estadoMantenimiento?: EstadoMantenimiento;
}
