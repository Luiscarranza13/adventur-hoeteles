-- ============================================================
-- MIGRACIÓN 009: LISTA OFICIAL DE HOTELES CAJAMARCA (ADVENTUR)
-- Fuente: Lista oficial aprobada por jefatura — Ene 2025
-- Incluye: datos reales, imágenes, habitaciones y precios (PEN)
-- ============================================================

-- PASO 1: Limpiar datos existentes (orden por FK constraints)
DELETE FROM reservas;
DELETE FROM hoteles; -- habitaciones se eliminan por ON DELETE CASCADE

-- ============================================================
-- PASO 2: INSERTAR LOS 21 HOTELES OFICIALES
-- ============================================================

INSERT INTO hoteles (nombre, descripcion, ciudad, direccion, telefono_whatsapp, email_contacto, imagenes_urls, estrellas, tipo_alojamiento, activo) VALUES

('Shalom',
 'Hotel económico céntrico a pocos minutos de la Plaza de Armas de Cajamarca. Habitaciones cómodas con WiFi gratuito, agua caliente y TV cable. Ideal para viajeros que buscan alojamiento práctico a buen precio en el corazón de la ciudad.',
 'Cajamarca', 'Jr. Guillermo Urrelo Nro. 891, Cajamarca', '944224677', 'shalomhoteles@gmail.com',
 ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80','https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'],
 2, 'Hostal', true),

