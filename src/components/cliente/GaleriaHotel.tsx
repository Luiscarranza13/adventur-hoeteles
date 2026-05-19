'use client';

import { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ImagenSegura } from '@/components/ui/ImagenSegura';
import { X, ChevronLeft, ChevronRight, Grid2X2 } from 'lucide-react';

interface GaleriaHotelProps {
  imagenes: string[];
  nombre: string;
}

export function GaleriaHotel({ imagenes, nombre }: GaleriaHotelProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [lightboxRef, lightboxApi] = useEmblaCarousel({ loop: true, startIndex: lightbox ?? 0 });
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const lightboxPrev = useCallback(() => {
    lightboxApi?.scrollPrev();
    setLightboxIndex(i => (i - 1 + imagenes.length) % imagenes.length);
  }, [lightboxApi, imagenes.length]);
  const lightboxNext = useCallback(() => {
    lightboxApi?.scrollNext();
    setLightboxIndex(i => (i + 1) % imagenes.length);
  }, [lightboxApi, imagenes.length]);

  const abrirLightbox = (i: number) => {
    setLightboxIndex(i);
    setLightbox(i);
  };

  // Grid estilo Airbnb: foto principal grande + hasta 4 miniaturas
  const mostrarGrid = imagenes.length >= 2;
  const usaGridCompuesto = imagenes.length >= 3;

  if (mostrarGrid) {
    return (
      <>
        {/* Grid Airbnb */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100">
          <div className={`grid gap-1.5 h-[240px] sm:h-[300px] lg:h-[340px] ${usaGridCompuesto ? 'grid-cols-2 grid-rows-2' : 'grid-cols-2'}`}>
            {/* Foto principal */}
            <div
              className={`relative min-h-0 overflow-hidden cursor-pointer group ${usaGridCompuesto ? 'row-span-2' : ''}`}
              onClick={() => abrirLightbox(0)}
            >
              <ImagenSegura
                src={imagenes[0]}
                alt={`${nombre} - foto principal`}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
            </div>

            {/* Miniaturas */}
            {imagenes.slice(1, 5).map((url, i) => (
              <div
                key={i}
                className="relative min-h-0 overflow-hidden cursor-pointer group"
                onClick={() => abrirLightbox(i + 1)}
              >
                <ImagenSegura
                  src={url}
                  alt={`${nombre} - foto ${i + 2}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                {/* Overlay "ver más" en la última miniatura */}
                {i === 3 && imagenes.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="text-2xl font-black">+{imagenes.length - 5}</p>
                      <p className="text-xs font-semibold opacity-80">más fotos</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botón "Ver todas las fotos" */}
          {imagenes.length > 1 && (
            <button
              onClick={() => abrirLightbox(0)}
              className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm hover:bg-white text-[#001f3f] text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 border border-white/50"
            >
              <Grid2X2 size={13} />
              Ver todas las fotos ({imagenes.length})
            </button>
          )}
        </div>

        {/* Lightbox */}
        {lightbox !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            {/* Cerrar */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2.5 rounded-full hover:bg-white/10 transition-all z-10"
            >
              <X size={22} />
            </button>

            {/* Contador */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-mono tabular-nums z-10">
              {lightboxIndex + 1} / {imagenes.length}
            </div>

            {/* Flecha izquierda */}
            <button
              onClick={e => { e.stopPropagation(); lightboxPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-10"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Imagen */}
            <div
              className="w-full max-w-5xl overflow-hidden rounded-2xl"
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
                      fit="contain"
                      className="bg-black"
                      priority={i === lightboxIndex}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Flecha derecha */}
            <button
              onClick={e => { e.stopPropagation(); lightboxNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-10"
            >
              <ChevronRight size={28} />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {imagenes.map((_, i) => (
                <button
                  key={i}
                  onClick={e => {
                    e.stopPropagation();
                    lightboxApi?.scrollTo(i);
                    setLightboxIndex(i);
                    setLightbox(i);
                  }}
                  className={`rounded-full transition-all ${
                    i === lightboxIndex
                      ? 'w-6 h-2 bg-[#ffd600]'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback: carrusel horizontal para 1 imagen
  return (
    <>
      <div className="relative overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex gap-2">
          {imagenes.map((url, i) => (
            <div
              key={i}
              className="relative flex-none w-72 h-48 rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => abrirLightbox(i)}
            >
              <ImagenSegura
                src={url}
                alt={`${nombre} - foto ${i + 1}`}
                fill
                sizes="288px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
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
          className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all z-10">
            <X size={24} />
          </button>
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl" onClick={e => e.stopPropagation()} ref={lightboxRef}>
            <div className="flex">
              {imagenes.map((url, i) => (
                <div key={i} className="relative flex-none w-full aspect-video">
                  <ImagenSegura src={url} alt={`${nombre} - foto ${i + 1}`} fill sizes="100vw" fit="contain" className="bg-black" priority={i === lightbox} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
