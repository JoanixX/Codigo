import { useEffect, useRef } from 'react';

// Hook para animar la aparición de un elemento al hacer scroll
export function useScrollReveal<T extends HTMLElement>(animationClass: string = 'section-fadein-futurist') {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(animationClass);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animationClass]);

  return ref;
}