('Montañas',
 'Hotel moderno a una cuadra de la Plaza Mayor de Cajamarca y a 10 minutos del aeropuerto. Habitaciones con Smart TV 4K, Netflix, WiFi de alta velocidad y baño privado con agua caliente. Atención personalizada con valoración de 9.1/10 por sus huéspedes.',
 'Cajamarca', 'Jr. Guillermo Urrelo, Cajamarca', '920811462', 'monthanashotel@gmail.com',
 ARRAY['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
 3, 'Hotel', true),

('Retamas I',
 'Hotel de 3 estrellas en el centro de Cajamarca con 20 habitaciones confortables dotadas de TV de pantalla plana y caja de seguridad. Desayuno continental incluido, traslado gratuito al aeropuerto las 24 horas y WiFi en toda la propiedad.',
 'Cajamarca', 'Prolongación Amalia Puga 128, Cajamarca 06001', '(076)774078', 'retamas_hotel@hotmail.com',
 ARRAY['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80','https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'],
 3, 'Hotel', true),

('Retamas II',
 'Segunda sede de la cadena Retamas en Jr. Horacio Urteaga 447. Hotel de 3 estrellas con habitaciones confortables, salón compartido y consigna de equipaje. Desayuno continental o americano y WiFi gratuito incluidos.',
 'Cajamarca', 'Jr. Horacio Urteaga 447, Cajamarca', '(076)344110', '',
 ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80','https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&q=80'],
 3, 'Hotel', true),

('Catequil',
 'Hostal a 150 metros del Cuarto del Rescate de Atahualpa y 2 cuadras de la Plaza Mayor. Habitaciones con baño privado, TV cable, hervidor eléctrico y WiFi gratuito. Opciones con balcón y vistas panorámicas a la ciudad histórica de Cajamarca.',
 'Cajamarca', 'Jr. Guillermo Urrelo 688, Cajamarca', '929281967', 'servicioscatequil@gmail.com',
 ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80','https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'],
 3, 'Hotel', true),

('Silva Inn',
 'Hotel de 3 estrellas en el Jr. Guillermo Urrelo 716, con vistas a la ciudad histórica. Restaurante, bar y recepción 24 horas. Habitaciones con escritorio, TV de pantalla plana, WiFi y baño privado con artículos de aseo gratuitos.',
 'Cajamarca', 'Jr. Guillermo Urrelo 716, Cajamarca', '(076)774503', 'hotelsilvainn21@outlook.com',
 ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80','https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?w=800&q=80'],
 3, 'Hotel', true),

('Sol de Belén',
 'Hotel de negocios de 3 estrellas con 20 habitaciones dotadas de caja de seguridad. Desayuno y WiFi gratuitos, estacionamiento, restaurante y gimnasio disponible las 24 horas. Ubicación privilegiada cercana al centro histórico de Cajamarca.',
 'Cajamarca', 'Jr. Belén 636, Cajamarca 06000', '943773549', 'reservas@hotelsoldebelen.com',
 ARRAY['https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&q=80','https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80'],
 3, 'Hotel', true),

('Casa Blanca',
 'Hotel histórico de 3 estrellas frente a la Plaza de Armas de Cajamarca con encantador patio interior colonial. Habitaciones remodeladas con TV cable, minibar y baño privado. Desayuno y WiFi gratuitos. Parte del grupo Atlantis Hoteles & Casinos.',
 'Cajamarca', 'Jr. 2 de Mayo 446, Plaza de Armas, Cajamarca', '976145477', 'reservascajamarca@atlantishotelescasinos.com',
 ARRAY['https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&q=80','https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'],
 3, 'Hotel', true),

('Hotel Cajamarca',
 'Acogedora casona colonial a media cuadra de la Plaza de Armas con 35 habitaciones, algunas con balcón. Desayuno buffet gratuito, restaurante, bar/lounge, WiFi y servicio de concierge. Referente histórico del alojamiento en el centro cajamarquino.',
 'Cajamarca', 'Jr. Dos de Mayo N° 311, Cajamarca', '976771010', 'reservas@hotelcajamarca.com.pe',
 ARRAY['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
 3, 'Hotel', true),

('Portal del Marquez',
 'Icónico hotel con 26 años de experiencia a 1.5 cuadras de la Plaza Mayor, en casona colonial de dos patios. 41 habitaciones que combinan modernidad y estilo rústico. Desayuno buffet, restaurante y bar, WiFi de fibra óptica, estacionamiento y traslado al aeropuerto.',
 'Cajamarca', 'Jr. Del Comercio 644, Cajamarca', '998805440', 'reservas@portaldelmarques.com',
 ARRAY['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
 3, 'Hotel', true),

('Las Américas',
 'Hotel contemporáneo a una cuadra de la Plaza de Armas con habitaciones equipadas con TV HD DirecTV y cortinas Black Out. Desayuno buffet, restaurante, bar, gimnasio, WiFi de alta velocidad y cochera privada. Ideal para turismo y negocios.',
 'Cajamarca', 'Jr. Amazonas 622, Cajamarca', '(076)363951', 'lasamericashotel_cajamarca@hotmail.com',
 ARRAY['https://images.unsplash.com/photo-1537726235470-8504e3beef77?w=800&q=80','https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80'],
 3, 'Hotel', true),

('Continental',
 'Refugio de tranquilidad en el corazón histórico de Cajamarca con 61 habitaciones modernas con aire acondicionado, WiFi, minibar y caja de seguridad. Restaurante con tres tiempos, bar y traslado al aeropuerto incluidos.',
 'Cajamarca', 'Jr. Amazonas 760, Cajamarca', '(076)362758', 'reservas@hotelcontinental.com.pe',
 ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80','https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'],
 3, 'Hotel', true),

('La Encenada',
 'Refugio natural en los Andes peruanos a 5 km de Cajamarca rumbo a Baños del Inca. Bungalows y habitaciones superiores con terraza o balcón, minibar y TV cable. Desayuno buffet con productos locales: quesos cajamarquinos, frutas frescas y manjar blanco.',
 'Cajamarca', 'Fundo Los Sauces Km 5, Carretera a Baños del Inca, Cajamarca', '949216252', 'reservas@laensenadahoteles.com',
 ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80','https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800&q=80'],
 3, 'Hotel', true),

('Fundo El Chocho',
 'Boutique hotel rural en la cima de una colina a 15 minutos de Cajamarca. 8 habitaciones con vistas panorámicas 360° a los Andes, TV DirecTV, baño privado y WiFi. Desayuno completo incluido, senderismo y equitación disponibles.',
 'Cajamarca', 'Km 4.5 Camino a Bambamarca, Cajamarca', '928794042', 'fundoelchocho@gmail.com',
 ARRAY['https://images.unsplash.com/photo-1596386461350-326ccb383e9f?w=800&q=80','https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80'],
 3, 'Hotel', true),

('Pilancones',
 'Hotel de 3 estrellas clasificado entre los mejores de Cajamarca con valoración de 8.9/10. 20 habitaciones confortables con jardín, salón compartido, restaurante y WiFi gratuito. Atención disponible las 24 horas, ideal para turismo y negocios.',
 'Cajamarca', 'Jr. Puno 280, Cajamarca', '922236577', 'informes@hotelpilanconescajamarca.com',
 ARRAY['https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80','https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&q=80'],
 3, 'Hotel', true),

('Posada Puruay',
 'Encantadora posada campestre colonial a 4.5 km del centro de Cajamarca. 13 habitaciones con camas de forja, balcones con vistas al jardín andino y chimeneas. Desayuno incluido. Actividades: pesca de truchas, caminatas y tours a comunidades locales.',
 'Cajamarca', 'Carretera Porcón Hualgayoc Km. 4.5, Cajamarca', '976362206', 'reservas@posadapuruay.com.pe',
 ARRAY['https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800&q=80','https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&q=80'],
 3, 'Hotel', true),

('Gran Continental',
 'Hotel 4 estrellas de la cadena Hoteles Continental con 72 habitaciones con escritorio, refrigerador y caja de seguridad. Desayuno buffet gratuito, traslado al aeropuerto, bar/lounge, servicio de habitaciones y jacuzzi. A una cuadra del centro histórico de Cajamarca.',
 'Cajamarca', 'Jr. Amazonas 781, Cajamarca', '976683324', 'reservas@hotelescontinental.com.pe',
 ARRAY['https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'],
 4, 'Hotel', true),

('Laguna Seca',
 'Reconocido hotel-spa de 4 estrellas en Los Baños del Inca, a 10 minutos de Cajamarca. 41 habitaciones con acceso a aguas termales privadas, minibar, TV y calefacción. Piscinas termales al aire libre, sauna, baño turco, spa de lodo y restaurante El Fogón.',
 'Cajamarca', 'Av. Manco Cápac 1098, Baños del Inca, Cajamarca', '976332043', 'reserva@lagunaseca.com.pe',
 ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80','https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80'],
 4, 'Hotel', true),

('Costa del Sol',
 'Hotel Wyndham 4 estrellas frente a la Plaza de Armas en histórica casona colonial, clasificado #1 de hoteles en Cajamarca. 71 habitaciones y suites con piscina climatizada, spa, gimnasio, restaurante Paprika, bar Walak y 4 salas de eventos para hasta 300 personas.',
 'Cajamarca', 'Jr. Cruz de Piedra 707, Plaza de Armas, Cajamarca', '(076)362472', 'recepcioncajamarca@costadelsolperu.com',
 ARRAY['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'],
 4, 'Hotel', true),

('Namora Domo Experience',
 'Glamping exclusivo en domos panorámicos junto a la Laguna San Nicolás en Namora, a 40 minutos de Cajamarca. Domos privados con baño, terraza privada, escritorio y ropa de cama premium. Desayuno americano a la carta incluido con vista privilegiada a la laguna y los Andes.',
 'Cajamarca', 'Laguna San Nicolás S/N, Namora, Cajamarca', '950636349', 'namoradomoexperience@gmail.com',
 ARRAY['https://images.unsplash.com/photo-1650902534018-75f7dc1c0e86?w=800&q=80','https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&q=80'],
 0, NULL, true),

('Nakama Eco-Resort',
 'Glamping boutique valorado 9.6/10 en Booking.com, en Baños del Inca a 7 km de Cajamarca. 7 unidades tipo tienda con colchones extra acolchados y sábanas de algodón egipcio. Desayuno incluido, clases de yoga, ciclismo de montaña y restaurante familiar con parking gratuito.',
 'Cajamarca', 'Calle Chin Chin Tres Cruces, Baños del Inca, Cajamarca', '912569213', 'reservasnakamaecooresort@gmail.com',
 ARRAY['https://images.unsplash.com/photo-1659967920651-7e3d67bf5aeb?w=800&q=80','https://images.unsplash.com/photo-1682686581986-78af1ab7baee?w=800&q=80'],
 0, NULL, true);

-- ============================================================
-- PASO 3: INSERTAR HABITACIONES POR HOTEL
-- ============================================================

-- 1. SHALOM (★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Shalom'), 'Habitación Simple',    'Habitación individual con cama 1.5 plaza, baño privado con agua caliente y TV cable.',   1, 1,  70, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Agua caliente','Baño privado'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Shalom'), 'Habitación Doble',     'Habitación doble con cama matrimonial, baño privado y TV cable. Ideal para parejas.',   2, 1, 100, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Agua caliente','Baño privado'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Shalom'), 'Habitación Triple',    'Habitación triple con tres camas individuales, baño privado y TV cable.',                 3, 3, 130, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Agua caliente','Baño privado'], true, 'disponible');

-- 2. MONTAÑAS (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Montañas'), 'Individual',          'Habitación individual con cama 1.5 plaza, Smart TV 4K con Netflix y baño privado.',       1, 1, 120, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','Smart TV','Netflix','Agua caliente','Baño privado'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Montañas'), 'Matrimonial',         'Habitación matrimonial con cama 2 plazas, Smart TV 4K, baño privado y buenas vistas.',   2, 1, 160, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','Smart TV','Netflix','Agua caliente','Baño privado'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Montañas'), 'Doble Familiar',      'Habitación amplia con 2 camas de 2 plazas, perfecta para familia o grupos de 4.',        4, 2, 200, 'PEN', 'TWN', 'QB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','Smart TV','Netflix','Agua caliente','Baño privado'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Montañas'), 'Triple',              'Habitación triple con 3 camas individuales, Smart TV y baño privado.',                    3, 3, 220, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], ARRAY['WiFi','Smart TV','Netflix','Agua caliente','Baño privado'], true, 'disponible');

