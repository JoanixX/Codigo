import React, { useState, useEffect } from 'react';
import { reviewService, type ReviewResponse, type ResponseFormData } from '../services/reviewService';
import styles from './ReviewResponses.module.css';

interface ReviewResponsesProps {
  reviewId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewResponses: React.FC<ReviewResponsesProps> = ({ reviewId, isOpen, onClose }) => {
  const [responses, setResponses] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && reviewId) {
      loadResponses();
    }
  }, [isOpen, reviewId]);

  const loadResponses = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await reviewService.getReviewResponses(reviewId);
      setResponses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar respuestas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponse.trim()) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      const responseData: ResponseFormData = {
        review_id: reviewId,
        comentario: newResponse.trim()
      };
      
      const newResponseData = await reviewService.addResponse(responseData);
      setResponses(prev => [newResponseData, ...prev]);
      setNewResponse('');
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar respuesta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Respuestas</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando respuestas...</p>
            </div>
          ) : responses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>💬</div>
              <h4>No hay respuestas aún</h4>
              <p>¡Sé el primero en responder a esta reseña!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className={styles.addFirstButton}
              >
                Agregar Primera Respuesta
              </button>
            </div>
          ) : (
            <div className={styles.responsesList}>
              {responses.map((response) => (
                <div key={response._id} className={styles.responseItem}>
                  <div className={styles.responseHeader}>
                    <div className={styles.responseInfo}>
                      <span className={styles.responseAuthor}>
                        Usuario #{response.cliente_id.slice(-6)}
                      </span>
                      <span className={styles.responseDate}>
                        {formatDate(response.fecha_respuesta)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.responseContent}>
                    {response.comentario}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showAddForm && responses.length > 0 && (
            <button
              onClick={() => setShowAddForm(true)}
              className={styles.addResponseButton}
            >
              Agregar Respuesta
            </button>
          )}

          {showAddForm && (
            <form onSubmit={handleAddResponse} className={styles.addForm}>
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className={styles.responseTextarea}
                rows={3}
                required
              />
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewResponse('');
                  }}
                  className={styles.cancelButton}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting || !newResponse.trim()}
                >
                  {isSubmitting ? 'Publicando...' : 'Publicar Respuesta'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewResponses; 