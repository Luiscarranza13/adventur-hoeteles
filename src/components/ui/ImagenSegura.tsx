'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImagenSeguraProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  contieneLogoOPequena?: boolean;
  fit?: 'cover' | 'contain';
  objectPosition?: string;
}

function esUrlValida(src: string): boolean {
  if (!src || src.trim() === '') return false;
  if (src.startsWith('/')) return true;
  try {
    const url = new URL(src);
    const partes = url.hostname.split('.');
    return partes.length >= 2 && partes.every(p => p.length > 0);
  } catch {
    return false;
  }
}

function Placeholder({ alt }: { alt: string }) {
  const iniciales = alt
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-[#001f3f] to-[#002d5a]">
      <div className="w-14 h-14 rounded-2xl bg-[#ffd600]/15 border border-[#ffd600]/25 flex items-center justify-center mb-2">
        <span className="text-[#ffd600] text-xl font-black select-none">
          {iniciales || 'H'}
        </span>
      </div>
      <span className="text-white/30 text-xs font-semibold text-center px-4 line-clamp-1 max-w-full">
        {alt}
      </span>
    </div>
  );
}

export function ImagenSegura({
  src,
  alt,
  fill = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  contieneLogoOPequena = false,
  fit = 'cover',
  objectPosition = 'center center',
}: ImagenSeguraProps) {
  const [estado, setEstado] = useState({ src, error: false, loaded: false });
  const cambioSrc = estado.src !== src;
  const error = cambioSrc ? false : estado.error;
  const loaded = cambioSrc ? false : estado.loaded;
  const esExterna = /^https?:\/\//.test(src);
  const objectFit = contieneLogoOPequena ? 'contain' : fit;
  const imageStyle = { objectFit, objectPosition };

  if (!esUrlValida(src) || error) {
    return <Placeholder alt={alt} />;
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-linear-to-br from-[#001f3f] to-[#002d5a] animate-pulse" />
      )}
      {esExterna ? (
        <div className={fill ? 'absolute inset-0' : 'relative w-full h-full'}>
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-${objectFit} ${className}`}
            style={{ objectPosition }}
            sizes={sizes}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            unoptimized={esExterna}
            onLoad={() => setEstado({ src, error: false, loaded: true })}
            onError={() => setEstado({ src, error: true, loaded: false })}
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          className={className}
          style={imageStyle}
          sizes={sizes}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          unoptimized={esExterna}
          onLoad={() => setEstado({ src, error: false, loaded: true })}
          onError={() => setEstado({ src, error: true, loaded: false })}
        />
      )}
    </>
  );
}
