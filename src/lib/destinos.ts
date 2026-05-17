import { createReadonlyClient } from '@/lib/supabase/readonly';
import { unstable_cache } from 'next/cache';

export interface Destino {
  slug: string;
  nombre: string;
  departamento: string;
  tipo: string;
}

export interface DestinoProcedencia extends Destino {
  hayOfertaDirecta: boolean;
}

const destinosBase: Destino[] = [
  { slug: 'amazonas', nombre: 'Amazonas', departamento: 'Amazonas', tipo: 'departamento' },
  { slug: 'chachapoyas', nombre: 'Chachapoyas', departamento: 'Amazonas', tipo: 'ciudad' },
  { slug: 'gocta', nombre: 'Gocta', departamento: 'Amazonas', tipo: 'atractivo' },
  { slug: 'ancash', nombre: 'Áncash', departamento: 'Áncash', tipo: 'departamento' },
  { slug: 'chimbote', nombre: 'Chimbote', departamento: 'Áncash', tipo: 'ciudad' },
  { slug: 'huaraz', nombre: 'Huaraz', departamento: 'Áncash', tipo: 'ciudad' },
  { slug: 'apurimac', nombre: 'Apurímac', departamento: 'Apurímac', tipo: 'departamento' },
  { slug: 'abancay', nombre: 'Abancay', departamento: 'Apurímac', tipo: 'ciudad' },
  { slug: 'arequipa', nombre: 'Arequipa', departamento: 'Arequipa', tipo: 'departamento' },
  { slug: 'colca', nombre: 'Colca', departamento: 'Arequipa', tipo: 'atractivo' },
  { slug: 'ayacucho', nombre: 'Ayacucho', departamento: 'Ayacucho', tipo: 'departamento' },
  { slug: 'cajamarca', nombre: 'Cajamarca', departamento: 'Cajamarca', tipo: 'departamento' },
  { slug: 'chota', nombre: 'Chota', departamento: 'Cajamarca', tipo: 'ciudad' },
  { slug: 'cutervo', nombre: 'Cutervo', departamento: 'Cajamarca', tipo: 'ciudad' },
  { slug: 'cajabamba', nombre: 'Cajabamba', departamento: 'Cajamarca', tipo: 'ciudad' },
  { slug: 'celendin', nombre: 'Celendín', departamento: 'Cajamarca', tipo: 'ciudad' },
  { slug: 'san-miguel-cajamarca', nombre: 'San Miguel', departamento: 'Cajamarca', tipo: 'ciudad' },
  { slug: 'santa-cruz-cajamarca', nombre: 'Santa Cruz', departamento: 'Cajamarca', tipo: 'ciudad' },
  { slug: 'bambamarca', nombre: 'Bambamarca', departamento: 'Cajamarca', tipo: 'ciudad' },
  { slug: 'cusco', nombre: 'Cusco', departamento: 'Cusco', tipo: 'departamento' },
  { slug: 'valle-sagrado', nombre: 'Valle Sagrado', departamento: 'Cusco', tipo: 'zona' },
  { slug: 'machupicchu', nombre: 'Machupicchu', departamento: 'Cusco', tipo: 'atractivo' },
  { slug: 'huancavelica', nombre: 'Huancavelica', departamento: 'Huancavelica', tipo: 'departamento' },
  { slug: 'huanuco', nombre: 'Huánuco', departamento: 'Huánuco', tipo: 'departamento' },
  { slug: 'tingo-maria', nombre: 'Tingo María', departamento: 'Huánuco', tipo: 'ciudad' },
  { slug: 'ica', nombre: 'Ica', departamento: 'Ica', tipo: 'departamento' },
  { slug: 'paracas', nombre: 'Paracas', departamento: 'Ica', tipo: 'ciudad' },
  { slug: 'junin', nombre: 'Junín', departamento: 'Junín', tipo: 'departamento' },
  { slug: 'huancayo', nombre: 'Huancayo', departamento: 'Junín', tipo: 'ciudad' },
  { slug: 'la-merced', nombre: 'La Merced', departamento: 'Junín', tipo: 'ciudad' },
  { slug: 'oxapampa', nombre: 'Oxapampa', departamento: 'Pasco', tipo: 'ciudad' },
  { slug: 'pozuzo', nombre: 'Pozuzo', departamento: 'Pasco', tipo: 'ciudad' },
  { slug: 'la-libertad', nombre: 'La Libertad', departamento: 'La Libertad', tipo: 'departamento' },
  { slug: 'trujillo', nombre: 'Trujillo', departamento: 'La Libertad', tipo: 'ciudad' },
  { slug: 'pacasmayo', nombre: 'Pacasmayo', departamento: 'La Libertad', tipo: 'ciudad' },
  { slug: 'lambayeque', nombre: 'Lambayeque', departamento: 'Lambayeque', tipo: 'departamento' },
  { slug: 'chiclayo', nombre: 'Chiclayo', departamento: 'Lambayeque', tipo: 'ciudad' },
  { slug: 'lima', nombre: 'Lima', departamento: 'Lima', tipo: 'departamento' },
  { slug: 'la-victoria', nombre: 'La Victoria', departamento: 'Lima', tipo: 'distrito' },
  { slug: 'lince', nombre: 'Lince', departamento: 'Lima', tipo: 'distrito' },
  { slug: 'barranco', nombre: 'Barranco', departamento: 'Lima', tipo: 'distrito' },
  { slug: 'miraflores', nombre: 'Miraflores', departamento: 'Lima', tipo: 'distrito' },
  { slug: 'loreto', nombre: 'Loreto', departamento: 'Loreto', tipo: 'departamento' },
  { slug: 'iquitos', nombre: 'Iquitos', departamento: 'Loreto', tipo: 'ciudad' },
  { slug: 'madre-de-dios', nombre: 'Madre de Dios', departamento: 'Madre de Dios', tipo: 'departamento' },
  { slug: 'moquegua', nombre: 'Moquegua', departamento: 'Moquegua', tipo: 'departamento' },
  { slug: 'pasco', nombre: 'Pasco', departamento: 'Pasco', tipo: 'departamento' },
  { slug: 'cerro-de-pasco', nombre: 'Cerro de Pasco', departamento: 'Pasco', tipo: 'ciudad' },
  { slug: 'piura', nombre: 'Piura', departamento: 'Piura', tipo: 'departamento' },
  { slug: 'mancora', nombre: 'Máncora', departamento: 'Piura', tipo: 'ciudad' },
  { slug: 'vichayito', nombre: 'Vichayito', departamento: 'Piura', tipo: 'playa' },
  { slug: 'punta-sal', nombre: 'Punta Sal', departamento: 'Tumbes', tipo: 'playa' },
  { slug: 'zorritos', nombre: 'Zorritos', departamento: 'Tumbes', tipo: 'playa' },
  { slug: 'puno', nombre: 'Puno', departamento: 'Puno', tipo: 'departamento' },
  { slug: 'juliaca', nombre: 'Juliaca', departamento: 'Puno', tipo: 'ciudad' },
  { slug: 'san-martin', nombre: 'San Martín', departamento: 'San Martín', tipo: 'departamento' },
  { slug: 'tarapoto', nombre: 'Tarapoto', departamento: 'San Martín', tipo: 'ciudad' },
  { slug: 'tacna', nombre: 'Tacna', departamento: 'Tacna', tipo: 'departamento' },
  { slug: 'tumbes', nombre: 'Tumbes', departamento: 'Tumbes', tipo: 'departamento' },
  { slug: 'ucayali', nombre: 'Ucayali', departamento: 'Ucayali', tipo: 'departamento' },
];

