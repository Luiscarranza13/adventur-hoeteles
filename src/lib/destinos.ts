import { createAdminClient } from '@/lib/supabase/admin';
import { unstable_cache } from 'next/cache';

export interface Destino {
  slug: string;
  nombre: string;
  departamento: string;
  tipo: string;
  imagen_url?: string | null;
}

export interface DestinoProcedencia extends Destino {
  hayOfertaDirecta: boolean;
}

const imagenPorSlug: Record<string, string> = {
  amazonas: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Gocta.jpg',
  chachapoyas: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Chachapoyas.jpg',
  gocta: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Gocta.jpg',
  ancash: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Alpamayo.jpg/1920px-Alpamayo.jpg',
  chimbote: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Playa_La_Caleta_desde_el_Cerro_de_la_Paz_-_DSC_0305.jpg/1920px-Playa_La_Caleta_desde_el_Cerro_de_la_Paz_-_DSC_0305.jpg',
  huaraz: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/HuarazyHuascaran.jpg',
  apurimac: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Uspaccocha_nevado.jpg/1920px-Uspaccocha_nevado.jpg',
  abancay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Abancay_montaje.png/1920px-Abancay_montaje.png',
  arequipa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Catedral_Arequipa%2C_Peru.jpg/1920px-Catedral_Arequipa%2C_Peru.jpg',
  colca: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Valley_of_Colca_River%2C_Peru.jpg/1920px-Valley_of_Colca_River%2C_Peru.jpg',
  ayacucho: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Ciudad_de_Ayacucho.jpg',
  cajamarca: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Plaza_de_cajamarca.jpg',
  chota: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Catedral_de_Chota.jpg',
  cutervo: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Plaza_de_aras.jpg',
  cajabamba: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Vista_de_la_Plaza_de_Armas_de_Cajabamba%2C_Per%C3%BA.jpg',
  celendin: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Celend%C3%ADn_1998_Plaza_Mayor_e_Iglesia.jpg',
  'san-miguel-cajamarca': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Plaza_de_Armas_terminada.jpg',
  'santa-cruz-cajamarca': 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Provincia_de_Santa_Cruz_-_Cajamarca.jpg',
  bambamarca: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Iglesia_bambamarca.jpg',
  cusco: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Plaza_de_Cusco_Allison_Bellido.jpg/1920px-Plaza_de_Cusco_Allison_Bellido.jpg',
  'valle-sagrado': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Around_Cusco_11-22_%2823622234585%29.jpg/1920px-Around_Cusco_11-22_%2823622234585%29.jpg',
  machupicchu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Machu_Picchu%2C_Peru_%282018%29.jpg/1920px-Machu_Picchu%2C_Peru_%282018%29.jpg',
  huancavelica: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Panor%C3%A1mica_de_Huancavelica.jpg/1920px-Panor%C3%A1mica_de_Huancavelica.jpg',
  huanuco: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Font_del_Parc_de_San_Sebasti%C3%A1n_amb_l%27esgl%C3%A9sia_de_San_Sebasti%C3%A1n_darrera_a_Hu%C3%A1nuco.jpg/1920px-Font_del_Parc_de_San_Sebasti%C3%A1n_amb_l%27esgl%C3%A9sia_de_San_Sebasti%C3%A1n_darrera_a_Hu%C3%A1nuco.jpg',
  'tingo-maria': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Bella_Durmiente_TM-Peru-1.jpg/1920px-Bella_Durmiente_TM-Peru-1.jpg',
  ica: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Oasis_de_Huacachina%2C_Ica%2C_Per%C3%BA%2C_2015-07-29%2C_DD_23.JPG/1920px-Oasis_de_Huacachina%2C_Ica%2C_Per%C3%BA%2C_2015-07-29%2C_DD_23.JPG',
  paracas: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Balneario_de_Paracas.jpg',
  junin: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Pampa_de_Junin_-_panoramio.jpg/1920px-Pampa_de_Junin_-_panoramio.jpg',
  huancayo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Hyowiki.jpg/1920px-Hyowiki.jpg',
  'la-merced': 'https://upload.wikimedia.org/wikipedia/commons/0/08/La_merced_2010.jpg',
  oxapampa: 'https://upload.wikimedia.org/wikipedia/commons/7/72/OxapampaPlaza.jpg',
  pozuzo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Pozuzo_10.jpg/1920px-Pozuzo_10.jpg',
  'la-libertad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ausgrabungsst%C3%A4tte_Huaca_de_la_Luna_78.jpg/1920px-Ausgrabungsst%C3%A4tte_Huaca_de_la_Luna_78.jpg',
  trujillo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Freedom_Monument%2C_Trujillo.jpg/1920px-Freedom_Monument%2C_Trujillo.jpg',
  pacasmayo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hotel_La_Estacion%2C_Pacasmayo.jpg/1920px-Hotel_La_Estacion%2C_Pacasmayo.jpg',
  lambayeque: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Tucume_Ueberblick.jpg/1920px-Tucume_Ueberblick.jpg',
  chiclayo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Photo_montage_Chiclayo.png/1920px-Photo_montage_Chiclayo.png',
  lima: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Lima2017_A.jpg',
  'la-victoria': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Santa_Catalina_en_Lima_Per%C3%BA_3.jpg/1920px-Santa_Catalina_en_Lima_Per%C3%BA_3.jpg',
  lince: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Est%C3%A0tua_de_Joan_Pau_II_a_Lince%2C_Lima.jpg/1920px-Est%C3%A0tua_de_Joan_Pau_II_a_Lince%2C_Lima.jpg',
  barranco: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/PUENTE_DE_LOS_SUSPIROS.jpg/1920px-PUENTE_DE_LOS_SUSPIROS.jpg',
  miraflores: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/LarcoMar_Shopping_Center%2C_Miraflores%2C_Lima%2C_Peru.jpg/1920px-LarcoMar_Shopping_Center%2C_Miraflores%2C_Lima%2C_Peru.jpg',
  loreto: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Cerros_Manashahuemana.jpg',
  iquitos: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Collage_de_Iquitos%2C_2024.jpg',
  'madre-de-dios': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Lago_Sandoval_3.JPG/1920px-Lago_Sandoval_3.JPG',
  moquegua: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Ciudad_de_Moquegua_-_Plaza_de_armas.jpg',
  pasco: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Pozuzo_10.jpg/1920px-Pozuzo_10.jpg',
  'cerro-de-pasco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Plaza_Daniel_Alcides_Carri%C3%B3n_monumento.jpg/1920px-Plaza_Daniel_Alcides_Carri%C3%B3n_monumento.jpg',
  piura: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Piura_desde_el_aire.jpg',
  mancora: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Mancorabeach1.jpg',
  vichayito: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Viyachito.JPG',
  'punta-sal': 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Punta_Sal%2C_Peru.jpg',
  zorritos: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Monumento_al_trabajo_del_mar_-_panoramio.jpg',
  puno: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Historico_Barco_Yavari_de_Puno.jpg',
  juliaca: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Iglesia_Sta_Catalina.jpg',
  'san-martin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Riu_Huallaga_des_de_la_carretera_de_Sauce04.jpg/1920px-Riu_Huallaga_des_de_la_carretera_de_Sauce04.jpg',
  tarapoto: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Tarapoto.jpg',
  tacna: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Photo_montage_Tacna.png/1920px-Photo_montage_Tacna.png',
  tumbes: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Mozaico_Tumbes.jpg/1920px-Mozaico_Tumbes.jpg',
  ucayali: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Boquer%C3%B3n_de_Padre_Abad.jpg',
};

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

function completarImagenDestino(destino: Destino): Destino {
  const imagenActual = destino.imagen_url?.trim();

  return {
    ...destino,
    imagen_url: imagenActual && !imagenActual.includes('images.unsplash.com')
      ? imagenActual
      : imagenPorSlug[destino.slug] || null,
  };
}

const destinosBaseConImagenes = destinosBase.map(completarImagenDestino);

export const obtenerDestinos = unstable_cache(
  async (): Promise<Destino[]> => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('destinos')
        .select('slug,nombre,departamento,tipo,imagen_url')
        .eq('activo', true)
        .order('departamento', { ascending: true })
        .order('nombre', { ascending: true });

      if (error || !data?.length) return destinosBaseConImagenes;
      return (data as Destino[]).map(completarImagenDestino);
    } catch (err) {
      console.error('[supabase] obtenerDestinos falló:', err);
      return destinosBaseConImagenes;
    }
  },
  ['destinos-imagenes-reales-v2'],
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
