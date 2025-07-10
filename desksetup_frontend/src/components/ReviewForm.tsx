import React, { useState } from 'react';
import styles from './AuthPage.module.css';
import { reviewService } from '../services/reviewService';
import type { ReviewFormData } from '../services/reviewService';

interface ReviewFormProps {
  productoId: string;
  productoNombre: string;
  onReviewAdded?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productoId, productoNombre, onReviewAdded }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    producto_id: productoId,
    comentario: '',
    puntuacion: 5
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'puntuacion' ? parseInt(value) || 5 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await reviewService.createReview(formData);
      setSuccess('Reseña agregada exitosamente');
      setFormData({
        producto_id: productoId,
        comentario: '',
        puntuacion: 5
      });
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar reseña');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2>Agregar Reseña</h2>
        <p style={{ marginBottom: '20px', color: '#888' }}>
          Producto: <strong>{productoNombre}</strong>
        </p>

        {error && (
          <div style={{ 
            color: '#ff4a4a', 
            background: 'rgba(255, 74, 74, 0.1)', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
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
            <label htmlFor="puntuacion">Puntuación (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              id="puntuacion"
              name="puntuacion"
              value={formData.puntuacion}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="comentario">Comentario</label>
            <textarea
              id="comentario"
              name="comentario"
              value={formData.comentario}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Comparte tu experiencia con este producto..."
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
          >
            Agregar Reseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm; 