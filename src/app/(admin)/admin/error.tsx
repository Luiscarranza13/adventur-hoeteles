'use client';

export default function ErrorAdmin({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary mb-4">Algo salió mal</h2>
        <p className="text-gray-500 mb-6">Ocurrió un error al cargar esta sección.</p>
        <button
          onClick={reset}
          className="bg-primary text-secondary font-semibold px-6 py-3 rounded-lg hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
