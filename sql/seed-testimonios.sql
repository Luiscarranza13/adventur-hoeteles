-- Testimonios dinámicos para el carrusel de la home.
-- Administrables desde el panel admin (/admin/testimonios).

CREATE TABLE IF NOT EXISTS public.testimonios_home (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  origen TEXT NOT NULL,
  cargo TEXT NOT NULL,
  calificacion INTEGER NOT NULL DEFAULT 5 CHECK (calificacion BETWEEN 1 AND 5),
  texto TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#2563EB',
  orden INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonios_home ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonios_home_select_public" ON public.testimonios_home;
CREATE POLICY "testimonios_home_select_public"
ON public.testimonios_home
FOR SELECT
USING (activo = true);

INSERT INTO public.testimonios_home
  (nombre, origen, cargo, calificacion, texto, color, orden, activo)
VALUES
  ('Maria Garcia',    'Lima',    'Viajera frecuente', 5, 'Reserve el hotel en Cajamarca por WhatsApp y en menos de 5 minutos tenia la confirmacion. Sin formularios, sin comisiones.',                    '#2563EB', 1, true),
  ('Roberto Sanchez', 'Trujillo','Reserva familiar',  5, 'Llegue al hotel y todo estuvo como me lo describieron: limpio, comodo y en perfecto estado. Adventur realmente verifica.',                       '#7C3AED', 2, true),
  ('Lucia Torres',    'Arequipa','Viaje en familia',  5, 'El precio que vi fue el que pague, sin sorpresas. La atencion fue personalizada y me ayudaron a elegir el hotel ideal.',                        '#DB2777', 3, true),
  ('Carlos Mendoza',  'Chiclayo','Grupo familiar',    5, 'Organice el viaje de toda la familia a Cajamarca. Adventur consiguio habitaciones con disponibilidad inmediata.',                               '#059669', 4, true),
  ('Ana Rodriguez',   'Cusco',   'Viaje individual',  5, 'Me orientaron sobre que hotel elegir segun mi presupuesto y me senti completamente segura durante todo el proceso.',                            '#D97706', 5, true)
ON CONFLICT DO NOTHING;

SELECT id, nombre, origen, calificacion, orden, activo
FROM public.testimonios_home
ORDER BY orden;
