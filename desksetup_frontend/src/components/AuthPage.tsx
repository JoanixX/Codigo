import React, { useState, useEffect } from 'react';
import styles from './AuthPage.module.css';
import { authService } from '../services/authService';

interface AuthPageProps {
  initialForm?: 'login' | 'register';
  onAuthSuccess?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialForm = 'login', onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(initialForm === 'login');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    usuario: '',
    correo_electronico: '',
    contraseña: '',
    confirmPassword: '',
    rol: 'cliente' as 'cliente' | 'administrador'
  });

  // Escuchar cambios en la URL para actualizar el formulario
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'login') {
        setIsLogin(true);
        setError('');
      } else if (hash === 'register') {
        setIsLogin(false);
        setError('');
      }
    };

    // Verificar el hash actual al montar el componente
    handleHashChange();

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      usuario: '',
      correo_electronico: '',
      contraseña: '',
      confirmPassword: '',
      rol: 'cliente' as 'cliente' | 'administrador'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (isLogin) {
      if (!formData.usuario && !formData.correo_electronico) {
        setError('Por favor ingresa tu nombre de usuario o correo electrónico');
        return false;
      }
      if (!formData.contraseña) {
        setError('Por favor ingresa tu contraseña');
        return false;
      }
    } else {
      // Validaciones para registro
      if (!formData.usuario || !formData.correo_electronico || !formData.contraseña) {
        setError('Por favor completa todos los campos');
        return false;
      }
      
      if (formData.contraseña.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return false;
      }
      
      if (formData.contraseña !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
      }
      
      if (!formData.correo_electronico.includes('@')) {
        setError('El correo electrónico debe ser válido');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const response = await authService.login({
          usuario: formData.usuario,
          contraseña: formData.contraseña
        });
        
        if (response.success && response.cliente) {
          if (onAuthSuccess) onAuthSuccess();
        }
      } else {
        // Verificar si el usuario ya existe antes de registrar
        const { usuarioExists, emailExists } = await authService.checkUserExists(
          formData.usuario, 
          formData.correo_electronico
        );
        
        if (usuarioExists) {
          setError('El nombre de usuario ya existe');
          setIsLoading(false);
          return;
        }
        
        if (emailExists) {
          setError('El correo electrónico ya está registrado');
          setIsLoading(false);
          return;
        }
        
        const response = await authService.register({
          usuario: formData.usuario,
          correo_electronico: formData.correo_electronico,
          contraseña: formData.contraseña,
          rol: formData.rol
        });
        
        if (response.success && response.cliente) {
          if (onAuthSuccess) onAuthSuccess();
        }
      }
    } catch (error: any) {
      console.error('Error en autenticación:', error);
      setError(error.message || 'Error en la autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="usuario">Nombre de usuario</label>
                <input 
                  type="text" 
                  id="usuario" 
                  name="usuario" 
                  value={formData.usuario}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="correo_electronico">Correo electrónico</label>
                <input 
                  type="email" 
                  id="correo_electronico" 
                  name="correo_electronico" 
                  value={formData.correo_electronico}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="rol">Tipo de Usuario</label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={(e) => setFormData(prev => ({ ...prev, rol: e.target.value as 'cliente' | 'administrador' }))}
                  required
                  disabled={isLoading}
                >
                  <option value="cliente">Cliente</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            </>
          )}
          
          {isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="usuario">Nombre de usuario o correo electrónico</label>
              <input 
                type="text" 
                id="usuario" 
                name="usuario" 
                value={formData.usuario}
                onChange={handleInputChange}
                placeholder="Usuario o correo electrónico"
                required 
                disabled={isLoading}
              />
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label htmlFor="contraseña">Contraseña</label>
            <input 
              type="password" 
              id="contraseña" 
              name="contraseña" 
              value={formData.contraseña}
              onChange={handleInputChange}
              required 
              disabled={isLoading}
            />
          </div>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required 
                disabled={isLoading}
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>
        
        <div className={styles.toggleForm}>
          <p>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
              type="button" 
              onClick={toggleForm}
              className={styles.toggleButton}
              disabled={isLoading}
            >
              {isLogin ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;