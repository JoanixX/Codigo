import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App'
import './components/animations/futuristicAnimations.css';
import { cyberpunkRevealInit } from './components/animations/cyberpunkReveal.js';
import { applyFuturisticStagger } from './components/animations/futuristicStagger.js';
import './components/animations/fadeinVariants.css';
import { applyFadeinVariants } from './components/animations/fadeinVariants.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Inicializa animaciones cyberpunk después de renderizar
cyberpunkRevealInit();
applyFadeinVariants();
setTimeout(() => applyFuturisticStagger(), 400);