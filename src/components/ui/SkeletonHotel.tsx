export function SkeletonHotel() {
  return (
    <div className="card-premium h-full flex flex-col animate-pulse">
      {/* imagen */}
      <div className="h-56 bg-gray-200 rounded-t-2xl shrink-0" />
      <div className="p-6 flex flex-col flex-1 gap-3">
        {/* estrellas */}
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-gray-200" />
          ))}
        </div>
        {/* nombre */}
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        {/* ciudad */}
        <div className="h-3 bg-gray-100 rounded-full w-2/5 mt-1" />
        {/* botón */}
        <div className="mt-auto h-9 bg-gray-200 rounded-full w-full" />
      </div>
    </div>
  );
}

export function SkeletonHotelesGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {[...Array(count)].map((_, i) => (
        <SkeletonHotel key={i} />
      ))}
    </div>
  );
}
