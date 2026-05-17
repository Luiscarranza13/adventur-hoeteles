-- ============================================================
-- MIGRACIÓN 006: HOTELES REALES DEL PERÚ
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- PASO 1: AMPLIAR CONSTRAINT tipo_habitacion Y AGREGAR COLUMNAS
ALTER TABLE habitaciones DROP CONSTRAINT IF EXISTS habitaciones_tipo_habitacion_check;
ALTER TABLE habitaciones ADD CONSTRAINT habitaciones_tipo_habitacion_check
  CHECK (tipo_habitacion = ANY (ARRAY[
    'estandar','doble','suite','presidencial',
    'SGL','DBL','TWN','TPL','QDL','FAM','SUI'
  ]));

ALTER TABLE habitaciones
  ADD COLUMN IF NOT EXISTS tipo_cama TEXT CHECK (tipo_cama IN ('KB','QB','TB')),
  ADD COLUMN IF NOT EXISTS regimen_alimentacion TEXT CHECK (regimen_alimentacion IN ('RO','BB','HB','FB','AI'));

ALTER TABLE hoteles
  ADD COLUMN IF NOT EXISTS tipo_alojamiento TEXT CHECK (tipo_alojamiento IN ('Hotel','Hostal','Apart-hotel','Resort','Ecolodge','Albergue'));

-- PASO 2: INSERTAR HOTELES Y HABITACIONES

-- 1. PALACIO DEL INKA — CUSCO (5 estrellas)
INSERT INTO hoteles (nombre,descripcion,ciudad,direccion,telefono_whatsapp,email_contacto,imagenes_urls,estrellas,tipo_alojamiento,activo,latitud,longitud) VALUES (
  'Palacio del Inka, a Luxury Collection Hotel',
  'Joya histórica de 500 años en el corazón de Cusco. Palacio colonial con arte precolombino y vistas al Qorikancha. Restaurante Inti Raymi, spa, piscina climatizada y 153 habitaciones de lujo.',
  'Cusco','Plazoleta Santo Domingo 259, Cusco','+51984252610','reservas@palaciodelinka.com',
  ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200','https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200'],
  5,'Hotel',true,-13.5183,-71.9784
);
INSERT INTO habitaciones (hotel_id,nombre,descripcion,numero_habitacion,tipo_habitacion,tipo_cama,regimen_alimentacion,capacidad_personas,cantidad_camas,precio_noche,moneda,amenidades,imagenes_urls,esta_disponible,estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Palacio del Inka, a Luxury Collection Hotel'),'Habitación Deluxe King','Habitación de 38 m² con vista al jardín colonial, cama king, baño de mármol con tina y ducha de lluvia. Incluye desayuno buffet.','101','DBL','KB','BB',2,1,320,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Palacio del Inka, a Luxury Collection Hotel'),'Habitación Superior Twin','Habitación de 35 m² con vista al Qorikancha, dos camas individuales y escritorio ejecutivo. Incluye desayuno.','205','TWN','TB','BB',2,2,280,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Palacio del Inka, a Luxury Collection Hotel'),'Suite Inca','Suite de 65 m² con sala de estar, terraza privada con vista panorámica, bañera de hidromasaje y mayordomo. Media pensión.','301','SUI','KB','HB',2,1,580,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Palacio del Inka, a Luxury Collection Hotel'),'Suite Presidencial','Suite de 120 m² con comedor privado, sala de estar, dos baños de mármol y vistas al Templo del Sol. Pensión completa.','401','SUI','KB','FB',4,1,950,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Palacio del Inka, a Luxury Collection Hotel'),'Habitación Triple','Habitación con tres camas individuales, baño completo y vistas al jardín interior. Incluye desayuno.','112','TPL','TB','BB',3,3,380,'USD',ARRAY['WiFi','TV','Aire Acondicionado'],ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],true,'disponible');

