-- ============================================================
-- MIGRACIÓN 010: FOTOS REALES DE HOTELES Y HABITACIONES
-- Fuente: Sitios web oficiales + TripAdvisor CDN
-- Ejecutar DESPUÉS de la migración 009
-- ============================================================

-- ============================================================
-- HOTELES: fotos exteriores / lobby reales
-- ============================================================

-- 2. Montañas (hotelmonthanas.com)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://hotelmonthanas.com/wp-content/uploads/2022/06/hotel_monthanas_cajamarca_bienvenidos_01.jpg',
  'https://hotelmonthanas.com/wp-content/uploads/2022/07/hotel_monta%C3%B1as_cajamarca_2-1.jpg'
] WHERE nombre = 'Montañas';

-- 3. Retamas I (TripAdvisor)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/6f/85/db/retamas-hotel.jpg?w=900&h=500&s=1',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/b0/af/87/retamas-hotel.jpg?w=900&h=500&s=1'
] WHERE nombre = 'Retamas I';

-- 5. Catequil (TripAdvisor)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/ac/59/71/comodas-habitaciones.jpg?w=900&h=500&s=1',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/45/0e/19/hostal-catequil.jpg?w=900&h=500&s=1'
] WHERE nombre = 'Catequil';

-- 6. Silva Inn (TripAdvisor)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/49/3b/03/fachada-de-nuestro-hotel.jpg?w=900&h=500&s=1',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/7c/a5/60/hotel-silva-inn.jpg?w=900&h=500&s=1'
] WHERE nombre = 'Silva Inn';

-- 7. Sol de Belén (TripAdvisor)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/dc/d7/6a/hotel-sol-de-belen.jpg?w=900&h=500&s=1',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/38/67/96/hotel-sol-de-belen.jpg?w=900&h=500&s=1'
] WHERE nombre = 'Sol de Belén';

-- 8. Casa Blanca (TripAdvisor)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/f5/a4/35/hotel-casa-blanca.jpg?w=900&h=500&s=1',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/f5/7c/8c/hotel-casa-blanca.jpg?w=900&h=500&s=1'
] WHERE nombre = 'Casa Blanca';

-- 9. Hotel Cajamarca (TripAdvisor)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/ec/43/37/caption.jpg?w=900&h=500&s=1',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/ec/43/3d/caption.jpg?w=900&h=500&s=1'
] WHERE nombre = 'Hotel Cajamarca';

-- 10. Portal del Marquez (portaldelmarques.com)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://portaldelmarques.com/wp-content/uploads/2024/07/patio-a-1.png',
  'https://portaldelmarques.com/wp-content/uploads/2024/01/3-1-scaled.jpg'
] WHERE nombre = 'Portal del Marquez';

-- 11. Las Américas (lasamericashotel.com.pe + TripAdvisor)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://i0.wp.com/www.lasamericashotel.com.pe/wp-content/uploads/2022/06/info.jpg?fit=790%2C450&ssl=1',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/2a/39/94/20181025-215119-largejpg.jpg?w=900&h=500&s=1'
] WHERE nombre = 'Las Américas';

-- 12. Continental (hotelcontinental.com.pe)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://hotelcontinental.com.pe/wp-content/uploads/2025/02/bienvenido-1-hotel-continental-cajamarca-e1738451981640.jpg',
  'https://hotelcontinental.com.pe/wp-content/uploads/2025/02/bienvenido-2-hotel-continental-cajamarca.png'
] WHERE nombre = 'Continental';

-- 14. Fundo El Chocho (fundoelchocho.com - Wix)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://static.wixstatic.com/media/535015_005a7e7e4c1b448eb6fa58b0dddace1e~mv2.jpg',
  'https://static.wixstatic.com/media/535015_b2424565c63244b0a75a43e4a6c31e24~mv2.jpg'
] WHERE nombre = 'Fundo El Chocho';