-- 3. RETAMAS I (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Retamas I'), 'Individual',         'Habitación simple con TV pantalla plana, caja de seguridad y baño privado con ducha.',   1, 1, 110, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Caja fuerte','Baño privado','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Retamas I'), 'Matrimonial',        'Habitación matrimonial con cama queen, TV pantalla plana, caja de seguridad y baño.',    2, 1, 150, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Caja fuerte','Baño privado','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Retamas I'), 'Doble Twin',         'Habitación doble con dos camas individuales, TV pantalla plana y baño privado.',         2, 2, 160, 'PEN', 'TWN', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Caja fuerte','Baño privado','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Retamas I'), 'Triple',             'Habitación triple espaciosa con 3 camas, TV y baño privado. Incluye desayuno.',          3, 3, 190, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], ARRAY['WiFi','TV','Caja fuerte','Baño privado','Desayuno incluido'], true, 'disponible');

-- 4. RETAMAS II (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Retamas II'), 'Individual',        'Habitación simple con TV pantalla plana, WiFi y baño privado con ducha caliente.',       1, 1, 105, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Baño privado','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Retamas II'), 'Doble',             'Habitación doble matrimonial con cama queen, TV y baño privado con agua caliente.',      2, 1, 145, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Baño privado','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Retamas II'), 'Triple',            'Habitación triple con TV, WiFi y baño privado. Desayuno incluido.',                      3, 3, 180, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Baño privado','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Retamas II'), 'Familiar',          'Habitación para 4 personas con camas individuales, TV y baño privado completo.',         4, 4, 210, 'PEN', 'FAM', 'TB', ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], ARRAY['WiFi','TV','Baño privado','Desayuno incluido'], true, 'disponible');

