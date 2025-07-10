import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import styles from './AuthPage.module.css';

interface ProfileData {
  usuario: string;
  correo_electronico: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
}

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    usuario: '',
    correo_electronico: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setProfileData({
        usuario: currentUser.usuario || '',
        correo_electronico: currentUser.correo_electronico || '',
        nombre: currentUser.nombre || '',
        apellido: currentUser.apellido || '',
        telefono: currentUser.telefono || '',
        direccion: currentUser.direccion || ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const currentUser = authService.getUser();
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`http://localhost:3000/api/clientes/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar perfil');
      }

      const updatedUser = await response.json();
      
      // Actualizar localStorage con los nuevos datos
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('storage'));

      setSuccess('Perfil actualizado exitosamente');
    } catch (error: any) {
      setError(error.message || 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2>Mi Perfil</h2>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            color: '#8AFF00', 
            background: 'rgba(138, 255, 0, 0.1)', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            {success}
          </div>
        )}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="usuario">Nombre de usuario</label>
            <input 
              type="text" 
              id="usuario" 
              name="usuario" 
              value={profileData.usuario}
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
              value={profileData.correo_electronico}
              onChange={handleInputChange}
              required 
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nombre">Nombre</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              value={profileData.nombre}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="apellido">Apellido</label>
            <input 
              type="text" 
              id="apellido" 
              name="apellido" 
              value={profileData.apellido}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telefono">Teléfono</label>
            <input 
              type="tel" 
              id="telefono" 
              name="telefono" 
              value={profileData.telefono}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="direccion">Dirección</label>
            <input 
              type="text" 
              id="direccion" 
              name="direccion" 
              value={profileData.direccion}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 