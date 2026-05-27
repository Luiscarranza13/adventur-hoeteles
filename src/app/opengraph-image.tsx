import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Adventur Hoteles — Alojamiento en Cajamarca y todo el Perú';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#001f3f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,214,0,0.12) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px' }}>
          <div
            style={{
              background: '#ffd600',
              borderRadius: '18px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="#001f3f">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 }}>ADVENTUR</span>
            <span style={{ color: '#ffd600', fontSize: '14px', fontWeight: 700, letterSpacing: '5px', marginTop: '4px' }}>HOTELES</span>
          </div>
        </div>
        <h1 style={{ color: 'white', fontSize: '58px', fontWeight: 900, textAlign: 'center', lineHeight: 1.1, margin: '0 0 24px 0', maxWidth: '960px' }}>
          Hoteles verificados en todo el <span style={{ color: '#ffd600' }}>Perú</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '26px', textAlign: 'center', margin: '0 0 44px 0' }}>
          Reserva directa por WhatsApp · Sin comisiones
        </p>
        <div style={{ background: '#ffd600', borderRadius: '50px', padding: '14px 36px', display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#001f3f', fontSize: '20px', fontWeight: 900 }}>hoteles.adventur.pe</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
