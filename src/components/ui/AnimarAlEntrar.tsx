'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export function AnimarAlEntrar({ children, className, delay = 0, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set(element, { autoAlpha: 1, x: 0, y: 0, clearProps: 'transform' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          y: direction === 'up' ? 36 : 0,
          x: direction === 'left' ? -36 : direction === 'right' ? 36 : 0,
          filter: 'blur(10px)',
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          delay,
          ease: 'power3.out',
          clearProps: 'filter,transform,opacity,visibility',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        },
      );
    }, element);

    return () => ctx.revert();
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