-- 15. Pilancones (hotelpilanconescajamarca.com)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://hotelpilanconescajamarca.com/imagenes/hotel-pilancones-cajamarca-1.fw.png',
  'https://hotelpilanconescajamarca.com/imagenes/hotel-pilancones-cajamarca-2.fw.png'
] WHERE nombre = 'Pilancones';

-- 16. Posada Puruay (posadapuruay.com.pe)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://posadapuruay.com.pe/wp-content/uploads/2022/10/principalv0.1.jpg',
  'https://posadapuruay.com.pe/wp-content/uploads/2019/02/Puruay-baja-78.jpg'
] WHERE nombre = 'Posada Puruay';

-- 17. Gran Continental (TripAdvisor)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/d1/ca/2d/gran-hotel-continental.jpg?w=900&h=500&s=1',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/a7/2b/f9/gran-hotel-continental.jpg?w=900&h=500&s=1'
] WHERE nombre = 'Gran Continental';

-- 18. Laguna Seca (lagunaseca.com.pe + TripAdvisor)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/d2/30/fc/piscina-redonda.jpg?w=900&h=500&s=1',
  'https://lagunaseca.com.pe/media/image/DSC02728.jpg'
] WHERE nombre = 'Laguna Seca';

-- 19. Costa del Sol (costadelsolperu.com + TripAdvisor)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/aa/85/7a/fachada-exterior-del.jpg?w=900&h=500&s=1',
  'https://costadelsolperu.com/wp-content/uploads/2025/09/Caj_Exterior_Fachada_2_1-3.jpg'
] WHERE nombre = 'Costa del Sol';

-- 20. Namora Domo Experience (TripAdvisor / Booking)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/partner/bookingcom/photo-o/31/61/da/77/namora-domo-experienc.jpg?w=900&h=500&s=1',
  'https://dynamic-media-cdn.tripadvisor.com/media/partner/bookingcom/photo-o/31/97/93/0c/namora-domo-experienc.jpg?w=900&h=500&s=1'
] WHERE nombre = 'Namora Domo Experience';

-- 21. Nakama Eco-Resort (TripAdvisor / Booking)
UPDATE hoteles SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/partner/bookingcom/photo-o/33/39/69/e5/glamping-nakama-cajam.jpg?w=900&h=-1&s=1',
  'https://dynamic-media-cdn.tripadvisor.com/media/partner/bookingcom/photo-o/33/32/b9/a6/glamping-nakama-cajam.jpg?w=900&h=-1&s=1'
] WHERE nombre = 'Nakama Eco-Resort';

-- ============================================================
-- HABITACIONES: fotos reales de cuartos
-- ============================================================

-- Montañas — habitaciones
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://hotelmonthanas.com/wp-content/uploads/2022/07/habitacion_matrimonial_hotel_cajamarca_00.jpg'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Montañas')
  AND tipo_habitacion IN ('DBL','TWN');

UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://hotelmonthanas.com/wp-content/uploads/2022/07/habitacion_doble_hotel_cajamarca_.jpg'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Montañas')
  AND tipo_habitacion IN ('SGL','TPL');

-- Retamas I — habitaciones (TripAdvisor)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/b0/af/78/retamas-hotel.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Retamas I');

-- Catequil — habitaciones (TripAdvisor)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/d7/6d/b9/room.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Catequil')
  AND tipo_habitacion IN ('SGL','DBL');

UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/d7/6d/9d/room.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Catequil')
  AND tipo_habitacion = 'FAM';

-- Silva Inn — habitaciones (TripAdvisor)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/7f/fb/a6/hotel-silva-inn.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Silva Inn');

-- Sol de Belén — habitaciones (TripAdvisor)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/dc/f8/7d/hotel-sol-de-belen.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Sol de Belén');

-- Casa Blanca — habitaciones (TripAdvisor)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/68/28/a5/excelente-localizacion.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Casa Blanca')
  AND tipo_habitacion IN ('SGL','DBL','FAM');

