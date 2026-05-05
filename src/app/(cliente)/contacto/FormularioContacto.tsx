'use client';

import { MessageCircle } from 'lucide-react';

export function FormularioContacto() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nombre = (fd.get('nombre') as string).trim();
    const asunto = fd.get('asunto') as string;
    const mensaje = (fd.get('mensaje') as string).trim();
    const texto = encodeURIComponent(
      `Hola, soy ${nombre}.\n\nAsunto: ${asunto}\n\n${mensaje}`
    );
    window.open(`https://wa.me/51958101721?text=${texto}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">

      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 bg-[#25D366]/10 rounded-xl flex items-center justify-center shrink-0">
          <MessageCircle size={16} className="text-[#25D366]" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[var(--brand-navy)]">
            Escríbenos por WhatsApp
          </h2>
          <p className="text-xs text-gray-400">Completa el formulario y te abrimos el chat listo</p>
        </div>
      </div>

      <div className="h-px bg-gray-100 my-5" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label htmlFor="nombre" className="block text-xs font-medium text-gray-600 mb-1.5">
            Tu nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            placeholder="¿Cómo te llamas?"
            className="w-full px-4 py-2.5 text-sm text-[var(--brand-navy)] border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-yellow)] focus:ring-2 focus:ring-[var(--brand-yellow)]/15 transition-all bg-gray-50 placeholder:text-gray-300"
          />
        </div>

        <div>
          <label htmlFor="asunto" className="block text-xs font-medium text-gray-600 mb-1.5">
            ¿En qué te podemos ayudar?
          </label>
          <select
            id="asunto"
            name="asunto"
            className="w-full px-4 py-2.5 text-sm text-[var(--brand-navy)] border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-yellow)] focus:ring-2 focus:ring-[var(--brand-yellow)]/15 transition-all bg-gray-50 appearance-none cursor-pointer"
          >
            <option value="Consulta de reserva">Consulta de reserva</option>
            <option value="Información de hoteles">Información de hoteles</option>
            <option value="Hospedaje corporativo">Hospedaje corporativo</option>
            <option value="Evento especial">Evento especial</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-xs font-medium text-gray-600 mb-1.5">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            required
            rows={4}
            placeholder="Cuéntanos más detalles sobre tu consulta..."
            className="w-full px-4 py-2.5 text-sm text-[var(--brand-navy)] border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-yellow)] focus:ring-2 focus:ring-[var(--brand-yellow)]/15 transition-all bg-gray-50 placeholder:text-gray-300 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95 text-white font-semibold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <MessageCircle size={15} aria-hidden="true" />
          Abrir WhatsApp con mi mensaje
        </button>

        <p className="text-center text-[10px] text-gray-400">
          Al enviar, se abrirá WhatsApp con tu mensaje prellenado
        </p>

      </form>
    </div>
  );
}
