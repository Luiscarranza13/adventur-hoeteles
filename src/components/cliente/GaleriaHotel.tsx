'use client';

import { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ImagenSegura } from '@/components/ui/ImagenSegura';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GaleriaHotelProps {
  imagenes: string[];
  nombre: string;
}

export function GaleriaHotel({ imagenes, nombre }: GaleriaHotelProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [lightboxRef, lightboxApi] = useEmblaCarousel({ loop: true, startIndex: lightbox ?? 0 });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const lightboxPrev = useCallback(() => lightboxApi?.scrollPrev(), [lightboxApi]);
  const lightboxNext = useCallback(() => lightboxApi?.scrollNext(), [lightboxApi]);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex gap-2">
          {imagenes.map((url, i) => (
            <div
              key={i}
              className="relative flex-none w-72 h-48 rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setLightbox(i)}
            >
              <ImagenSegura
                src={url}
                alt={`${nombre} - foto ${i + 1}`}
                fill
                sizes="288px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {i + 1}/{imagenes.length}
              </div>
            </div>
          ))}
        </div>

        {imagenes.length > 3 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
            >
              <ChevronLeft size={16} className="text-[#001f3f]" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
            >
              <ChevronRight size={16} className="text-[#001f3f]" />
            </button>
          </>
        )}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all z-10"
          >
            <X size={24} />
          </button>

          <button
            onClick={e => { e.stopPropagation(); lightboxPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-10"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="w-full max-w-4xl overflow-hidden rounded-2xl"
            onClick={e => e.stopPropagation()}
            ref={lightboxRef}
          >
            <div className="flex">
              {imagenes.map((url, i) => (
                <div key={i} className="relative flex-none w-full aspect-video">
                  <ImagenSegura
                    src={url}
                    alt={`${nombre} - foto ${i + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority={i === lightbox}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={e => { e.stopPropagation(); lightboxNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-10"
          >
            <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {imagenes.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); lightboxApi?.scrollTo(i); setLightbox(i); }}
                className={`rounded-full transition-all ${i === lightbox ? 'w-6 h-2 bg-[#ffd600]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
