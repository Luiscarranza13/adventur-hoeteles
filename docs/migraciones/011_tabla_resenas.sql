-- ============================================================
-- MIGRACIÓN 011: TABLA DE RESEÑAS
-- Reseñas de huéspedes por hotel (verificadas por Adventur)
-- ============================================================

CREATE TABLE IF NOT EXISTS resenas (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id     UUID        NOT NULL REFERENCES hoteles(id) ON DELETE CASCADE,
  nombre_revisor TEXT      NOT NULL,
  origen       TEXT,
  calificacion SMALLINT    NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario   TEXT        NOT NULL,
  fecha        DATE        NOT NULL DEFAULT CURRENT_DATE,
  fuente       TEXT        NOT NULL DEFAULT 'adventur',
  avatar_url   TEXT,
  verificada   BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resenas_hotel_id   ON resenas(hotel_id);
CREATE INDEX IF NOT EXISTS idx_resenas_verificada ON resenas(verificada, hotel_id);

ALTER TABLE resenas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resenas_lectura_publica" ON resenas
  FOR SELECT TO anon USING (verificada = true);

-- ============================================================
-- DATOS DE EJEMPLO — Reseñas verificadas por hotel
-- ============================================================

INSERT INTO resenas (hotel_id, nombre_revisor, origen, calificacion, comentario, fecha, fuente) VALUES

-- COSTA DEL SOL (★★★★)
((SELECT id FROM hoteles WHERE nombre='Costa del Sol'),
 'María García', 'Lima', 5,
 'El mejor hotel de Cajamarca sin dudas. La ubicación frente a la Plaza de Armas es espectacular, la piscina climatizada una sorpresa increíble para el clima de Cajamarca. El restaurant Paprika tiene la mejor comida cajamarquina de todo el viaje. Personal muy atento.',
 '2025-04-10', 'adventur'),

((SELECT id FROM hoteles WHERE nombre='Costa del Sol'),
 'Roberto Sánchez', 'Trujillo', 5,
 'Nos hospedamos para el Carnaval. El hotel impecable, el personal excelente y el desayuno buffet abundante con productos locales. La habitación suite vale cada sol. Lo recomiendo 100%.',
 '2025-03-02', 'tripadvisor'),

((SELECT id FROM hoteles WHERE nombre='Costa del Sol'),
 'Claudia Ríos', 'Arequipa', 4,
 'Muy buen hotel, moderno y bien mantenido. El spa y el gimnasio son de primer nivel. Pequeña observación: el check-in tardó un poco. Pero el resto estuvo perfecto. Volvería sin dudar.',
 '2025-01-18', 'google'),

-- LAGUNA SECA (★★★★)
((SELECT id FROM hoteles WHERE nombre='Laguna Seca'),
 'Fernando Huanca', 'Lima', 5,
 'Experiencia única en los Baños del Inca. Las termas privadas en la habitación son el lujo máximo después de un día de turismo. El jacuzzi con agua termal es increíble. El restaurante El Fogón tiene un cuy al horno que no olvidarás.',
 '2025-04-22', 'adventur'),

((SELECT id FROM hoteles WHERE nombre='Laguna Seca'),
 'Susana Velarde', 'Chiclayo', 5,
 'Fuimos por aniversario y el hotel superó todas las expectativas. La suite ejecutiva con jacuzzi termal fue romántica y relajante. El personal muy servicial, el desayuno con quesos cajamarquinos es delicioso. Sin duda el mejor hotel-spa del norte del Perú.',
 '2025-02-14', 'tripadvisor'),

((SELECT id FROM hoteles WHERE nombre='Laguna Seca'),
 'Andrés Palacios', 'Cusco', 4,
 'Las termas y el sauna son lo mejor del lugar. La piscina exterior en plena naturaleza es mágica. El hotel tiene buen mantenimiento y las habitaciones son amplias y cómodas. Ideal para descansar lejos del ruido de la ciudad.',
 '2024-12-08', 'google'),

-- GRAN CONTINENTAL (★★★★)
((SELECT id FROM hoteles WHERE nombre='Gran Continental'),
 'Patricia Morales', 'Lima', 5,
 'Excelente relación calidad-precio para un hotel de 4 estrellas. Las habitaciones son amplias, el desayuno buffet variado y el traslado al aeropuerto muy puntual. El jacuzzi de la suite es de lujo. Quedé encantada.',
 '2025-03-15', 'adventur'),

((SELECT id FROM hoteles WHERE nombre='Gran Continental'),
 'Jorge Castillo', 'Piura', 4,
 'Hotel muy bien ubicado, a una cuadra del centro histórico. Las habitaciones limpias y modernas, el personal amable. El único detalle es que el WiFi en las habitaciones altas era un poco lento, pero lo solucionaron rápido.',
 '2025-01-07', 'booking'),

-- PORTAL DEL MARQUEZ (★★★)
((SELECT id FROM hoteles WHERE nombre='Portal del Marquez'),
 'Lucía Torres', 'Lima', 5,
 'Encantador hotel colonial a 1.5 cuadras de la Plaza de Armas. El patio interior es precioso, parece una casa de época. Las habitaciones combinan perfectamente lo moderno con lo rústico. El desayuno buffet con productos cajamarquinos es delicioso.',
 '2025-04-05', 'tripadvisor'),

((SELECT id FROM hoteles WHERE nombre='Portal del Marquez'),
 'Diego Vargas', 'Trujillo', 5,
 'Llevamos 26 años visitando Cajamarca y este siempre es nuestra primera opción. Excelente atención, habitaciones cómodas, desayuno completo y el WiFi de fibra óptica funciona perfecto. La suite con jacuzzi es lo máximo.',
 '2025-02-20', 'adventur'),

((SELECT id FROM hoteles WHERE nombre='Portal del Marquez'),
 'Camila Espinoza', 'Arequipa', 4,
 'Hotel con mucho carácter. La casona colonial de dos patios es hermosa. Personal muy atento y el traslado al aeropuerto es puntual. Recomendado para quienes buscan algo con historia y encanto.',
 '2024-11-30', 'google'),

-- POSADA PURUAY (★★★)
((SELECT id FROM hoteles WHERE nombre='Posada Puruay'),
 'Elena Ramírez', 'Lima', 5,
 'Un lugar mágico a 4.5 km del centro. Las habitaciones con camas de forja y chimenea son romanticísimas. Desayuno con productos frescos de la zona, pesca de truchas y caminatas por el campo. Una experiencia que no encuentras en un hotel convencional.',
 '2025-03-28', 'tripadvisor'),

((SELECT id FROM hoteles WHERE nombre='Posada Puruay'),
 'Marco Gutiérrez', 'Cusco', 5,
 'Nos regalamos la suite nupcial con jacuzzi y fue absolutamente mágico. La posada tiene un ambiente muy especial, tranquilo y auténtico. El desayuno incluido es completo y delicioso. El personal super amable. Volveremos pronto.',
 '2025-01-25', 'adventur'),

-- MONTAÑAS (★★★)
((SELECT id FROM hoteles WHERE nombre='Montañas'),
 'Karla Mendoza', 'Lima', 5,
 'Hotel moderno y céntrico, muy buen precio para lo que ofrece. La Smart TV con Netflix en la habitación fue un detalle genial. WiFi rápido, agua caliente siempre disponible y el personal muy amable. A 1 cuadra de la Plaza de Armas.',
 '2025-04-18', 'booking'),

((SELECT id FROM hoteles WHERE nombre='Montañas'),
 'Adrián López', 'Chiclayo', 4,
 'Excelente hotel moderno en Cajamarca. Las habitaciones son amplias y limpias, la cama muy cómoda. El WiFi funciona bien en toda la propiedad. Buena relación calidad-precio. Repetiría sin dudarlo.',
 '2025-02-10', 'adventur'),

-- CONTINENTAL (★★★)
((SELECT id FROM hoteles WHERE nombre='Continental'),
 'Valeria Quispe', 'Lima', 5,
 'Hotel muy cómodo en pleno centro histórico. Las 61 habitaciones están bien equipadas con aire acondicionado, minibar y caja fuerte. El desayuno de tres tiempos es excelente. El traslado al aeropuerto muy puntual.',
 '2025-03-10', 'tripadvisor'),

((SELECT id FROM hoteles WHERE nombre='Continental'),
 'Héctor Flores', 'Trujillo', 4,
 'Buen hotel con habitaciones amplias y modernas. El bar es agradable para después de un día de turismo. La suite presidencial con jacuzzi es una pasada. Lo que más destaco es la atención personalizada del personal.',
 '2025-01-14', 'google'),

-- HOTEL CAJAMARCA (★★★)
((SELECT id FROM hoteles WHERE nombre='Hotel Cajamarca'),
 'Sofía Ramos', 'Lima', 5,
 'Un clásico de Cajamarca. La casona colonial tiene un encanto único, algunas habitaciones con balcón al patio interior son preciosas. El desayuno buffet es abundante y el personal muy servicial. A media cuadra de la Plaza de Armas.',
 '2025-04-01', 'tripadvisor'),

((SELECT id FROM hoteles WHERE nombre='Hotel Cajamarca'),
 'Ernesto Bazán', 'Arequipa', 4,
 'Hotel con historia y personalidad. Las habitaciones con balcón al patio colonial son lo mejor. El desayuno buffet muy completo. Un poco de ruido por las noches por estar en el centro, pero nada que afecte el descanso.',
 '2025-02-05', 'adventur'),

-- NAMORA DOMO EXPERIENCE (Glamping)
((SELECT id FROM hoteles WHERE nombre='Namora Domo Experience'),
 'Isabella Torres', 'Lima', 5,
 'La experiencia más increíble que hemos tenido viajando por el Perú. Los domos panorámicos con vista a la Laguna San Nicolás son de otro mundo. Despertar con esa vista y desayunar en la terraza privada es un sueño. El personal muy atento.',
 '2025-04-15', 'adventur'),

((SELECT id FROM hoteles WHERE nombre='Namora Domo Experience'),
 'Sebastián Ruiz', 'Lima', 5,
 'Fuimos por el cumpleaños de mi esposa y quedó enamorada del lugar. Los domos son cómodos, abrigados y la vista a la laguna es espectacular. El desayuno a la carta muy rico. Completamente recomendado para una experiencia diferente.',
 '2025-03-05', 'google'),

-- NAKAMA ECO-RESORT (Glamping)
((SELECT id FROM hoteles WHERE nombre='Nakama Eco-Resort'),
 'Alicia Mendoza', 'Lima', 5,
 'Glamping auténtico en los Baños del Inca. Las tiendas son súper cómodas con colchones de lujo y ropa de cama de algodón egipcio. El yoga matutino y el ciclismo de montaña son increíbles. Un retiro natural perfecto a minutos de Cajamarca.',
 '2025-04-08', 'tripadvisor'),

-- PILANCONES (★★★)
((SELECT id FROM hoteles WHERE nombre='Pilancones'),
 'Manuel Díaz', 'Lima', 5,
 'Hotel muy agradable con un jardín precioso. Las habitaciones son cómodas y el personal muy atento. Buena ubicación en Jr. Puno y excelente relación calidad-precio. El restaurante tiene buenos platos típicos cajamarquinos.',
 '2025-02-28', 'adventur'),

-- LA ENCENADA (★★★)
((SELECT id FROM hoteles WHERE nombre='La Encenada'),
 'Gisela Paredes', 'Lima', 5,
 'Hotel rural a 5 km de Cajamarca rumbo a Baños del Inca. Los bungalows con terraza y vistas a los Andes son bellísimos. El desayuno buffet con quesos y manjar blanco cajamarquino es lo mejor. Un lugar para desconectarse del estrés.',
 '2025-03-20', 'tripadvisor'),

((SELECT id FROM hoteles WHERE nombre='La Encenada'),
 'Rodrigo Vidal', 'Lima', 4,
 'Ambiente tranquilo y natural que se agradece mucho. Las habitaciones superiores con terraza privada son lo más, perfectas para disfrutar el paisaje andino. El bungalow con jacuzzi y chimenea es una experiencia única.',
 '2025-01-12', 'booking');

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
SELECT h.nombre, COUNT(r.id) AS num_resenas, ROUND(AVG(r.calificacion), 1) AS promedio
FROM hoteles h
LEFT JOIN resenas r ON r.hotel_id = h.id AND r.verificada = true
GROUP BY h.id, h.nombre
HAVING COUNT(r.id) > 0
ORDER BY promedio DESC;
