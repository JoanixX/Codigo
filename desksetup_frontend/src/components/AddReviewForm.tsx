import React, { useState, useEffect } from 'react';
import { reviewService, type ReviewFormData } from '../services/reviewService';
import { productService, type Product } from '../services/productService';
import styles from './AddReviewForm.module.css';

interface AddReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded: () => void;
  productId?: string;
  productName?: string;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ 
  isOpen, 
  onClose, 
  onReviewAdded, 
  productId, 
  productName 
}) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    producto_id: productId || '',
    comentario: '',
    puntuacion: 5
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (productId) {
      setFormData(prev => ({
        ...prev,
        producto_id: productId
      }));
    }
  }, [productId]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar productos');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'puntuacion' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await reviewService.createReview(formData);
      onReviewAdded();
      onClose();
      setFormData({
        producto_id: '',
        comentario: '',
        puntuacion: 5
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear reseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Agregar Reseña</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {productName && (
            <div className={styles.formGroup}>
              <label>Producto seleccionado:</label>
              <div className={styles.selectedProduct}>
                {productName}
              </div>
            </div>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="producto_id">Seleccionar Producto</label>
            <select
              id="producto_id"
              name="producto_id"
              value={formData.producto_id}
              onChange={handleInputChange}
              required
              className={styles.select}
              disabled={loadingProducts}
            >
              <option value="">Selecciona un producto...</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.nombre} - ${product.precio_unitario}
                </option>
              ))}
            </select>
            {loadingProducts && (
              <div className={styles.loadingText}>Cargando productos...</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="puntuacion">Puntuación</label>
            <div className={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.star} ${formData.puntuacion >= star ? styles.active : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, puntuacion: star }))}
                >
                  ★
                </button>
              ))}
              <span className={styles.ratingText}>
                {formData.puntuacion}/5
              </span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="comentario">Tu reseña</label>
            <textarea
              id="comentario"
              name="comentario"
              value={formData.comentario}
              onChange={handleInputChange}
              placeholder="Comparte tu experiencia con este producto..."
              required
              rows={4}
              className={styles.textarea}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Publicando...' : 'Publicar Reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewForm; 