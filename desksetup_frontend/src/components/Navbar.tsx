import React from 'react';
import styles from './Navbar.module.css';
import { authService } from '../services/authService';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout?: () => void;
  userRole?: 'cliente' | 'administrador';
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout, userRole }) => {
  const currentUser = authService.getUser();
  const userRoleFromService = currentUser?.rol || userRole;
  const isAdmin = userRoleFromService === 'administrador';

  return (
    <header className={styles.header}>
      <div className={`container ${styles['header-container']}`}>
        <a href="#" className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6C63FF" />
              <stop offset="100%" stopColor="#3B2FFF" />
            </linearGradient>
            <path fill="url(#grad)" d="M12 2L22 7L12 12L2 7L12 2Z" />
            <path fill="url(#grad)" d="M12 12L22 17L12 22L2 17L12 12Z" />
          </svg>
          <span className={styles['logo-text']}>DS Pro</span>
        </a>
        <nav className={styles.nav}>
          {isLoggedIn ? (
            <>
              <a href="#productos" className={styles['nav-link']}>Productos</a>
              <a href="#carrito" className={styles['nav-link']}>Carrito</a>
              {!isAdmin && (
                <>
                  <a href="#favoritos" className={styles['nav-link']}>Favoritos</a>
                  <a href="#resenas" className={styles['nav-link']}>Reseñas</a>
                </>
              )}
              <a href="#wallet" className={styles['nav-link']}>Wallet</a>
              {onLogout && (
                <button 
                  onClick={onLogout} 
                  className={styles['nav-link']}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'inherit',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'color 0.3s',
                    padding: '4px 12px',
                    borderRadius: '8px'
                  }}
                >
                  Cerrar Sesión
                </button>
              )}
            </>
          ) : (
            <>
              <a href="#login" className={styles['nav-link']}>Iniciar Sesión</a>
              <a href="#register" className={styles['nav-link']}>Registrarse</a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;