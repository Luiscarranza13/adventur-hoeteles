export default function CargandoHoteles() {
  return (
    <div className="bg-[var(--bg-subtle)] min-h-screen">
      {/* Hero skeleton */}
      <div className="bg-[#001f3f] pt-20 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-3 w-24 bg-white/10 rounded-full mb-3 animate-pulse" />
          <div className="h-8 w-64 bg-white/15 rounded-xl mb-2 animate-pulse" />
          <div className="h-4 w-40 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            {[80, 60, 70, 50, 65].map((w, i) => (
              <div key={i} className="px-4 py-3 border-b border-gray-50 last:border-0">
                <div className="h-3 bg-gray-100 rounded-full animate-pulse" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </aside>

        {/* Grid skeleton */}
        <div className="flex-1 min-w-0">
          <div className="h-4 w-32 bg-gray-200 rounded-full mb-5 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-24 bg-gray-100 rounded-full" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
                  <div className="h-8 bg-gray-100 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