-- 5. CATEQUIL (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Catequil'), 'Individual',          'Habitación individual con TV cable, hervidor eléctrico, WiFi y baño privado.',            1, 1,  80, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Hervidor','Baño privado'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Catequil'), 'Doble Matrimonial',   'Habitación matrimonial con TV cable y baño privado. Algunas con balcón y vistas.',       2, 1, 120, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Hervidor','Baño privado','Balcón'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Catequil'), 'Familiar',            'Habitación familiar con 4 camas, baño privado y TV cable. Ideal para grupos.',            4, 4, 170, 'PEN', 'FAM', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Hervidor','Baño privado'], true, 'disponible');

-- 6. SILVA INN (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Silva Inn'), 'Simple',             'Habitación individual con escritorio, TV pantalla plana, WiFi y baño privado.',           1, 1,  90, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Escritorio','Baño privado'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Silva Inn'), 'Matrimonial',        'Habitación matrimonial con vistas a la ciudad, TV pantalla plana y baño privado.',        2, 1, 130, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Escritorio','Baño privado'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Silva Inn'), 'Triple',             'Habitación triple con 3 camas individuales, TV y baño privado con agua caliente.',        3, 3, 170, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Escritorio','Baño privado'], true, 'disponible');

-- 7. SOL DE BELÉN (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Sol de Belén'), 'Simple',          'Habitación individual con caja de seguridad, artículos de aseo y baño privado.',          1, 1, 130, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Caja fuerte','Gimnasio','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Sol de Belén'), 'Matrimonial',     'Habitación matrimonial con cama queen, caja de seguridad y baño con artículos de aseo.',  2, 1, 175, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Caja fuerte','Gimnasio','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Sol de Belén'), 'Twin',            'Habitación doble con 2 camas individuales, perfecta para viajeros de negocios.',         2, 2, 180, 'PEN', 'TWN', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Caja fuerte','Gimnasio','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Sol de Belén'), 'Triple',          'Habitación triple con 3 camas, caja de seguridad, baño privado y desayuno incluido.',    3, 3, 220, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], ARRAY['WiFi','TV','Caja fuerte','Gimnasio','Desayuno incluido'], true, 'disponible');

