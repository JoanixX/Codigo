// Hook para animar la aparición de secciones con clases CSS inspiradas en designer.incube.agency
// Usa IntersectionObserver para añadir la clase 'visible' cuando la sección entra en viewport
// Uso: const ref = useSectionReveal(); <section ref={ref} className="section-animate">...</section>
import { useEffect, useRef } from 'react';

export function useSectionReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
