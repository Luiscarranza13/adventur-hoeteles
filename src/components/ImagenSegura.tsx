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
}

function esUrlValida(src: string): boolean {
  try {
    const url = new URL(src);
    const partes = url.hostname.split('.');
    return partes.length >= 2 && partes.every(p => p.length > 0);
  } catch {
    return false;
  }
}

function Placeholder() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] via-[#002d5a] to-[#001428] flex items-center justify-center">
      <span className="text-[#ffd600]/20 text-8xl font-black select-none tracking-tighter">A</span>
    </div>
  );
}

export function ImagenSegura({
  src,
  alt,
  fill = false,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
}: ImagenSeguraProps) {
  const [error, setError] = useState(false);

  if (!esUrlValida(src) || error) {
    return <Placeholder />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setError(true)}
    />
  );
}