-- 2. MIRAFLORES PARK BELMOND — LIMA (5 estrellas)
INSERT INTO hoteles (nombre,descripcion,ciudad,direccion,telefono_whatsapp,email_contacto,imagenes_urls,estrellas,tipo_alojamiento,activo,latitud,longitud) VALUES (
  'Miraflores Park, A Belmond Hotel',
  'Hotel de lujo frente al Océano Pacífico en Miraflores. Dos restaurantes galardonados, piscina en azotea, spa y acceso al Malecón de la Reserva. Ganador Travelers Choice 2025.',
  'Lima','Malecón de la Reserva 1035, Miraflores, Lima','+51014106000','miraflorespark@belmond.com',
  ARRAY['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200','https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200'],
  5,'Hotel',true,-12.1328,-77.0282
);
INSERT INTO habitaciones (hotel_id,nombre,descripcion,numero_habitacion,tipo_habitacion,tipo_cama,regimen_alimentacion,capacidad_personas,cantidad_camas,precio_noche,moneda,amenidades,imagenes_urls,esta_disponible,estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Miraflores Park, A Belmond Hotel'),'Ocean View Room','Habitación de 42 m² con vista panorámica al Pacífico, cama king, baño de mármol con productos Molton Brown.','501','DBL','KB','RO',2,1,470,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Miraflores Park, A Belmond Hotel'),'City View Room','Habitación de 38 m² con vista a Miraflores, cama queen, escritorio ejecutivo y amenidades premium.','302','DBL','QB','RO',2,1,380,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Miraflores Park, A Belmond Hotel'),'Junior Suite Ocean','Suite junior de 55 m² con sala de estar, terraza privada con vista al mar y bañera independiente. Incluye desayuno.','601','SUI','KB','BB',2,1,680,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Miraflores Park, A Belmond Hotel'),'Penthouse Suite','Suite de 180 m² con terraza privada 360°, jacuzzi exterior y vistas al Pacífico. Incluye desayuno.','1201','SUI','KB','BB',2,1,1200,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Miraflores Park, A Belmond Hotel'),'Twin Room','Habitación con dos camas individuales, vista a la ciudad, ideal para viajeros de negocios.','203','TWN','TB','RO',2,2,350,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],true,'disponible');

-- 3. JW MARRIOTT HOTEL LIMA (5 estrellas)
INSERT INTO hoteles (nombre,descripcion,ciudad,direccion,telefono_whatsapp,email_contacto,imagenes_urls,estrellas,tipo_alojamiento,activo,latitud,longitud) VALUES (
  'JW Marriott Hotel Lima',
  'Hotel de lujo frente al Océano Pacífico en Miraflores. 300 habitaciones con vistas al mar, restaurante La Vista, piscina climatizada, spa y acceso a Costa Verde. A pasos de Larcomar.',
  'Lima','Malecón de la Reserva 615, Miraflores, Lima','+51014173000','reservas@jwmarriottlima.com',
  ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200','https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200'],
  5,'Hotel',true,-12.1350,-77.0295
);
INSERT INTO habitaciones (hotel_id,nombre,descripcion,numero_habitacion,tipo_habitacion,tipo_cama,regimen_alimentacion,capacidad_personas,cantidad_camas,precio_noche,moneda,amenidades,imagenes_urls,esta_disponible,estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='JW Marriott Hotel Lima'),'Deluxe Ocean View','Habitación de 42 m² con vista panorámica al Pacífico, cama king, baño de mármol con bañera y ducha separadas.','801','DBL','KB','RO',2,1,390,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='JW Marriott Hotel Lima'),'Deluxe City View','Habitación de 38 m² con vista a Miraflores, cama king y acceso al club ejecutivo.','405','DBL','KB','RO',2,1,310,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='JW Marriott Hotel Lima'),'Junior Suite Ocean','Suite de 65 m² con sala de estar, vista al océano y bañera de hidromasaje. Incluye desayuno.','1001','SUI','KB','BB',2,1,560,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar','Jacuzzi'],ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='JW Marriott Hotel Lima'),'Grand Suite','Suite de 95 m² con terraza privada, jacuzzi exterior y mayordomo 24h. Media pensión.','1201','SUI','KB','HB',4,1,850,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='JW Marriott Hotel Lima'),'Family Room','Habitación familiar de 55 m² con cama king y dos individuales. Incluye desayuno.','306','FAM','KB','BB',4,3,420,'USD',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],true,'disponible');

