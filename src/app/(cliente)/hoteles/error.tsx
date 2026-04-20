'use client';

export default function ErrorHoteles({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center py-16 px-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary mb-4">No pudimos cargar los hoteles</h2>
        <p className="text-gray-500 mb-6">Ocurrió un error inesperado. Intenta de nuevo.</p>
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
