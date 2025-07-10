const API_BASE_URL = 'http://localhost:3000/api';

export interface Product {
  _id: string;
  nombre: string;
  precio_unitario: number;
  descripcion: string;
  stock: number;
  marca: string;
  imagen_url: string;
  categoria_id: string;
  fecha_creacion: string;
  activo: boolean;
}

export interface Category {
  _id: string;
  nombre: string;
  descripcion: string;
}

export interface ProductFormData {
  nombre: string;
  precio_unitario: number;
  descripcion: string;
  stock: number;
  marca: string;
  imagen_url: string;
  categoria_id: string;
}

export interface CategoryFormData {
  nombre: string;
  descripcion: string;
}

class ProductService {
  // Obtener todos los productos (para clientes)
  async getProducts(): Promise<Product[]> {
    try {
      console.log('Intentando conectar a:', `${API_BASE_URL}/productos`);
      
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      // El backend devuelve { productos: [], paginacion: {} }
      if (data && data.productos && Array.isArray(data.productos)) {
        return data.productos;
      }
      
      // Si es un array directo (formato anterior)
      if (Array.isArray(data)) {
        return data;
      }
      
      console.error('Formato de respuesta inválido:', data);
      throw new Error('Formato de respuesta inválido del servidor');
    } catch (error) {
      console.error('Error en getProducts:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.');
      }
      throw error;
    }
  }

  // Obtener producto por ID (para clientes)
  async getProduct(id: string): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener producto: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error en getProduct:', error);
      throw error;
    }
  }

  // Crear producto (solo para admins)
  async createProduct(productData: ProductFormData): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear producto: ${response.status} ${response.statusText} - ${errorText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error en createProduct:', error);
      throw error;
    }
  }

  // Actualizar producto (solo para admins)
  async updateProduct(id: string, productData: Partial<ProductFormData>): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar producto: ${response.status} ${response.statusText} - ${errorText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error en updateProduct:', error);
      throw error;
    }
  }

  // Eliminar producto (solo para admins)
  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar producto: ${response.status} ${response.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error en deleteProduct:', error);
      throw error;
    }
  }

  // Obtener todas las categorías (para clientes)
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`);
      if (!response.ok) {
        throw new Error(`Error al obtener categorías: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error en getCategories:', error);
      throw error;
    }
  }

  // Crear categoría (solo para admins)
  async createCategory(categoryData: CategoryFormData): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear categoría: ${response.status} ${response.statusText} - ${errorText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error en createCategory:', error);
      throw error;
    }
  }

  // Actualizar categoría (solo para admins)
  async updateCategory(id: string, categoryData: Partial<CategoryFormData>): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar categoría: ${response.status} ${response.statusText} - ${errorText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error en updateCategory:', error);
      throw error;
    }
  }

  // Eliminar categoría (solo para admins)
  async deleteCategory(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar categoría: ${response.status} ${response.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error en deleteCategory:', error);
      throw error;
    }
  }
}

export const productService = new ProductService(); 