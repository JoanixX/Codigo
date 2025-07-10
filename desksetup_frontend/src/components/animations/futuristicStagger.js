export function applyFuturisticStagger(selector = '.futuristic-stagger', delay = 120) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * delay);
  });
}
