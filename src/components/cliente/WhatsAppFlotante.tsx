'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CONFIGURACION_DEFAULT, crearUrlWhatsApp, normalizarConfiguracion, type ConfiguracionWeb } from '@/lib/configuracion';

export function WhatsAppFlotante() {
  const [config, setConfig] = useState<ConfiguracionWeb>(CONFIGURACION_DEFAULT);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/configuracion')
      .then(res => res.ok ? res.json() : null)
      .then(data => setConfig(normalizarConfiguracion(data)))
      .catch(() => setConfig(CONFIGURACION_DEFAULT));
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <a
      href={crearUrlWhatsApp(config.whatsapp_numero, config.whatsapp_mensaje_reserva)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[100] group"
      aria-label="Contactar por WhatsApp"
    >
      <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-[#001f3f] text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap">
          ¿Necesitas ayuda? <span className="text-[#ffd600]">¡Escríbenos!</span>
        </div>
        <div className="w-2.5 h-2.5 bg-[#001f3f] rotate-45 absolute -bottom-1 right-5" />
      </div>

      <div className="relative w-14 h-14">
        <span
          className="absolute inset-0 rounded-full bg-green-400 opacity-40 animate-ping"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 rounded-full bg-[#25D366] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
          style={{ boxShadow: 'none', filter: 'none' }}
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="16" fill="#25D366" />
            <path
              d="M22.5 19.8c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-1.72-.86-2.85-1.54-3.99-3.49-.3-.52.3-.48.86-1.6.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49 1.89.82 2.63.89 3.57.75.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"
              fill="white"
            />
            <path
              d="M16 6C10.48 6 6 10.48 6 16c0 1.85.5 3.58 1.37 5.07L6 26l5.09-1.34A9.94 9.94 0 0016 26c5.52 0 10-4.48 10-10S21.52 6 16 6zm0 18.15a8.12 8.12 0 01-4.14-1.13l-.3-.18-3.07.8.82-2.99-.19-.31A8.15 8.15 0 1116 24.15z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </a>
  );
}