-- 4. INKATERRA MACHU PICCHU PUEBLO HOTEL (5 estrellas, Ecolodge)
INSERT INTO hoteles (nombre,descripcion,ciudad,direccion,telefono_whatsapp,email_contacto,imagenes_urls,estrellas,tipo_alojamiento,activo,latitud,longitud) VALUES (
  'Inkaterra Machu Picchu Pueblo Hotel',
  '83 casitas de adobe blanco en el bosque nuboso andino de Aguas Calientes, a 5 minutos de Machu Picchu. Mayor jardín de orquídeas del Perú (372 especies). Reconocido por National Geographic.',
  'Cusco','Km 110 Vía Férrea, Aguas Calientes, Cusco','+51984245314','reservas@inkaterra.com',
  ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200','https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200'],
  5,'Ecolodge',true,-13.1631,-72.5270
);
INSERT INTO habitaciones (hotel_id,nombre,descripcion,numero_habitacion,tipo_habitacion,tipo_cama,regimen_alimentacion,capacidad_personas,cantidad_camas,precio_noche,moneda,amenidades,imagenes_urls,esta_disponible,estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Inkaterra Machu Picchu Pueblo Hotel'),'Casita Deluxe','Casita de adobe de 40 m² con chimenea, cama king, ducha de piedra y terraza privada. Pensión completa.','C-12','DBL','KB','FB',2,1,680,'USD',ARRAY['WiFi','Minibar'],ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Inkaterra Machu Picchu Pueblo Hotel'),'Casita Superior Twin','Casita de 35 m² con camas twin, chimenea de piedra y terraza con hamaca. Pensión completa.','C-08','TWN','TB','FB',2,2,580,'USD',ARRAY['WiFi','Minibar'],ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Inkaterra Machu Picchu Pueblo Hotel'),'Suite Inkaterra','Suite de 75 m² con sala de estar, chimenea doble, bañera de piedra y mayordomo. Todo incluido.','S-03','SUI','KB','AI',2,1,1100,'USD',ARRAY['WiFi','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Inkaterra Machu Picchu Pueblo Hotel'),'Casita Familiar','Dos casitas conectadas con sala de estar compartida, cama king y dos camas adicionales. Pensión completa.','F-02','FAM','KB','FB',4,3,890,'USD',ARRAY['WiFi','Minibar'],ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],true,'disponible');

-- 5. GHL HOTEL LAGO TITICACA — PUNO (5 estrellas)
INSERT INTO hoteles (nombre,descripcion,ciudad,direccion,telefono_whatsapp,email_contacto,imagenes_urls,estrellas,tipo_alojamiento,activo,latitud,longitud) VALUES (
  'GHL Hotel Lago Titicaca',
  'Hotel de 5 estrellas en la Isla Esteves con vistas panorámicas al Lago Titicaca y Bolivia. Spa, restaurante novoandino, bar Taquile y acceso privado al lago. 114 habitaciones y 9 suites.',
  'Puno','Isla Esteves S/N, Lago Titicaca, Puno','+51951351881','reservas@ghllagotiticaca.com',
  ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200'],
  5,'Hotel',true,-15.8422,-70.0199
);
INSERT INTO habitaciones (hotel_id,nombre,descripcion,numero_habitacion,tipo_habitacion,tipo_cama,regimen_alimentacion,capacidad_personas,cantidad_camas,precio_noche,moneda,amenidades,imagenes_urls,esta_disponible,estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='GHL Hotel Lago Titicaca'),'Habitación Lago View King','Habitación de 35 m² con vista panorámica al Lago Titicaca, cama king y calefacción central. Incluye desayuno.','201','DBL','KB','BB',2,1,220,'USD',ARRAY['WiFi','TV','Minibar'],ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='GHL Hotel Lago Titicaca'),'Habitación Estándar Twin','Habitación de 30 m² con camas twin, calefacción y baño completo. Incluye desayuno.','105','TWN','TB','BB',2,2,180,'USD',ARRAY['WiFi','TV'],ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='GHL Hotel Lago Titicaca'),'Suite Titicaca','Suite de 60 m² con terraza privada con vista al lago, jacuzzi y chimenea. Media pensión.','301','SUI','KB','HB',2,1,420,'USD',ARRAY['WiFi','TV','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='GHL Hotel Lago Titicaca'),'Habitación Triple Lago','Habitación para 3 personas con vista al lago, cama matrimonial y una individual. Incluye desayuno.','115','TPL','TB','BB',3,2,260,'USD',ARRAY['WiFi','TV'],ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='GHL Hotel Lago Titicaca'),'Suite Presidencial Titicaca','Suite de 90 m² con vista 180° al lago, jacuzzi privado y mayordomo 24h. Todo incluido.','401','SUI','KB','AI',2,1,650,'USD',ARRAY['WiFi','TV','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],true,'disponible');

