import React, { useEffect, useState } from 'react';
import { productService, type Product } from '../services/productService';
import styles from './ProductFavorites.module.css';

const FAVORITES_KEY = 'product_favorites';

const ProductFavorites: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFavoritesFromStorage();
  }, []);

  const loadFavoritesFromStorage = () => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        const favoriteIds = JSON.parse(saved);
        setFavorites(favoriteIds);
        loadFavoriteProducts(favoriteIds);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      setLoading(false);
    }
  };

  const saveFavoritesToStorage = (favoriteIds: string[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  };

  const loadFavoriteProducts = async (favoriteIds: string[]) => {
    try {
      const allProducts = await productService.getProducts();
      const products = allProducts.filter(product => favoriteIds.includes(product._id));
      setFavoriteProducts(products);
    } catch (error) {
      console.error('Error loading favorite products:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(favId => favId !== id);
    setFavorites(updated);
    setFavoriteProducts(prev => prev.filter(product => product._id !== id));
    saveFavoritesToStorage(updated);
  };

  const addToCart = (product: Product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('product_cart') || '[]');
      if (!cart.includes(product._id)) {
        cart.push(product._id);
        localStorage.setItem('product_cart', JSON.stringify(cart));
        alert('Producto agregado al carrito');
      } else {
        alert('Producto ya está en el carrito');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al agregar al carrito');
    }
  };

  const filteredFavoriteProducts = favoriteProducts.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>
          Cargando favoritos...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Favoritos ({favoriteProducts.length} productos)
        </h2>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar en favoritos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {filteredFavoriteProducts.length === 0 ? (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyTitle}>
            {searchTerm ? 'No se encontraron productos en favoritos' : 'No hay favoritos aún'}
          </div>
          <div className={styles.emptySubtext}>
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Agrega productos a favoritos desde la página de productos'}
          </div>
        </div>
      ) : (
        <div className={styles.favoritesGrid}>
          {filteredFavoriteProducts.map(product => (
            <div key={product._id} className={styles.favoriteCard}>
              <div className={styles.favoriteImageContainer}>
                <img 
                  src={product.imagen_url} 
                  alt={product.nombre} 
                  className={styles.favoriteImage}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200/6C63FF/FFFFFF?text=Imagen+No+Disponible';
                  }}
                />
              </div>
              
              <div className={styles.favoriteInfo}>
                <h3 className={styles.favoriteName}>
                  {product.nombre}
                </h3>
                <p className={styles.favoriteBrand}>
                  {product.marca}
                </p>
                <p className={styles.favoritePrice}>
                  ${product.precio_unitario} USD
                </p>
                <p className={styles.favoriteStock}>
                  Stock: {product.stock} unidades
                </p>
              </div>
              
              <div className={styles.favoriteActions}>
                <button 
                  onClick={() => alert(`Compra directa de ${product.nombre} por $${product.precio_unitario} USD`)}
                  className={`${styles.favoriteActionButton} ${styles.buyButton}`}
                >
                  Comprar
                </button>
                <button 
                  onClick={() => addToCart(product)}
                  className={`${styles.favoriteActionButton} ${styles.cartButton}`}
                >
                  + Carrito
                </button>
                <button 
                  onClick={() => removeFavorite(product._id)} 
                  className={`${styles.favoriteActionButton} ${styles.removeButton}`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductFavorites;