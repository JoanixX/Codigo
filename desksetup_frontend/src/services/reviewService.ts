const API_BASE_URL = 'http://localhost:3000/api';

export interface Review {
  _id: string;
  producto_id: string;
  cliente_id: string;
  comentario: string;
  puntuacion: number;
  fecha_creacion: string;
  fecha_resena?: string;
  likes?: number;
  liked?: boolean;
}

export interface ReviewResponse {
  _id: string;
  review_id: string;
  cliente_id: string;
  comentario: string;
  fecha_respuesta: string;
  likes?: number;
}

export interface ReviewWithDetails extends Review {
  producto?: {
    _id: string;
    nombre: string;
    imagen_url: string;
    precio_unitario: number;
  };
  cliente?: {
    _id: string;
    nombre: string;
    apellido: string;
    usuario: string;
  };
  respuestas?: ReviewResponse[];
}

export interface ReviewFormData {
  producto_id: string;
  comentario: string;
  puntuacion: number;
}

export interface ResponseFormData {
  review_id: string;
  comentario: string;
}

class ReviewService {
  // Obtener todas las reseñas con detalles (para clientes y admins)
  async getReviewsWithDetails(): Promise<ReviewWithDetails[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas`);
      if (!response.ok) {
        throw new Error('Error al obtener reseñas');
      }
      
      const reviews = await response.json();
      
      // Obtener detalles de productos y clientes para cada reseña
      const reviewsWithDetails = await Promise.all(
        reviews.map(async (review: Review) => {
          try {
            const [productResponse, clientResponse] = await Promise.all([
              fetch(`${API_BASE_URL}/productos/${review.producto_id}`),
              fetch(`${API_BASE_URL}/clientes/${review.cliente_id}`)
            ]);
            
            let producto = null;
            let cliente = null;
            
            if (productResponse.ok) {
              const productData = await productResponse.json();
              producto = {
                _id: productData._id,
                nombre: productData.nombre,
                imagen_url: productData.imagen_url,
                precio_unitario: productData.precio_unitario
              };
            }
            
            if (clientResponse.ok) {
              const clientData = await clientResponse.json();
              cliente = {
                _id: clientData._id,
                nombre: clientData.nombre,
                apellido: clientData.apellido,
                usuario: clientData.usuario
              };
            }
            
            return {
              ...review,
              producto,
              cliente,
              likes: review.likes || 0
            };
          } catch (error) {
            console.error('Error al obtener detalles de reseña:', error);
            return {
              ...review,
              likes: review.likes || 0
            };
          }
        })
      );
      
      return reviewsWithDetails;
    } catch (error) {
      console.error('Error en getReviewsWithDetails:', error);
      throw error;
    }
  }

  // Dar like a una reseña
  async likeReview(reviewId: string): Promise<{ success: boolean; likes: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas/${reviewId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Error al dar like');
      }
      
      const data = await response.json();
      return { success: true, likes: data.likes };
    } catch (error) {
      console.error('Error en likeReview:', error);
      throw error;
    }
  }

  // Obtener respuestas de una reseña
  async getReviewResponses(reviewId: string): Promise<ReviewResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas/${reviewId}/respuestas`);
      if (!response.ok) {
        throw new Error('Error al obtener respuestas');
      }
      return response.json();
    } catch (error) {
      console.error('Error en getReviewResponses:', error);
      throw error;
    }
  }

  // Agregar respuesta a una reseña
  async addResponse(responseData: ResponseFormData): Promise<ReviewResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas/${responseData.review_id}/respuestas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
      });
      
      if (!response.ok) {
        throw new Error('Error al agregar respuesta');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error en addResponse:', error);
      throw error;
    }
  }

  // Compartir reseña (simulado)
  async shareReview(_reviewId: string): Promise<{ success: boolean; message: string }> {
    // Simulación de compartir - en una app real esto abriría el menú de compartir nativo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Has compartido esta reseña' 
        });
      }, 500);
    });
  }

  // Obtener todas las reseñas (para clientes y admins)
  async getReviews(): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/resenas`);
    if (!response.ok) {
      throw new Error('Error al obtener reseñas');
    }
    return response.json();
  }

  // Obtener reseñas por producto (para clientes y admins)
  async getReviewsByProduct(productId: string): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/resenas/producto/${productId}`);
    if (!response.ok) {
      throw new Error('Error al obtener reseñas del producto');
    }
    return response.json();
  }

  // Obtener reseña por ID (para clientes y admins)
  async getReview(id: string): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/resenas/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener reseña');
    }
    return response.json();
  }

  // Crear reseña (para clientes)
  async createReview(reviewData: ReviewFormData): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/resenas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      throw new Error('Error al crear reseña');
    }
    return response.json();
  }

  // Actualizar reseña (para clientes que la crearon o admins)
  async updateReview(id: string, reviewData: Partial<ReviewFormData>): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/resenas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar reseña');
    }
    return response.json();
  }

  // Eliminar reseña (para clientes que la crearon o admins)
  async deleteReview(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/resenas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar reseña');
    }
  }
}

export const reviewService = new ReviewService(); 