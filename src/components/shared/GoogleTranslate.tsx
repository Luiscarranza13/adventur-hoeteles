'use client';

import { useEffect, useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

const IDIOMAS = [
  { code: 'es', label: 'Español', flag: '🇵🇪' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

function obtenerIdiomaActual(): string {
  if (typeof document === 'undefined') return 'es';
  const cookie = document.cookie.split(';').find(c => c.trim().startsWith('googtrans='));
  if (!cookie) return 'es';
  const partes = cookie.trim().split('/');
  return partes[partes.length - 1] || 'es';
}

function cambiarIdioma(codigo: string) {
  const dominio = window.location.hostname;
  if (codigo === 'es') {
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${dominio}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  } else {
    document.cookie = `googtrans=/es/${codigo}; path=/; domain=${dominio}`;
    document.cookie = `googtrans=/es/${codigo}; path=/`;
  }
  window.location.reload();
}

export function SelectorIdioma() {
  const [idiomaActual] = useState(() => obtenerIdiomaActual());

  const actual = IDIOMAS.find(i => i.code === idiomaActual) ?? IDIOMAS[0];

  const abrirSelector = () => {
    const botonesHtml = IDIOMAS.map(({ code, label, flag }) => {
      const esActivo = code === idiomaActual;
      return `
        <button
          data-code="${code}"
          class="swal-idioma-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
            ${esActivo
              ? 'bg-[#001f3f] text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }"
          style="
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 12px 16px;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-family: Montserrat, sans-serif;
            font-weight: 500;
            background: ${esActivo ? '#001f3f' : '#f9fafb'};
            color: ${esActivo ? '#ffffff' : '#374151'};
            transition: background 0.2s;
          "
        >
          <span style="font-size: 20px;">${flag}</span>
          <span style="flex: 1;">${label}</span>
          ${esActivo ? '<span style="color: #ffd600; font-size: 16px;">✓</span>' : ''}
        </button>
      `;
    }).join('');

    Swal.fire({
      html: `
        <div style="text-align: center; margin-bottom: 16px;">
          <img
            src="https://www.gstatic.com/images/branding/product/2x/translate_24dp.png"
            alt="Google Translate"
            style="width: 40px; height: 40px; margin: 0 auto 8px;"
            onerror="this.style.display='none'"
          />
          <p style="font-size: 11px; color: #9ca3af; font-family: Montserrat, sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">
            Traducido por Google
          </p>
        </div>
        <p style="font-size: 15px; font-weight: 700; color: #001f3f; font-family: Montserrat, sans-serif; margin-bottom: 16px;">
          Selecciona el idioma
        </p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${botonesHtml}
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      width: 320,
      padding: '24px',
      background: '#ffffff',
      customClass: {
        popup: 'swal-idioma-popup',
        closeButton: 'swal-idioma-close',
      },
      didOpen: () => {
        document.querySelectorAll('.swal-idioma-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const code = (btn as HTMLElement).dataset.code;
            if (code) {
              Swal.close();
              cambiarIdioma(code);
            }
          });
          btn.addEventListener('mouseenter', () => {
            const code = (btn as HTMLElement).dataset.code;
            if (code !== idiomaActual) {
              (btn as HTMLElement).style.background = '#f3f4f6';
            }
          });
          btn.addEventListener('mouseleave', () => {
            const code = (btn as HTMLElement).dataset.code;
            if (code !== idiomaActual) {
              (btn as HTMLElement).style.background = '#f9fafb';
            }
          });
        });
      },
    });
  };

  return (
    <>
      <button
        onClick={abrirSelector}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gray-50/80 hover:bg-gray-100 border border-gray-200/80 transition-all text-xs font-bold text-[#001f3f] min-w-[85px] justify-between group shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-gray-400 group-hover:text-[#001f3f] transition-colors" />
          <span className="uppercase tracking-widest">{actual.code}</span>
        </div>
        <ChevronDown size={14} className="text-gray-400 group-hover:text-[#001f3f] transition-colors" />
      </button>
      <div id="google_translate_element" className="hidden" suppressHydrationWarning />
    </>
  );
}

export function GoogleTranslateScript() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'es', includedLanguages: 'es,en', autoDisplay: false },
        'google_translate_element'
      );
    };

    if (!document.getElementById('gt-script')) {
      const script = document.createElement('script');
      script.id = 'gt-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(script);
    }

    const fix = setInterval(() => {
      if (document.body) document.body.style.top = '0px';
      if (document.documentElement) document.documentElement.style.marginTop = '0px';
    }, 300);

    return () => clearInterval(fix);
  }, []);

  return null;
}