-- 8. CASA BLANCA (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Casa Blanca'), 'Individual',       'Habitación individual con TV cable, minibar y baño privado en casona colonial.',          1, 1, 140, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Baño privado','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Casa Blanca'), 'Doble Matrimonial','Habitación matrimonial con cama queen, TV cable, minibar y baño privado con ducha.',     2, 1, 185, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Baño privado','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Casa Blanca'), 'Junior Suite King','Suite junior con cama king, sala de estar, minibar y vistas a la Plaza de Armas.',        2, 1, 280, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Caja fuerte','Baño privado','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Casa Blanca'), 'Familiar',         'Habitación familiar con 4 camas, TV cable, minibar y baño privado.',                     4, 4, 250, 'PEN', 'FAM', 'TB', ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Baño privado','Desayuno incluido'], true, 'disponible');

-- 9. HOTEL CAJAMARCA (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Hotel Cajamarca'), 'Simple',       'Habitación individual en casona colonial con TV, escritorio y baño privado.',              1, 1, 170, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Escritorio','Baño privado','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Hotel Cajamarca'), 'Matrimonial',  'Habitación matrimonial con cama queen, escritorio y baño privado con ducha.',             2, 1, 210, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Escritorio','Baño privado','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Hotel Cajamarca'), 'Doble Twin',   'Habitación doble con 2 camas individuales. Algunas unidades con balcón al patio colonial.', 2, 2, 220, 'PEN', 'TWN', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Escritorio','Balcón','Baño privado','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Hotel Cajamarca'), 'Triple',       'Habitación triple con 3 camas y baño privado. Desayuno buffet incluido.',                  3, 3, 260, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], ARRAY['WiFi','TV','Baño privado','Desayuno buffet'], true, 'disponible');

-- 10. PORTAL DEL MARQUEZ (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Portal del Marquez'), 'Individual Matrimonial',  'Habitación individual con cama matrimonial, TV, escritorio y baño privado con ducha.', 1, 1, 145, 'PEN', 'SGL', 'QB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi fibra óptica','TV','Escritorio','Baño privado','Desayuno buffet','Traslado aeropuerto'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Portal del Marquez'), 'Doble Estándar',          'Habitación doble en casona colonial con vistas al patio. TV, escritorio y baño privado.', 2, 1, 198, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi fibra óptica','TV','Escritorio','Baño privado','Desayuno buffet','Traslado aeropuerto'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Portal del Marquez'), 'Triple Familiar',         'Habitación triple amplia para familias o grupos con 3 camas y baño privado completo.',   3, 3, 270, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi fibra óptica','TV','Baño privado','Desayuno buffet','Traslado aeropuerto'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Portal del Marquez'), 'Junior Suite con Jacuzzi','Suite junior con jacuzzi privado, sala de estar, cama king y vistas al patio colonial.',  2, 1, 397, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'], ARRAY['WiFi fibra óptica','TV','Jacuzzi','Minibar','Caja fuerte','Desayuno buffet','Traslado aeropuerto'], true, 'disponible');

-- 11. LAS AMÉRICAS (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Las Américas'), 'Simple',          'Habitación individual con TV HD DirecTV, cortinas Black Out y baño privado.',             1, 1, 150, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV HD DirecTV','Cortinas Black Out','Baño privado','Desayuno buffet','Gimnasio'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Las Américas'), 'Matrimonial',     'Habitación matrimonial con TV HD DirecTV, cortinas Black Out, minibar y baño privado.',  2, 1, 190, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV HD DirecTV','Cortinas Black Out','Minibar','Baño privado','Desayuno buffet','Gimnasio'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Las Américas'), 'Triple',          'Habitación triple con 3 camas, TV HD DirecTV, cortinas Black Out y baño privado.',       3, 3, 240, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV HD DirecTV','Baño privado','Desayuno buffet','Gimnasio'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Las Américas'), 'Suite',           'Suite con sala de estar, cama king, minibar, caja de seguridad y vista privilegiada.',    2, 1, 320, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'], ARRAY['WiFi','TV HD DirecTV','Minibar','Caja fuerte','Baño privado','Desayuno buffet','Gimnasio'], true, 'disponible');

