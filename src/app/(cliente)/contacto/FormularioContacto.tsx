'use client';

import { type FormEvent, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { useConfiguracionWeb } from '@/hooks/useConfiguracionWeb';
import { crearUrlWhatsApp } from '@/lib/configuracion';

export function FormularioContacto() {
  const config = useConfiguracionWeb();
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nombre = (fd.get('nombre') as string).trim();
    const asunto = fd.get('asunto') as string;
    const mensaje = (fd.get('mensaje') as string).trim();
    const textoMensaje = `Hola, soy ${nombre}.\n\nAsunto: ${asunto}\n\n${mensaje}`;
    if (anchorRef.current) {
      anchorRef.current.href = crearUrlWhatsApp(config.whatsapp_numero, textoMensaje);
      anchorRef.current.click();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 bg-[#25D366]/10 rounded-xl flex items-center justify-center shrink-0">
          <MessageCircle size={20} className="text-[#25D366]" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-bold text-(--brand-navy)">
            Escríbenos por WhatsApp
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Completa el formulario y te abrimos el chat listo</p>
        </div>
      </div>

      <div className="h-px bg-gray-100 mb-6" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <div>
          <label htmlFor="nombre" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Tu nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            placeholder="¿Cómo te llamas?"
            className="w-full px-4 py-3 text-sm text-(--brand-navy) border border-gray-200 rounded-xl focus:outline-none focus:border-(--brand-yellow) focus:ring-2 focus:ring-(--brand-yellow)/15 transition-all bg-gray-50 hover:bg-white placeholder:text-gray-300 font-medium"
          />
        </div>

        <div>
          <label htmlFor="asunto" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            ¿En qué te podemos ayudar?
          </label>
          <select
            id="asunto"
            name="asunto"
            className="w-full px-4 py-3 text-sm text-(--brand-navy) border border-gray-200 rounded-xl focus:outline-none focus:border-(--brand-yellow) focus:ring-2 focus:ring-(--brand-yellow)/15 transition-all bg-gray-50 hover:bg-white appearance-none cursor-pointer font-medium"
          >
            <option value="Consulta de reserva">Consulta de reserva</option>
            <option value="Información de hoteles">Información de hoteles</option>
            <option value="Hospedaje corporativo">Hospedaje corporativo</option>
            <option value="Evento especial">Evento especial</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            required
            rows={4}
            placeholder="Cuéntanos más detalles sobre tu consulta..."
            className="w-full px-4 py-3 text-sm text-(--brand-navy) border border-gray-200 rounded-xl focus:outline-none focus:border-(--brand-yellow) focus:ring-2 focus:ring-(--brand-yellow)/15 transition-all bg-gray-50 hover:bg-white placeholder:text-gray-300 resize-none font-medium"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] text-white font-black text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] hover:-translate-y-0.5"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Abrir WhatsApp con mi mensaje
        </button>

        <p className="text-center text-[10px] text-gray-400 leading-relaxed">
          Al enviar, se abrirá WhatsApp con tu mensaje prellenado.<br />
          Sin intermediarios, respuesta directa.
        </p>

      </form>

      <a ref={anchorRef} target="_blank" rel="noopener noreferrer" className="hidden" aria-hidden="true" />
    </div>
  );
}
