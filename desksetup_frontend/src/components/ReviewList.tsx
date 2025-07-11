import React, { useState, useEffect } from 'react';
import { reviewService, type ReviewWithDetails } from '../services/reviewService';
import AddReviewForm from './AddReviewForm';
import ReviewResponses from './ReviewResponses';
import Notification from './Notification';
import styles from './ReviewList.module.css';

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [showResponses, setShowResponses] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await reviewService.getReviewsWithDetails();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reseñas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      const result = await reviewService.likeReview(reviewId);
      if (result.success) {
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { ...review, likes: result.likes }
            : review
        ));
        
        showNotification('¡Te gusta esta reseña!', 'success');
      }
    } catch (err) {
      showNotification('Error al dar like', 'error');
    }
  };

  const handleShare = async (reviewId: string) => {
    try {
      const result = await reviewService.shareReview(reviewId);
      if (result.success) {
        showNotification(result.message, 'success');
      }
    } catch (err) {
      showNotification('Error al compartir', 'error');
    }
  };

  const handleAddReview = () => {
    setShowAddForm(true);
  };

  const handleReviewAdded = () => {
    loadReviews();
    showNotification('Reseña agregada exitosamente', 'success');
  };

  const handleShowResponses = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setShowResponses(true);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`${styles.star} ${i < rating ? styles.filled : ''}`}
      >
        ★
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando reseñas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Reseñas de la Comunidad</h2>
        <button onClick={handleAddReview} className={styles.addButton}>
          <span className={styles.addIcon}>+</span>
          Agregar Reseña
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <div className={styles.reviewsGrid}>
        {reviews.map((review) => (
          <div key={review._id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  {review.cliente?.nombre?.charAt(0) || 'U'}
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>
                    {review.cliente?.usuario
                      ? review.cliente.usuario
                      : (review.cliente?.nombre && review.cliente?.apellido
                        ? `${review.cliente.nombre} ${review.cliente.apellido}`
                        : `Usuario #${review.cliente_id.slice(-6)}`)
                    }
                  </span>
                  <span className={styles.reviewDate}>
                    {formatDate(review.fecha_creacion)}
                  </span>
                </div>
              </div>
              <div className={styles.rating}>
                {renderStars(review.puntuacion)}
              </div>
            </div>

            {review.producto && (
              <div className={styles.productInfo}>
                <img 
                  src={review.producto.imagen_url} 
                  alt={review.producto.nombre}
                  className={styles.productImage}
                />
                <div className={styles.productDetails}>
                  <span className={styles.productName}>{review.producto.nombre}</span>
                  <span className={styles.productPrice}>
                    ${review.producto.precio_unitario}
                  </span>
                </div>
              </div>
            )}

            <div className={styles.reviewContent}>
              <p>{review.comentario}</p>
            </div>

            <div className={styles.reviewActions}>
              <button
                onClick={() => handleLike(review._id)}
                className={`${styles.actionButton} ${styles.likeButton}`}
              >
                <span className={styles.actionIcon}>❤</span>
                <span className={styles.actionText}>Me gusta</span>
                {review.likes && review.likes > 0 && (
                  <span className={styles.likeCount}>{review.likes}</span>
                )}
              </button>

              <button
                onClick={() => handleShowResponses(review._id)}
                className={`${styles.actionButton} ${styles.responseButton}`}
              >
                <span className={styles.actionIcon}>💬</span>
                <span className={styles.actionText}>Respuestas</span>
              </button>

              <button
                onClick={() => handleShare(review._id)}
                className={`${styles.actionButton} ${styles.shareButton}`}
              >
                <span className={styles.actionIcon}>📤</span>
                <span className={styles.actionText}>Compartir</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && !isLoading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <h3>No hay reseñas aún</h3>
          <p>¡Sé el primero en compartir tu experiencia!</p>
          <button onClick={handleAddReview} className={styles.emptyAddButton}>
            Agregar Primera Reseña
          </button>
        </div>
      )}

      <AddReviewForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onReviewAdded={handleReviewAdded}
      />

      <ReviewResponses
        reviewId={selectedReviewId || ''}
        isOpen={showResponses}
        onClose={() => {
          setShowResponses(false);
          setSelectedReviewId(null);
        }}
      />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
    </div>
  );
};

export default ReviewList; 