export const obtenerDestinos = unstable_cache(
  async (): Promise<Destino[]> => {
    try {
      const supabase = createReadonlyClient();
      const { data, error } = await supabase
        .from('destinos')
        .select('slug,nombre,departamento,tipo')
        .eq('activo', true)
        .order('departamento', { ascending: true })
        .order('nombre', { ascending: true });

      if (error || !data?.length) return destinosBase;
      return data as Destino[];
    } catch {
      return destinosBase;
    }
  },
  ['destinos'],
  { revalidate: 3600, tags: ['destinos'] }
);

function normalizarProcedencia(valor: string) {
  return valor.trim().toLowerCase();
}

export function prepararProcedencias(
  destinos: Destino[],
  ciudadesConHoteles: string[],
  limitePrincipales = 15,
) {
  const ciudadesNormalizadas = new Set(ciudadesConHoteles.map(normalizarProcedencia));

  const ordenados: DestinoProcedencia[] = [...destinos]
    .map((destino) => ({
      ...destino,
      hayOfertaDirecta: ciudadesNormalizadas.has(normalizarProcedencia(destino.nombre)),
    }))
    .sort((a, b) => {
      if (a.hayOfertaDirecta !== b.hayOfertaDirecta) return a.hayOfertaDirecta ? -1 : 1;
      if (a.tipo === 'departamento' && b.tipo !== 'departamento') return -1;
      if (a.tipo !== 'departamento' && b.tipo === 'departamento') return 1;
      return a.nombre.localeCompare(b.nombre, 'es');
    });

  return {
    departamentos: [...new Set(destinos.map((destino) => destino.departamento))],
    principales: ordenados.slice(0, limitePrincipales),
    restantes: ordenados.slice(limitePrincipales),
  };
}
