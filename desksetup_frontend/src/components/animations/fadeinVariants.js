// Aplica la clase 'visible' a los elementos con fadein-img, fadein-text y fadein-title al hacer scroll
export function applyFadeinVariants() {
  const selectors = ['.fadein-img', '.fadein-text', '.fadein-title'];
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('js-anim');
      el.classList.remove('visible');
    });
    const elements = document.querySelectorAll(selector);
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01 });
    elements.forEach(el => {
      // Si ya está en pantalla al cargar, mostrarlo
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });
  });
}
