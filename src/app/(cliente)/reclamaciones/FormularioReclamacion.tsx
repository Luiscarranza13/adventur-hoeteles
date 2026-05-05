'use client';

import { MessageCircle } from 'lucide-react';

export function FormularioReclamacion() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nombre = (fd.get('nombre') as string).trim();
    const dni = (fd.get('dni') as string).trim();
    const tipo = fd.get('tipo') as string;
    const detalle = (fd.get('detalle') as string).trim();
    const pedido = (fd.get('pedido') as string).trim();
    const texto = encodeURIComponent(
      `📋 *LIBRO DE RECLAMACIONES*\n\n` +
      `*Nombre:* ${nombre}\n` +
      `*DNI/CE:* ${dni}\n` +
      `*Tipo:* ${tipo}\n\n` +
      `*Descripción del hecho:*\n${detalle}\n\n` +
      `*Pedido del consumidor:*\n${pedido}`
    );
    window.open(`https://wa.me/51958101721?text=${texto}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="text-sm font-semibold text-[var(--brand-navy)] mb-1">Registrar queja o reclamo</h2>
      <p className="text-xs text-gray-400 mb-6">Se enviará por WhatsApp y recibirás respuesta en máximo 30 días.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-xs font-medium text-gray-600 mb-1.5">
              Nombre completo <span className="text-red-400">*</span>
            </label>
            <input
              id="nombre" name="nombre" type="text" required
              placeholder="Tu nombre completo"
              className="w-full px-4 py-2.5 text-sm text-[var(--brand-navy)] border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-yellow)] focus:ring-2 focus:ring-[var(--brand-yellow)]/15 transition-all bg-gray-50 placeholder:text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="dni" className="block text-xs font-medium text-gray-600 mb-1.5">
              DNI / CE <span className="text-red-400">*</span>
            </label>
            <input
              id="dni" name="dni" type="text" required
              placeholder="Número de documento"
              className="w-full px-4 py-2.5 text-sm text-[var(--brand-navy)] border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-yellow)] focus:ring-2 focus:ring-[var(--brand-yellow)]/15 transition-all bg-gray-50 placeholder:text-gray-300"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tipo" className="block text-xs font-medium text-gray-600 mb-1.5">
            Tipo <span className="text-red-400">*</span>
          </label>
          <select
            id="tipo" name="tipo" required
            className="w-full px-4 py-2.5 text-sm text-[var(--brand-navy)] border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-yellow)] focus:ring-2 focus:ring-[var(--brand-yellow)]/15 transition-all bg-gray-50 appearance-none cursor-pointer"
          >
            <option value="Reclamo">Reclamo — disconformidad con el servicio</option>
            <option value="Queja">Queja — malestar por atención recibida</option>
          </select>
        </div>

        <div>
          <label htmlFor="detalle" className="block text-xs font-medium text-gray-600 mb-1.5">
            Descripción del hecho <span className="text-red-400">*</span>
          </label>
          <textarea
            id="detalle" name="detalle" required rows={4}
            placeholder="Describe con detalle lo ocurrido..."
            className="w-full px-4 py-2.5 text-sm text-[var(--brand-navy)] border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-yellow)] focus:ring-2 focus:ring-[var(--brand-yellow)]/15 transition-all bg-gray-50 placeholder:text-gray-300 resize-none"
          />
        </div>

        <div>
          <label htmlFor="pedido" className="block text-xs font-medium text-gray-600 mb-1.5">
            Pedido del consumidor <span className="text-red-400">*</span>
          </label>
          <textarea
            id="pedido" name="pedido" required rows={3}
            placeholder="¿Qué solución esperas?"
            className="w-full px-4 py-2.5 text-sm text-[var(--brand-navy)] border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-yellow)] focus:ring-2 focus:ring-[var(--brand-yellow)]/15 transition-all bg-gray-50 placeholder:text-gray-300 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--brand-navy)] hover:bg-[#002d5a] active:scale-95 text-white font-semibold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <MessageCircle size={15} aria-hidden="true" />
          Enviar reclamo por WhatsApp
        </button>

        <p className="text-center text-[10px] text-gray-400">
          Recibirás respuesta en un plazo máximo de 30 días calendario.
        </p>

      </form>
    </div>
  );
}
