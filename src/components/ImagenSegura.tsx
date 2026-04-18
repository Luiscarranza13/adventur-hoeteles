'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImagenSeguraProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  placeholder?: string;
}

/**
 * Wrapper de next/image que maneja URLs inválidas o rotas.
 * Si la imagen falla al cargar, muestra un placeholder.
 */
export function ImagenSegura({ src, alt, fill = false, className, placeholder = 'Sin imagen' }: ImagenSeguraProps) {
  const [error, setError] = useState(false);

  // Validar que la URL tenga un hostname real (no solo https://img1.jpg)
  const esUrlValida = (() => {
    try {
      const url = new URL(src);
      // El hostname debe tener al menos un punto y una extensión válida
      return url.hostname.includes('.') && url.hostname.split('.').every(p => p.length > 0);
    } catch {
      return false;
    }
  })();

  if (!esUrlValida || error) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-400 text-sm">
        {placeholder}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setError(true)}
    />
  );
}
