import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { authService } from '../services/authService';

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const user = authService.getUser();
    setCurrentUser(user);

    const handleStorageChange = () => {
      const updatedUser = authService.getUser();
      setCurrentUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      authService.logout();
      setCurrentUser(null);
      if (onLogout) {
        onLogout();
      }
      window.location.hash = '#login';
    }
  };

  const handleMenuClick = (hash: string) => {
    window.location.hash = hash;
    setShowUserMenu(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navLogo}>
          <a href="#inicio" className={styles.logo}>
            DeskSetup Store
          </a>
        </div>

        <div className={styles.navLinks}>
          <a href="#inicio" className={styles['nav-link']}>Inicio</a>
          <a href="#productos" className={styles['nav-link']}>Productos</a>
          <a href="#resenas" className={styles['nav-link']}>Reseñas</a>
          
          {currentUser ? (
            <>
              {currentUser.rol === 'administrador' && (
                <a href="#admin" className={styles['nav-link']}>Admin</a>
              )}
              {currentUser.rol !== 'administrador' && (
                <a href="#carrito" className={styles['nav-link']}>Carrito</a>
              )}
              <div className={styles.userMenu}>
                <button 
                  className={styles.userButton}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {currentUser?.usuario || 'Usuario'}
                  <span className={styles.dropdownArrow}>▼</span>
                </button>
                
                {showUserMenu && (
                  <div className={styles.dropdownMenu}>
                    {currentUser?.rol === 'administrador' && (
                      <button 
                        onClick={() => handleMenuClick('#admin')} 
                        className={styles.dropdownItem}
                      >
                        <span className={styles.menuIcon}>⚙️</span>
                        Panel de Administración
                      </button>
                    )}
                    <button 
                      onClick={() => handleMenuClick('#wallet')} 
                      className={styles.dropdownItem}
                    >
                      <span className={styles.menuIcon}>💰</span>
                      Wallet
                    </button>
                    <button 
                      onClick={() => handleMenuClick('#profile')} 
                      className={styles.dropdownItem}
                    >
                      <span className={styles.menuIcon}>👤</span>
                      Mi Perfil
                    </button>
                    <button onClick={handleLogout} className={styles.dropdownItem}>
                      <span className={styles.menuIcon}>🚪</span>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <a href="#login" className={styles['nav-link']}>Iniciar Sesión</a>
              <a href="#register" className={styles['nav-link']}>Registrarse</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;