-- 6. CASA ANDINA PREMIUM MIRAFLORES — LIMA (4 estrellas)
INSERT INTO hoteles (nombre,descripcion,ciudad,direccion,telefono_whatsapp,email_contacto,imagenes_urls,estrellas,tipo_alojamiento,activo,latitud,longitud) VALUES (
  'Casa Andina Premium Miraflores',
  'Hotel 4 estrellas de la cadena peruana Casa Andina en Miraflores. Piscina cubierta climatizada, restaurante Alma con cocina peruana contemporánea, spa, gimnasio y 153 habitaciones. A pasos del Parque Kennedy.',
  'Lima','Av. La Paz 463, Miraflores, Lima','+51014471000','miraflores@casa-andina.com',
  ARRAY['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'],
  4,'Hotel',true,-12.1219,-77.0282
);
INSERT INTO habitaciones (hotel_id,nombre,descripcion,numero_habitacion,tipo_habitacion,tipo_cama,regimen_alimentacion,capacidad_personas,cantidad_camas,precio_noche,moneda,amenidades,imagenes_urls,esta_disponible,estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Casa Andina Premium Miraflores'),'Habitación Superior King','Habitación de 28 m² con cama king, escritorio ejecutivo, minibar y caja fuerte. Incluye desayuno.','401','DBL','KB','BB',2,1,540,'PEN',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Casa Andina Premium Miraflores'),'Habitación Superior Twin','Habitación de 28 m² con dos camas individuales, ideal para viajeros de negocios. Incluye desayuno.','302','TWN','TB','BB',2,2,490,'PEN',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Casa Andina Premium Miraflores'),'Suite Junior','Suite de 45 m² con sala de estar, cama king, bañera y ducha independiente. Incluye desayuno.','501','SUI','KB','BB',2,1,820,'PEN',ARRAY['WiFi','TV','Aire Acondicionado','Minibar','Jacuzzi'],ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Casa Andina Premium Miraflores'),'Habitación Familiar','Habitación de 40 m² con cama king y sofá cama para familias con niños. Incluye desayuno.','205','FAM','KB','BB',3,2,650,'PEN',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Casa Andina Premium Miraflores'),'Habitación Single','Habitación de 22 m² con cama individual, escritorio y baño completo. Incluye desayuno.','108','SGL','QB','BB',1,1,355,'PEN',ARRAY['WiFi','TV','Aire Acondicionado'],ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],true,'disponible');

-- 7. BELMOND HOTEL MONASTERIO — CUSCO (5 estrellas)
INSERT INTO hoteles (nombre,descripcion,ciudad,direccion,telefono_whatsapp,email_contacto,imagenes_urls,estrellas,tipo_alojamiento,activo,latitud,longitud) VALUES (
  'Belmond Hotel Monasterio',
  'Monasterio del siglo XVI convertido en hotel de lujo. Patrimonio Cultural con capilla barroca del 1600, jardín de cedros centenarios y habitaciones con sistema de oxigenación para la altitud de Cusco (3400 m).',
  'Cusco','Calle Palacios 136, Plazoleta Nazarenas, Cusco','+51984604000','monasterio@belmond.com',
  ARRAY['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200'],
  5,'Hotel',true,-13.5160,-71.9780
);
INSERT INTO habitaciones (hotel_id,nombre,descripcion,numero_habitacion,tipo_habitacion,tipo_cama,regimen_alimentacion,capacidad_personas,cantidad_camas,precio_noche,moneda,amenidades,imagenes_urls,esta_disponible,estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Belmond Hotel Monasterio'),'Habitación Estándar con Oxígeno','Habitación colonial de 35 m² con sistema de oxigenación, cama king, baño de mármol y vista al claustro. Incluye desayuno.','108','DBL','KB','BB',2,1,480,'USD',ARRAY['WiFi','TV','Minibar'],ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Belmond Hotel Monasterio'),'Habitación Superior Jardín','Habitación de 40 m² con vista al jardín de cedros centenarios, sistema de oxigenación y bañera de piedra. Incluye desayuno.','215','DBL','KB','BB',2,1,560,'USD',ARRAY['WiFi','TV','Minibar','Jacuzzi'],ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Belmond Hotel Monasterio'),'Suite Monasterio','Suite de 80 m² con vista al claustro colonial, oxigenación premium, bañera de mármol y mayordomo. Media pensión.','305','SUI','KB','HB',2,1,780,'USD',ARRAY['WiFi','TV','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Belmond Hotel Monasterio'),'Suite Grand Monasterio','Suite de 130 m² con terraza privada con vista a la capilla barroca, dos baños y comedor privado. Pensión completa.','401','SUI','KB','FB',4,1,1150,'USD',ARRAY['WiFi','TV','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Belmond Hotel Monasterio'),'Habitación Twin Claustro','Habitación de 32 m² con dos camas individuales, vista al claustro del siglo XVI y sistema de oxigenación. Incluye desayuno.','118','TWN','TB','BB',2,2,420,'USD',ARRAY['WiFi','TV','Minibar'],ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],true,'disponible');

