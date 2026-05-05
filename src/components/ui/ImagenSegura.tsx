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
}

function esUrlValida(src: string): boolean {
  if (!src || src.trim() === '') return false;
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
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#001f3f] to-[#002d5a]">
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
}: ImagenSeguraProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!esUrlValida(src) || error) {
    return <Placeholder alt={alt} />;
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] to-[#002d5a] animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`object-cover ${className}`}
        sizes={sizes}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
}
