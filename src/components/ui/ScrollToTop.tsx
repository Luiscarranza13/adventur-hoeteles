'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-6 z-[100] w-10 h-10 bg-white border border-gray-200 text-[#001f3f] rounded-full shadow-lg hover:bg-[#001f3f] hover:text-white hover:border-[#001f3f] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
      aria-label="Volver arriba"
    >
      <ChevronUp size={18} />
    </button>
  );
}