-- 8. LIBERTADOR AREQUIPA HOTEL (5 estrellas)
INSERT INTO hoteles (nombre,descripcion,ciudad,direccion,telefono_whatsapp,email_contacto,imagenes_urls,estrellas,tipo_alojamiento,activo,latitud,longitud) VALUES (
  'Libertador Arequipa Hotel',
  'Hotel de 5 estrellas en el histórico convento de Santa Catalina, Ciudad Blanca. Construido en sillar volcánico, con jardines coloniales, restaurante El Monasterio con cocina arequipeña de autor, spa y piscina.',
  'Arequipa','Plaza Bolívar S/N, Selva Alegre, Arequipa','+51054215110','reservas@libertadorarequipa.com',
  ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200','https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200'],
  5,'Hotel',true,-16.3988,-71.5369
);
INSERT INTO habitaciones (hotel_id,nombre,descripcion,numero_habitacion,tipo_habitacion,tipo_cama,regimen_alimentacion,capacidad_personas,cantidad_camas,precio_noche,moneda,amenidades,imagenes_urls,esta_disponible,estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Libertador Arequipa Hotel'),'Habitación Deluxe Sillar','Habitación de 32 m² en sillar volcánico blanco, cama king, ducha de lluvia y vista al jardín colonial. Incluye desayuno.','201','DBL','KB','BB',2,1,730,'PEN',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Libertador Arequipa Hotel'),'Habitación Superior Twin','Habitación de 30 m² con dos camas individuales, vista al jardín y amenidades premium. Incluye desayuno.','115','TWN','TB','BB',2,2,620,'PEN',ARRAY['WiFi','TV','Aire Acondicionado'],ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Libertador Arequipa Hotel'),'Suite Volcán','Suite de 65 m² con vista al volcán Misti, sala de estar, jacuzzi y chimenea. Media pensión.','301','SUI','KB','HB',2,1,1425,'PEN',ARRAY['WiFi','TV','Aire Acondicionado','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Libertador Arequipa Hotel'),'Suite Colonial','Suite de 85 m² en el ala histórica del convento, con arcos de sillar, patio privado y vista a los tres volcanes. Pensión completa.','401','SUI','KB','FB',2,1,1950,'PEN',ARRAY['WiFi','TV','Aire Acondicionado','Minibar','Jacuzzi','Balcón'],ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Libertador Arequipa Hotel'),'Habitación Familiar','Habitación de 45 m² con cama king y dos individuales, vista al jardín. Incluye desayuno.','210','FAM','KB','BB',4,3,900,'PEN',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],true,'disponible');