-- 12. CONTINENTAL (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Continental'), 'Simple',           'Habitación individual con cama 2 plazas, aire acondicionado, WiFi, minibar y caja fuerte.', 1, 1, 225, 'PEN', 'SGL', 'QB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Aire acondicionado','Minibar','Caja fuerte','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Continental'), 'Matrimonial',      'Habitación matrimonial con cama queen, aire acondicionado, minibar y caja de seguridad.',  2, 1, 345, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Aire acondicionado','Minibar','Caja fuerte','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Continental'), 'Triple',           'Habitación triple con 3 camas, aire acondicionado, minibar y baño privado completo.',    3, 3, 400, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Aire acondicionado','Minibar','Baño privado','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Continental'), 'Familiar',         'Habitación familiar para 4 personas con 2 habitaciones conectadas, aire acondicionado.',  4, 4, 545, 'PEN', 'FAM', 'QB', ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], ARRAY['WiFi','TV','Aire acondicionado','Minibar','Caja fuerte','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Continental'), 'Junior Suite',     'Suite junior con sala de estar, cama king, minibar, caja fuerte y aire acondicionado.',   2, 1, 370, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80'], ARRAY['WiFi','TV','Aire acondicionado','Minibar','Caja fuerte','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Continental'), 'Suite Presidencial','Suite presidencial con sala comedor, jacuzzi, cama king, aire acondicionado y minibar.',  2, 1, 590, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'], ARRAY['WiFi','TV','Aire acondicionado','Minibar','Caja fuerte','Jacuzzi','Desayuno buffet'], true, 'disponible');

-- 13. LA ENCENADA (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='La Encenada'), 'Matrimonial Estándar',  'Habitación matrimonial con vistas al jardín andino, minibar, TV cable y balcón.',     2, 1, 440, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Balcón','Baño privado','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='La Encenada'), 'Matrimonial Superior',  'Habitación superior con terraza privada, vistas panorámicas a los Andes, minibar y TV.', 2, 1, 510, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Terraza','Baño privado','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='La Encenada'), 'Doble Superior',        'Habitación doble superior con 2 camas, terraza con vistas a los Andes y minibar.',     4, 2, 510, 'PEN', 'TWN', 'QB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Terraza','Baño privado','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='La Encenada'), 'Triple Superior',       'Habitación triple con 3 camas, balcón con vistas, minibar y baño privado.',            3, 3, 585, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Balcón','Baño privado','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='La Encenada'), 'Bungalow',              'Bungalow privado con sala de estar, terraza con jacuzzi, chimenea y vistas a los Andes.', 4, 2, 727, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Jacuzzi','Chimenea','Terraza privada','Desayuno buffet'], true, 'disponible');

-- 14. FUNDO EL CHOCHO (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Fundo El Chocho'), 'Matrimonial',  'Habitación matrimonial con vistas panorámicas 360° a los Andes, TV DirecTV y baño privado.', 2, 1, 480, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV DirecTV','Baño privado','Desayuno completo','Estacionamiento'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Fundo El Chocho'), 'Doble Twin',   'Habitación doble con 2 camas individuales y vistas panorámicas a las montañas andinas.',  2, 2, 480, 'PEN', 'TWN', 'TB', ARRAY['https://images.unsplash.com/photo-1596386461350-326ccb383e9f?w=800&q=80'], ARRAY['WiFi','TV DirecTV','Baño privado','Desayuno completo','Estacionamiento'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Fundo El Chocho'), 'Triple',       'Habitación triple con vistas 360° a la naturaleza andina, TV DirecTV y baño privado.',   3, 3, 600, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV DirecTV','Baño privado','Desayuno completo','Estacionamiento'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Fundo El Chocho'), 'Familiar',     'Habitación familiar para 4 personas con vistas panorámicas y baño privado completo.',   4, 4, 700, 'PEN', 'FAM', 'QB', ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], ARRAY['WiFi','TV DirecTV','Baño privado','Desayuno completo','Estacionamiento'], true, 'disponible');

-- 15. PILANCONES (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Pilancones'), 'Simple',            'Habitación individual con jardín, WiFi gratuito, TV y baño privado con agua caliente.',   1, 1, 150, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Jardín','Baño privado'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Pilancones'), 'Doble Twin',        'Habitación doble con 2 camas individuales, vistas al jardín y baño privado.',            2, 2, 190, 'PEN', 'TWN', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Jardín','Baño privado'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Pilancones'), 'Matrimonial',       'Habitación matrimonial con cama queen, vistas al jardín andino y baño privado.',         2, 1, 200, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Jardín','Baño privado'], true, 'disponible');

