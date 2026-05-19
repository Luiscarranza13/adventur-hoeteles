'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Poppins, sans-serif', background: '#f8fafc' }}>
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <section style={{
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '1.5rem',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 40px -8px rgba(0,31,63,0.12)',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '1rem',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <AlertTriangle size={28} color="#dc2626" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#001f3f', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Algo salió mal
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              La aplicación encontró un problema inesperado. Intenta recargar esta vista.
            </p>
            {error.digest && (
              <p style={{ marginBottom: '1.25rem', fontSize: '0.6875rem', color: '#94a3b8', fontFamily: 'monospace', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.5rem' }}>
                Ref: {error.digest}
              </p>
            )}
            <button
              type="button"
              onClick={reset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#ffd600',
                color: '#001f3f',
                fontWeight: 900,
                fontSize: '0.8125rem',
                padding: '0.875rem 1.75rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 14px rgba(255,214,0,0.35)',
              }}
            >
              <RotateCcw size={15} />
              Reintentar
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
