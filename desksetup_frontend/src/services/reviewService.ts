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
      const response = await fetch(`${API_BASE_URL}/resenas/with-details`);
      if (!response.ok) {
        throw new Error('Error al obtener reseñas');
      }
      
      const reviews = await response.json();
      return reviews.map((review: any) => ({
        ...review,
        likes: review.likes || 0
      }));
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
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser._id) {
      throw new Error('Usuario no autenticado');
    }

    const responseDataWithUser = {
      ...responseData,
      cliente_id: currentUser._id
    };

    const response = await fetch(`${API_BASE_URL}/resenas/${responseData.review_id}/respuestas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseDataWithUser)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al agregar respuesta');
    }
    
    return response.json();
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
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser._id) {
      throw new Error('Usuario no autenticado');
    }

    const reviewDataWithUser = {
      ...reviewData,
      cliente_id: currentUser._id
    };

    const response = await fetch(`${API_BASE_URL}/resenas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewDataWithUser),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear reseña');
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