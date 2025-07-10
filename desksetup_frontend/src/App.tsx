import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductGallery from './components/ProductGallery';
import ProductCart from './components/ProductCart';
import ProductFavorites from './components/ProductFavorites';
import WalletSimulator from './components/WalletSimulator';
import ProductList from './components/ProductList';
import ReviewList from './components/ReviewList';
import './App.css';
import './components/animations/sectionReveal.css';
import './components/animations/cyberpunkEnhancements.css';
import './components/animations/cyberpunkOptimized.css';
import './components/animations/cyberpunkBetterAnimations.css';

import AuthPage from './components/AuthPage';
import AdminForms from './components/AdminForms';
import ReviewForm from './components/ReviewForm';
import ProfilePage from './components/ProfilePage';
import { authService } from './services/authService';

function App() {
  // Estado para navegación
  const [page, setPage] = useState<PageKey>('inicio');
  const [showSections, setShowSections] = useState(false);
  const [sectionsFadein, setSectionsFadein] = useState(false); // Nuevo estado para animar fadein
  const sectionsRef = useRef<HTMLDivElement>(null);

  // Función para manejar login exitoso
  const handleAuthSuccess = () => {
    setPage('inicio'); // Redirigir al inicio después del login
  };

  // Función para manejar logout
  const handleLogout = () => {
    authService.logout();
    setPage('inicio');
  };

  const PAGES = {
    inicio: 'Inicio',
    galeria: <ProductGallery />,
    carrito: <ProductCart />,
    favoritos: <ProductFavorites />,
    wallet: <WalletSimulator />,
    login: <AuthPage initialForm="login" onAuthSuccess={handleAuthSuccess} />,
    register: <AuthPage initialForm="register" onAuthSuccess={handleAuthSuccess} />,
    admin: <AdminForms />,
    review: <ReviewForm productoId="1" productoNombre="Producto Ejemplo" />,
    productos: <ProductList />,
    resenas: <ReviewList />,
    profile: <ProfilePage />,
  } as const;
  type PageKey = keyof typeof PAGES;

  // Navegación por hash
  React.useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageKey;
      console.log('DEBUG: Hash cambiado a:', hash);
      if (hash && hash in PAGES) {
        console.log('DEBUG: Página válida, cambiando a:', hash);
        setPage(hash);
      } else {
        console.log('DEBUG: Página inválida, redirigiendo a inicio');
        setPage('inicio');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Handler para mostrar secciones de la landing
  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      mainContainer.classList.add('fadeout');
      setTimeout(() => {
        setShowSections(true);
        setTimeout(() => setSectionsFadein(true), 30);
        console.log('DEBUG: showSections TRUE, secciones deben montarse');
        mainContainer.classList.remove('fadeout');
      }, 700);
    } else {
      setShowSections(true);
      setTimeout(() => setSectionsFadein(true), 30);
      console.log('DEBUG: showSections TRUE (sin mainContainer)');
    }
  };

  React.useEffect(() => {
    console.log('DEBUG: showSections', showSections, 'sectionsFadein', sectionsFadein);
  }, [showSections, sectionsFadein]);

  React.useEffect(() => {
    if (!showSections) return;
    // Animación reveal para secciones
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    document.querySelectorAll('.section-animate').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [showSections]);

  return (
    <>
      <Navbar 
        onLogout={handleLogout} 
      />
      <div className="particle-bg">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="particle" key={i} />
        ))}
      </div>
      <main className="main">
        {page === 'inicio' ? (
          <>
            {/* Hero principal de la landing */}
            {!showSections && (
              <div className={`main-container section-animate visible`}>
                <div className="content-left fadein-text">
                  <h1 className="title fadein-title">
                    <span className="highlight">Desk</span> Setup <span className="highlight-green">Pro</span>
                  </h1>
                  <p className="description fadein-text">
                    Compra, vende y descubre los mejores componentes gamer en una plataforma pensada por y para gamers.
                  </p>
                  <a
                    href="#secciones"
                    className="btn btn-primary fadein-text"
                    onClick={handleStart}
                  >
                    Comenzar
                  </a>
                </div>
                <div className="content-right fadein-img">
                  <div className="image-collage">
                    <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" alt="Teclado mecánico RGB" className="fadein-img" style={{width: '180px', height: '120px'}} />
                    <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Mouse gamer inalámbrico" className="fadein-img" style={{width: '180px', height: '120px'}} />
                    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Alfombrilla XL" className="fadein-img" style={{width: '180px', height: '120px'}} />
                    <img src="https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80" alt="Monitor 240Hz" className="fadein-img" style={{width: '180px', height: '120px'}} />
                  </div>
                </div>
              </div>
            )}
            {/* Secciones de la landing */}
            {showSections && (
              <div
                ref={sectionsRef}
                id="secciones"
                className={`sections-fadein${sectionsFadein ? ' visible' : ''}`}
                style={{ zIndex: 3, position: 'relative' }}
              >
                {/* SOBRE NOSOTROS */}
                <section className="section-edge section-animate" style={{position: 'relative', zIndex: 2}}>
                  <div className="section-edge-col fadein-text" style={{background: 'none', boxShadow: 'none', padding: 0}}>
                    <h2 className="section-edge-title fadein-title">Sobre <span style={{color: '#8AFF00'}}>DeskSetup Pro</span></h2>
                    <div className="section-edge-text fadein-text">
                      DeskSetup Pro es una solución de e-commerce especializada en productos gamer y accesorios para setups de alto rendimiento.<br /><br />
                      Nuestro objetivo es impulsar el crecimiento sostenible de tiendas y entusiastas, facilitando la compra y venta de componentes gamer de manera intuitiva y eficaz.<br /><br />
                      Sabemos que las empresas emergentes enfrentan desafíos de escalabilidad y calidad de servicio. Por eso, DeskSetup Pro está diseñada para ayudar a superar estos retos, comparando y aprendiendo de los principales competidores del sector.<br /><br />
                      <span style={{color: '#8AFF00', fontWeight: 700}}>Únete a la comunidad DeskSetup Pro y lleva tu experiencia gamer al siguiente nivel.</span>
                    </div>
                  </div>
                  <div className="section-edge-col fadein-img futuristic-img-optimized" style={{background: '#181a2a', borderRadius: 16, boxShadow: '0 2px 16px #23244a33', padding: 24, zIndex: 3, position: 'relative'}}>
                    <img
                      src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80"
                      alt="Equipo DeskSetup Pro"
                      className="section-edge-img fadein-img"
                    />
                  </div>
                </section>
                {/* ¿QUÉ ES DESKSETUP PRO? */}
                <section className="section-edge section-animate reverse" style={{position: 'relative', zIndex: 2}}>
                  <div className="section-edge-col right fadein-img" style={{background: '#181a2a', borderRadius: 16, boxShadow: '0 2px 16px #23244a33', padding: 24, zIndex: 3, position: 'relative'}}>
                    <img
                      src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80"
                      alt="Catálogo gamer"
                      className="section-edge-img fadein-img"
                    />
                  </div>
                  <div className="section-edge-col right fadein-text" style={{background: 'none', boxShadow: 'none', padding: 0}}>
                    <h2 className="section-edge-title right fadein-title">¿Qué es <span style={{color: '#6C63FF'}}>DeskSetup Pro</span>?</h2>
                    <div className="section-edge-text fadein-text">
                      DeskSetup Pro es una plataforma de e-commerce gamer donde puedes:<br /><br />
                      <span style={{color: '#6C63FF'}}>•</span> Comprar y vender productos y accesorios gamer de alta calidad.<br />
                      <span style={{color: '#6C63FF'}}>•</span> Descubrir las últimas tendencias y comparar con los mejores competidores.<br />
                      <span style={{color: '#6C63FF'}}>•</span> Disfrutar de una experiencia segura, transparente y pensada para gamers.<br /><br />
                      Nuestra tecnología está orientada a la escalabilidad y facilidad de uso, ayudando a las empresas emergentes a crecer sin perder calidad de servicio.
                    </div>
                    <div style={{marginTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'flex-end'}}>
                      <div><span>⚡</span> Escalabilidad y rendimiento óptimo</div>
                      <div><span>🕹️</span> Catálogo gamer exclusivo</div>
                      <div><span>🔒</span> Soporte y seguridad para tu tienda</div>
                    </div>
                  </div>
                </section>
                {/* CONTACTO */}
                <section className="section-edge section-animate" style={{position: 'relative', zIndex: 2}}>
                  <div className="section-edge-col fadein-text" style={{background: 'none', boxShadow: 'none', padding: 0}}>
                    <h2 className="section-edge-title fadein-title" style={{color: '#fff'}}>Contacto</h2>
                    <div className="section-edge-text fadein-text">
                      ¿Tienes dudas, sugerencias o quieres colaborar con DeskSetup Pro?<br /><br />
                      Completa el formulario y nuestro equipo te responderá lo antes posible. ¡Estamos para ayudarte!
                      <form style={{
  width: '100%',
  maxWidth: 480,
  marginTop: 32,
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  background: '#181a2a',
  borderRadius: 16,
  boxShadow: '0 2px 16px #23244a33',
  padding: 32,
  border: '1.5px solid #23244a',
}}>
  <input type="text" placeholder="Nombre" required style={{
    padding: 14,
    marginBottom: 8,
    borderRadius: 8,
    border: '1.5px solid #23244a',
    background: '#23244a',
    color: '#e0e0e0',
    fontSize: '1rem',
    outline: 'none',
  }} />
  <input type="email" placeholder="Correo electrónico" required style={{
    padding: 14,
    marginBottom: 8,
    borderRadius: 8,
    border: '1.5px solid #23244a',
    background: '#23244a',
    color: '#e0e0e0',
    fontSize: '1rem',
    outline: 'none',
  }} />
  <textarea placeholder="Mensaje" required style={{
    padding: 14,
    minHeight: 100,
    marginBottom: 8,
    borderRadius: 8,
    border: '1.5px solid #23244a',
    background: '#23244a',
    color: '#e0e0e0',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
  }} />
  <button type="submit" style={{
    padding: 16,
    fontWeight: 700,
    background: '#6C63FF',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: 8,
    boxShadow: '0 1.5px 0 #23244a',
    transition: 'background 0.2s',
  }}>Enviar</button>
</form>
                      <div style={{marginTop: 24, display: 'flex', gap: 18}}>
                        <a href="https://www.linkedin.com/in/chambea-ya-318819360" target="_blank" rel="noopener noreferrer" style={{
    background: '#23244a',
    color: '#8AFF00',
    padding: '10px 22px',
    borderRadius: 8,
    fontWeight: 700,
    textDecoration: 'none',
    border: '1.5px solid #23244a',
    transition: 'background 0.2s, color 0.2s',
    fontSize: '1rem',
    boxShadow: '0 1.5px 0 #23244a',
    display: 'inline-block',
  }}>LinkedIn</a>
  <a href="https://www.instagram.com/chambeaya.oficial/" target="_blank" rel="noopener noreferrer" style={{
    background: '#23244a',
    color: '#6C63FF',
    padding: '10px 22px',
    borderRadius: 8,
    fontWeight: 700,
    textDecoration: 'none',
    border: '1.5px solid #23244a',
    transition: 'background 0.2s, color 0.2s',
    fontSize: '1rem',
    boxShadow: '0 1.5px 0 #23244a',
    display: 'inline-block',
  }}>Discord</a>
  <a href="https://www.instagram.com/joaq__05/" target="_blank" rel="noopener noreferrer" style={{
    background: '#23244a',
    color: '#fff',
    padding: '10px 22px',
    borderRadius: 8,
    fontWeight: 700,
    textDecoration: 'none',
    border: '1.5px solid #23244a',
    transition: 'background 0.2s, color 0.2s',
    fontSize: '1rem',
    boxShadow: '0 1.5px 0 #23244a',
    display: 'inline-block',
  }}>Instagram</a>
</div>
                    </div>
                  </div>
                  <div className="section-edge-col fadein-img" style={{background: '#181a2a', borderRadius: 16, boxShadow: '0 2px 16px #23244a33', padding: 24, zIndex: 3, position: 'relative'}}>
                    <img
                      src="https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=1200&q=80"
                      alt="Contacto DeskSetup Pro"
                      className="section-edge-img fadein-img"
                    />
                  </div>
                </section>
              </div>
            )}
          </>
        ) : (
          <div style={{ width: '100%' }}>
            {(() => { console.log('DEBUG: Renderizando página:', page); return null; })()}
            {PAGES[page]}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
