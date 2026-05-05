'use client';

import { useState, useEffect } from 'react';

const IMAGENES = ['/imagen1.jpg', '/imagen2.jpg', '/imagen3.avif'];

export function HeroFondoAnimado() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndice(i => (i + 1) % IMAGENES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      {IMAGENES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === indice ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: i === indice ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" style={{ zIndex: 2 }} />
    </div>
  );
}