-- 16. POSADA PURUAY (★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Posada Puruay'), 'Simple Colonial', 'Habitación colonial individual con cama de forja, balcón con vistas al jardín andino.',  1, 1, 220, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800&q=80'], ARRAY['WiFi','Chimenea','Balcón','Baño privado','Desayuno incluido','Estacionamiento'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Posada Puruay'), 'Matrimonial Colonial', 'Habitación matrimonial con cama de forja, balcón con vistas al campo y chimenea.',  2, 1, 280, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&q=80'], ARRAY['WiFi','Chimenea','Balcón','Baño privado','Desayuno incluido','Estacionamiento'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Posada Puruay'), 'Suite Ejecutiva con Chimenea', 'Suite con sala de estar, chimenea de piedra, cama king y balcón privado.',   2, 1, 380, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80'], ARRAY['WiFi','Chimenea','Balcón privado','Baño privado','Minibar','Desayuno incluido'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Posada Puruay'), 'Suite Nupcial con Jacuzzi', 'Suite nupcial con jacuzzi privado, chimenea, cama king y vistas panorámicas.',   2, 1, 420, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'], ARRAY['WiFi','Jacuzzi','Chimenea','Baño privado','Minibar','Desayuno incluido'], true, 'disponible');

-- 17. GRAN CONTINENTAL (★★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Gran Continental'), 'Simple',      'Habitación individual con cama 2 plazas, refrigerador, escritorio, caja de seguridad y WiFi.', 1, 1, 260, 'PEN', 'SGL', 'QB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Refrigerador','Escritorio','Caja fuerte','Desayuno buffet','Traslado aeropuerto'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Gran Continental'), 'Doble',       'Habitación doble con cama 1.5 plazas, refrigerador, caja de seguridad y WiFi.',          2, 1, 390, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Refrigerador','Caja fuerte','Desayuno buffet','Traslado aeropuerto'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Gran Continental'), 'Matrimonial Queen', 'Habitación matrimonial con cama queen, refrigerador, escritorio y caja de seguridad.',2, 1, 390, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&q=80'], ARRAY['WiFi','TV','Refrigerador','Escritorio','Caja fuerte','Desayuno buffet','Traslado aeropuerto'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Gran Continental'), 'Triple',      'Habitación triple con 3 camas, refrigerador, WiFi y baño privado completo.',            3, 3, 450, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Refrigerador','Caja fuerte','Desayuno buffet','Traslado aeropuerto'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Gran Continental'), 'Suite 35m²',  'Suite de 35 m² con cama king, sala de estar, minibar, jacuzzi y WiFi de alta velocidad.', 2, 1, 580, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Jacuzzi','Caja fuerte','Desayuno buffet','Traslado aeropuerto'], true, 'disponible');

-- 18. LAGUNA SECA (★★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Laguna Seca'), 'Estándar Simple',  'Habitación individual con acceso a termas privadas, minibar, TV y calefacción.',          1, 1, 450, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Calefacción','Termas privadas','Piscina termal','Sauna'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Laguna Seca'), 'Estándar Matrimonial', 'Habitación matrimonial con acceso a termas privadas, minibar, TV y calefacción andina.', 2, 1, 520, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Calefacción','Termas privadas','Piscina termal','Sauna'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Laguna Seca'), 'Familiar',         'Habitación familiar para 4 personas con acceso a termas, minibar y calefacción.',        4, 4, 680, 'PEN', 'FAM', 'QB', ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Calefacción','Termas privadas','Piscina termal','Sauna'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Laguna Seca'), 'Suite Ejecutiva',  'Suite con jacuzzi de aguas termales privado, sala de estar, cama king y chimenea.',      2, 1, 780, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Jacuzzi termal','Chimenea','Piscina termal','Sauna','Baño turco'], true, 'disponible');

