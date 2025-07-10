import React, { useState, useEffect } from 'react';
import { productService, type Product } from '../services/productService';
import { authService } from '../services/authService';
import styles from './ProductList.module.css';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSpecs, setShowSpecs] = useState(false);
  
  const currentUser = authService.getUser();
  const isAdmin = currentUser?.rol === 'administrador';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Iniciando carga de productos...');
        setLoading(true);
        setError('');
        
        const data = await productService.getProducts();
        console.log('Productos cargados:', data);
        
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          console.error('Respuesta inesperada:', data);
          setError('Formato de respuesta inválido');
        }
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('product_cart') || '[]');
    if (!cart.includes(product._id)) {
      cart.push(product._id);
      localStorage.setItem('product_cart', JSON.stringify(cart));
      alert('Producto agregado al carrito');
    } else {
      alert('Producto ya está en el carrito');
    }
  };

  const handleAddToFavorites = (product: Product) => {
    const favorites = JSON.parse(localStorage.getItem('product_favorites') || '[]');
    if (!favorites.includes(product._id)) {
      favorites.push(product._id);
      localStorage.setItem('product_favorites', JSON.stringify(favorites));
      alert('Producto agregado a favoritos');
    } else {
      alert('Producto ya está en favoritos');
    }
  };

  const handleBuyNow = (product: Product) => {
    alert(`Compra directa de ${product.nombre} por $${product.precio_unitario} USD`);
  };

  const handleViewSpecs = (product: Product) => {
    setSelectedProduct(product);
    setShowSpecs(true);
  };

  const handleAddProduct = () => {
    window.location.hash = '#admin';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>
          Cargando productos...
        </div>
        <div className={styles.loadingSubtext}>
          Conectando con el servidor...
        </div>
        <div className={styles.loadingStatus}>
          Estado: {loading ? 'Cargando' : 'Completado'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorTitle}>
          Error al cargar productos
        </div>
        <div className={styles.errorMessage}>
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Productos Disponibles
        </h2>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {isAdmin && (
            <button
              onClick={handleAddProduct}
              className={styles.addButton}
            >
              + Agregar Producto
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 && !loading && !error ? (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyTitle}>
            {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
          </div>
          <div className={styles.emptySubtext}>
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Contacta al administrador para agregar productos'}
          </div>
          <div className={styles.emptyCount}>
            Total de productos: {products.length}
          </div>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className={styles.productCard}
            >
              <div className={styles.productImageContainer}>
                <img 
                  src={product.imagen_url} 
                  alt={product.nombre} 
                  className={styles.productImage}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200/6C63FF/FFFFFF?text=Imagen+No+Disponible';
                  }}
                />
              </div>
              
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>
                  {product.nombre}
                </h3>
                <p className={styles.productBrand}>
                  {product.marca}
                </p>
                <p className={styles.productPrice}>
                  ${product.precio_unitario} USD
                </p>
              </div>
              
              <div className={styles.productActions}>
                <button
                  onClick={() => handleBuyNow(product)}
                  className={`${styles.actionButton} ${styles.buyButton}`}
                >
                  Comprar
                </button>
                
                <button
                  onClick={() => handleViewSpecs(product)}
                  className={`${styles.actionButton} ${styles.specsButton}`}
                >
                  Especificaciones
                </button>
                
                {!isAdmin && (
                  <>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`${styles.actionButton} ${styles.cartButton}`}
                    >
                      + Carrito
                    </button>
                    
                    <button
                      onClick={() => handleAddToFavorites(product)}
                      className={`${styles.actionButton} ${styles.favoritesButton}`}
                    >
                      ♥ Favoritos
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Especificaciones */}
      {showSpecs && selectedProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Especificaciones Técnicas</h3>
              <button
                onClick={() => setShowSpecs(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            
            <img 
              src={selectedProduct.imagen_url} 
              alt={selectedProduct.nombre}
              className={styles.modalImage}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/500x200/6C63FF/FFFFFF?text=Imagen+No+Disponible';
              }}
            />
            
            <h4 className={styles.modalProductName}>{selectedProduct.nombre}</h4>
            <p className={styles.modalDescription}>{selectedProduct.descripcion}</p>
            
            <div className={styles.modalGrid}>
              <div className={styles.modalField}>
                <strong className={styles.modalFieldLabel}>Marca:</strong>
                <p className={styles.modalFieldValue}>{selectedProduct.marca}</p>
              </div>
              <div className={styles.modalField}>
                <strong className={styles.modalFieldLabel}>Precio:</strong>
                <p className={styles.modalFieldValue}>${selectedProduct.precio_unitario} USD</p>
              </div>
              <div className={styles.modalField}>
                <strong className={styles.modalFieldLabel}>Stock:</strong>
                <p className={styles.modalFieldValue}>{selectedProduct.stock} unidades</p>
              </div>
              <div className={styles.modalField}>
                <strong className={styles.modalFieldLabel}>Categoría ID:</strong>
                <p className={styles.modalFieldValue}>{selectedProduct.categoria_id}</p>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button
                onClick={() => handleBuyNow(selectedProduct)}
                className={styles.modalBuyButton}
              >
                Comprar Ahora
              </button>
              <button
                onClick={() => setShowSpecs(false)}
                className={styles.modalCloseButton}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;