-- 9. COSTA DEL SOL WYNDHAM TRUJILLO (4 estrellas)
INSERT INTO hoteles (nombre,descripcion,ciudad,direccion,telefono_whatsapp,email_contacto,imagenes_urls,estrellas,tipo_alojamiento,activo,latitud,longitud) VALUES (
  'Costa del Sol Wyndham Trujillo',
  'Hotel 4 estrellas afiliado a Wyndham en el centro de Trujillo. A minutos de Chan Chan y las Huacas del Sol y la Luna. Piscina, restaurante El Mochica con cocina norteña y 120 habitaciones modernas.',
  'Trujillo','Av. América Sur 2395, Trujillo','+51044224195','trujillo@costadelsolperu.com',
  ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200'],
  4,'Hotel',true,-8.1116,-79.0288
);
INSERT INTO habitaciones (hotel_id,nombre,descripcion,numero_habitacion,tipo_habitacion,tipo_cama,regimen_alimentacion,capacidad_personas,cantidad_camas,precio_noche,moneda,amenidades,imagenes_urls,esta_disponible,estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Costa del Sol Wyndham Trujillo'),'Habitación Estándar King','Habitación de 26 m² con cama king, escritorio y baño con ducha. Incluye desayuno.','201','DBL','KB','BB',2,1,320,'PEN',ARRAY['WiFi','TV','Aire Acondicionado'],ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Costa del Sol Wyndham Trujillo'),'Habitación Estándar Twin','Habitación de 26 m² con dos camas individuales y baño completo. Incluye desayuno.','115','TWN','TB','BB',2,2,300,'PEN',ARRAY['WiFi','TV','Aire Acondicionado'],ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Costa del Sol Wyndham Trujillo'),'Habitación Superior','Habitación de 32 m² con cama king, minibar y vista a la piscina. Incluye desayuno.','305','DBL','KB','BB',2,1,410,'PEN',ARRAY['WiFi','TV','Aire Acondicionado','Minibar'],ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Costa del Sol Wyndham Trujillo'),'Suite Junior','Suite de 48 m² con sala de estar, cama king y bañera independiente. Incluye desayuno.','401','SUI','KB','BB',2,1,620,'PEN',ARRAY['WiFi','TV','Aire Acondicionado','Minibar','Jacuzzi'],ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Costa del Sol Wyndham Trujillo'),'Habitación Familiar','Habitación de 38 m² con cama king y sofá cama para familias. Incluye desayuno.','210','FAM','KB','BB',3,2,490,'PEN',ARRAY['WiFi','TV','Aire Acondicionado'],ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],true,'disponible');

-- 10. HOTEL TAYPIKALA LAGO — PUNO (3 estrellas)
INSERT INTO hoteles (nombre,descripcion,ciudad,direccion,telefono_whatsapp,email_contacto,imagenes_urls,estrellas,tipo_alojamiento,activo,latitud,longitud) VALUES (
  'Hotel Taypikala Lago Puno',
  'Hotel 3 estrellas con vista directa al Lago Titicaca en el centro de Puno. Restaurante con cocina típica puneña, bar con vista al lago y 60 habitaciones confortables. Punto de partida para las Islas Uros y Taquile.',
  'Puno','Av. Sesquicentenario 1970, Puno','+51951352201','reservas@taypikala.com',
  ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200'],
  3,'Hotel',true,-15.8402,-70.0219
);
INSERT INTO habitaciones (hotel_id,nombre,descripcion,numero_habitacion,tipo_habitacion,tipo_cama,regimen_alimentacion,capacidad_personas,cantidad_camas,precio_noche,moneda,amenidades,imagenes_urls,esta_disponible,estado_mantenimiento) VALUES
((SELECT id FROM hoteles WHERE nombre='Hotel Taypikala Lago Puno'),'Habitación Lago View','Habitación de 25 m² con vista al Lago Titicaca, cama matrimonial y calefacción. Incluye desayuno.','201','DBL','QB','BB',2,1,280,'PEN',ARRAY['WiFi','TV'],ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Hotel Taypikala Lago Puno'),'Habitación Estándar Twin','Habitación de 22 m² con dos camas individuales y calefacción. Incluye desayuno.','105','TWN','TB','BB',2,2,245,'PEN',ARRAY['WiFi','TV'],ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Hotel Taypikala Lago Puno'),'Habitación Triple','Habitación de 28 m² con tres camas individuales y vista al lago. Incluye desayuno.','115','TPL','TB','BB',3,3,340,'PEN',ARRAY['WiFi','TV'],ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'],true,'disponible'),
((SELECT id FROM hoteles WHERE nombre='Hotel Taypikala Lago Puno'),'Suite Lago','Suite de 40 m² con sala de estar, vista panorámica al Titicaca, cama king y bañera. Incluye desayuno.','301','SUI','KB','BB',2,1,525,'PEN',ARRAY['WiFi','TV','Minibar','Jacuzzi'],ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],true,'disponible');

-- FIN: 10 hoteles, 47 habitaciones
-- Ciudades: Cusco(3), Lima(3), Puno(2), Arequipa(1), Trujillo(1)
-- Precios USD: desde $65 hasta $1200 por noche

