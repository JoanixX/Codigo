// Cyberpunk Reveal Animations
// Aplica animaciones de entrada y efectos glow a las secciones con la clase 'section-animate'.
// Inspirado en efectos de páginas como Rockstar Games.

export function cyberpunkRevealInit() {
  const revealElements = document.querySelectorAll('.section-animate');
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.99;
    revealElements.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;
      const boxBottom = el.getBoundingClientRect().bottom;
      if ((boxTop < window.innerHeight && boxBottom > 0) || boxTop < triggerBottom) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('resize', revealOnScroll);
  revealOnScroll();
}

// Para usar: importa y ejecuta cyberpunkRevealInit() en tu main.js/tsx después de renderizar el DOM.