-- Hotel Cajamarca — habitaciones (TripAdvisor)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/6c/44/53/hotel-cajamarca.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Hotel Cajamarca')
  AND tipo_habitacion IN ('SGL','DBL');

UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/a2/14/a4/hotel-cajamarca.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Hotel Cajamarca')
  AND tipo_habitacion IN ('TWN','TPL');

-- Portal del Marquez — habitaciones (TripAdvisor)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/28/76/b4/habitaciones-interiores.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Portal del Marquez')
  AND tipo_habitacion IN ('SGL','DBL','TPL');

-- Las Américas — habitaciones (TripAdvisor)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/37/c3/59/the-room.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Las Américas')
  AND tipo_habitacion IN ('SGL','DBL');

UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/2a/39/98/20181025-070940-largejpg.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Las Américas')
  AND tipo_habitacion IN ('TPL','SUI');

-- Continental — habitaciones (hotelcontinental.com.pe)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://hotelcontinental.com.pe/wp-content/uploads/2025/02/habitacion-simple-destacada-hotel-continental-cajamarca-1110x570.jpg'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Continental')
  AND tipo_habitacion = 'SGL';

UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://hotelcontinental.com.pe/wp-content/uploads/2025/02/habitacion-matrimonial-destacada-hotel-continental-cajamarca-1110x570.jpg'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Continental')
  AND tipo_habitacion IN ('DBL','TWN');

-- Fundo El Chocho — habitaciones (Wix)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://static.wixstatic.com/media/535015_fe86df2608c345a0a8ae88dc42190f2d~mv2.jpg'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Fundo El Chocho');

-- Pilancones — habitaciones (hotelpilanconescajamarca.com)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://hotelpilanconescajamarca.com/imagenes/habitaciones/simple-laptop.fw.png'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Pilancones')
  AND tipo_habitacion = 'SGL';

-- Posada Puruay — habitaciones (posadapuruay.com.pe)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://posadapuruay.com.pe/wp-content/uploads/2019/04/Matrimonial-1.jpg'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Posada Puruay')
  AND tipo_habitacion = 'DBL';

UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://posadapuruay.com.pe/wp-content/uploads/2019/04/Suite-1.jpg'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Posada Puruay')
  AND tipo_habitacion = 'SUI';

-- Gran Continental — habitaciones (TripAdvisor)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/d1/ca/2f/gran-hotel-continental.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Gran Continental')
  AND tipo_habitacion IN ('SGL','DBL');

UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/8b/d4/ac/gran-hotel-continental.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Gran Continental')
  AND tipo_habitacion IN ('TPL','SUI');

-- Laguna Seca — habitaciones (lagunaseca.com.pe)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://lagunaseca.com.pe/media/image/SUITE-EJECUTIVA-MATRIMONIAL-4.jpg'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Laguna Seca');

-- Costa del Sol — habitaciones (TripAdvisor)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/02/df/9e/20170328-131425-largejpg.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Costa del Sol');

-- Namora Domo Experience — habitaciones (TripAdvisor / Booking)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/partner/bookingcom/photo-o/31/97/93/0d/namora-domo-experienc.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Namora Domo Experience');

-- Nakama Eco-Resort — habitaciones (TripAdvisor / Booking)
UPDATE habitaciones SET imagenes_urls = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/partner/bookingcom/photo-o/33/32/b9/a9/nearby-landmark.jpg?w=900&h=500&s=1'
]
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Nakama Eco-Resort');

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT h.nombre,
       array_length(h.imagenes_urls, 1) AS fotos_hotel,
       COUNT(hab.id) AS habitaciones,
       COUNT(CASE WHEN array_length(hab.imagenes_urls, 1) > 0 THEN 1 END) AS habs_con_foto
FROM hoteles h
LEFT JOIN habitaciones hab ON hab.hotel_id = h.id
GROUP BY h.id, h.nombre
ORDER BY h.nombre;
