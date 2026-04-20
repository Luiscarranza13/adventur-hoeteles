export default function CargandoAdmin() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6">
            <div className="h-4 bg-gray-200 rounded mb-4" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