-- 19. COSTA DEL SOL (★★★★)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Costa del Sol'), 'Estándar Simple',    'Habitación individual en casona colonial frente a la Plaza de Armas con WiFi y TV.',   1, 1, 330, 'PEN', 'SGL', 'TB', ARRAY['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80'], ARRAY['WiFi','TV','Piscina','Spa','Gimnasio','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Costa del Sol'), 'Estándar Doble',     'Habitación doble matrimonial con TV, WiFi, piscina climatizada y spa del hotel.',      2, 1, 380, 'PEN', 'DBL', 'QB', ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'], ARRAY['WiFi','TV','Piscina','Spa','Gimnasio','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Costa del Sol'), 'Estándar Twin',      'Habitación doble con 2 camas individuales, TV, WiFi y acceso a piscina climatizada.',  2, 2, 380, 'PEN', 'TWN', 'TB', ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'], ARRAY['WiFi','TV','Piscina','Spa','Gimnasio','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Costa del Sol'), 'Triple',             'Habitación triple con 3 camas, TV, WiFi y acceso a todos los servicios del hotel.',    3, 3, 450, 'PEN', 'TPL', 'TB', ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], ARRAY['WiFi','TV','Piscina','Spa','Gimnasio','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Costa del Sol'), 'Junior Suite',       'Suite junior con sala de estar, cama king, minibar y vistas a la Plaza de Armas.',     2, 1, 580, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Caja fuerte','Piscina','Spa','Gimnasio','Desayuno buffet'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Costa del Sol'), 'Suite Ejecutiva con Sauna', 'Suite ejecutiva con sauna y jacuzzi privados, cama king, sala de estar y minibar.', 2, 1, 750, 'PEN', 'SUI', 'KB', ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'], ARRAY['WiFi','TV','Minibar','Sauna privado','Jacuzzi','Piscina','Spa','Gimnasio','Desayuno buffet'], true, 'disponible');

-- 20. NAMORA DOMO EXPERIENCE (Glamping)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Namora Domo Experience'), 'Domo Panorámico Doble', 'Domo privado con vista 360° a la Laguna San Nicolás y los Andes. Cama matrimonial premium, terraza privada, baño completo y ropa de cama de lujo. Desayuno incluido.', 2, 1, 520, 'PEN', 'SUI', 'QB', ARRAY['https://images.unsplash.com/photo-1650902534018-75f7dc1c0e86?w=800&q=80'], ARRAY['Vista a laguna','Terraza privada','Baño privado','Desayuno a la carta','Estacionamiento'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Namora Domo Experience'), 'Domo Familiar',         'Domo ampliado para familias con 2 camas y vista panorámica a la Laguna San Nicolás. Incluye desayuno y terraza privada.', 4, 2, 720, 'PEN', 'FAM', 'QB', ARRAY['https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&q=80'], ARRAY['Vista a laguna','Terraza privada','Baño privado','Desayuno a la carta','Estacionamiento'], true, 'disponible');

-- 21. NAKAMA ECO-RESORT (Glamping)
INSERT INTO habitaciones (hotel_id, nombre, descripcion, capacidad_personas, cantidad_camas, precio_noche, moneda, tipo_habitacion, tipo_cama, imagenes_urls, amenidades, esta_disponible, estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Nakama Eco-Resort'), 'Glamping Individual', 'Tienda glamping con colchón extra acolchado, sábanas de algodón egipcio y vista al campo andino. Desayuno incluido. Valorado 9.6/10.', 2, 1, 320, 'PEN', 'SUI', 'QB', ARRAY['https://images.unsplash.com/photo-1659967920651-7e3d67bf5aeb?w=800&q=80'], ARRAY['Desayuno incluido','Yoga','Ciclismo de montaña','Restaurante familiar','Parking gratuito'], true, 'disponible'),
((SELECT id FROM hoteles WHERE nombre='Nakama Eco-Resort'), 'Glamping Premium Vista', 'Tienda glamping premium con vista privilegiada, ropa de cama de lujo y baño privado externo. Yoga y actividades de naturaleza incluidas.', 2, 1, 420, 'PEN', 'SUI', 'QB', ARRAY['https://images.unsplash.com/photo-1682686581986-78af1ab7baee?w=800&q=80'], ARRAY['Desayuno incluido','Yoga','Ciclismo de montaña','Restaurante familiar','Baño privado','Parking gratuito'], true, 'disponible');

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT h.nombre, h.estrellas, h.tipo_alojamiento,
       COUNT(hab.id) AS num_habitaciones,
       MIN(hab.precio_noche) AS precio_desde,
       MAX(hab.precio_noche) AS precio_hasta
FROM hoteles h
LEFT JOIN habitaciones hab ON hab.hotel_id = h.id
GROUP BY h.id, h.nombre, h.estrellas, h.tipo_alojamiento
ORDER BY h.estrellas DESC, h.nombre;
