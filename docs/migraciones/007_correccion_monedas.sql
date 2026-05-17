-- ============================================================
-- MIGRACIÓN 007: CORRECCIÓN DE MONEDAS
-- Los hoteles nacionales peruanos cobran en Soles (PEN)
-- Tipo de cambio referencial: 1 USD = 3.75 PEN (mayo 2025)
-- ============================================================

-- Casa Andina Premium Miraflores → PEN
-- USD 95-220 → S/356-825
UPDATE habitaciones SET
  precio_noche = ROUND(precio_noche * 3.75),
  moneda = 'PEN'
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Casa Andina Premium Miraflores');

-- Costa del Sol Wyndham Trujillo → PEN
-- USD 80-165 → S/300-619
UPDATE habitaciones SET
  precio_noche = ROUND(precio_noche * 3.75),
  moneda = 'PEN'
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Costa del Sol Wyndham Trujillo');

-- Hotel Taypikala Lago Puno → PEN
-- USD 65-140 → S/244-525
UPDATE habitaciones SET
  precio_noche = ROUND(precio_noche * 3.75),
  moneda = 'PEN'
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Hotel Taypikala Lago Puno');

-- Libertador Arequipa → PEN (cadena peruana)
-- USD 165-520 → S/619-1950
UPDATE habitaciones SET
  precio_noche = ROUND(precio_noche * 3.75),
  moneda = 'PEN'
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'Libertador Arequipa Hotel');

-- GHL Hotel Lago Titicaca → PEN (cadena colombo-peruana, cobra en soles localmente)
-- USD 180-650 → S/675-2438
UPDATE habitaciones SET
  precio_noche = ROUND(precio_noche * 3.75),
  moneda = 'PEN'
WHERE hotel_id = (SELECT id FROM hoteles WHERE nombre = 'GHL Hotel Lago Titicaca');

-- Los siguientes se quedan en USD (internacionales):
-- Palacio del Inka (Marriott Luxury Collection)
-- Miraflores Park (Belmond)
-- JW Marriott Hotel Lima
-- Inkaterra Machu Picchu Pueblo Hotel
-- Belmond Hotel Monasterio

-- Verificar resultados
SELECT
  h.nombre AS hotel,
  hab.nombre AS habitacion,
  hab.precio_noche,
  hab.moneda
FROM habitaciones hab
JOIN hoteles h ON h.id = hab.hotel_id
ORDER BY hab.moneda, hab.precio_noche;
