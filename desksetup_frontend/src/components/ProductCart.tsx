import React, { useEffect, useState } from 'react';
import { productService, type Product } from '../services/productService';
import styles from './ProductCart.module.css';

const CART_KEY = 'product_cart';

const ProductCart: React.FC = () => {
  const [cart, setCart] = useState<string[]>([]);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      const cartIds = JSON.parse(saved);
      setCart(cartIds);
      loadCartProducts(cartIds);
    } else {
      setLoading(false);
    }
  }, []);

  const loadCartProducts = async (cartIds: string[]) => {
    try {
      const allProducts = await productService.getProducts();
      const products = allProducts.filter(product => cartIds.includes(product._id));
      setCartProducts(products);
    } catch (error) {
      console.error('Error loading cart products:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (id: string) => {
    const updated = cart.filter(cid => cid !== id);
    setCart(updated);
    setCartProducts(prev => prev.filter(product => product._id !== id));
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
  };

  const handleBuyAll = () => {
    const total = cartProducts.reduce((sum, product) => sum + product.precio_unitario, 0);
    alert(`Compra total: $${total} USD`);
  };

  const filteredCartProducts = cartProducts.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>
          Cargando carrito...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Carrito ({cartProducts.length} productos)
        </h2>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar en carrito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          
          {cartProducts.length > 0 && (
            <button
              onClick={handleBuyAll}
              className={styles.clearButton}
            >
              Comprar Todo
            </button>
          )}
        </div>
      </div>

      {filteredCartProducts.length === 0 ? (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyTitle}>
            {searchTerm ? 'No se encontraron productos en el carrito' : 'Carrito vacío'}
          </div>
          <div className={styles.emptySubtext}>
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Agrega productos desde la página de productos'}
          </div>
        </div>
      ) : (
        <div className={styles.cartGrid}>
          {filteredCartProducts.map(product => (
            <div key={product._id} className={styles.cartCard}>
              <div className={styles.cartImageContainer}>
                <img 
                  src={product.imagen_url} 
                  alt={product.nombre} 
                  className={styles.cartImage}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200/6C63FF/FFFFFF?text=Imagen+No+Disponible';
                  }}
                />
              </div>
              
              <div className={styles.cartInfo}>
                <h3 className={styles.cartName}>
                  {product.nombre}
                </h3>
                <p className={styles.cartBrand}>
                  {product.marca}
                </p>
                <p className={styles.cartPrice}>
                  ${product.precio_unitario} USD
                </p>
                <p className={styles.cartStock}>
                  Stock: {product.stock} unidades
                </p>
              </div>
              
              <div className={styles.cartActions}>
                <button 
                  onClick={() => alert(`Compra directa de ${product.nombre} por $${product.precio_unitario} USD`)}
                  className={`${styles.cartActionButton} ${styles.buyButton}`}
                >
                  Comprar
                </button>
                <button 
                  onClick={() => removeFromCart(product._id)} 
                  className={`${styles.cartActionButton} ${styles.removeButton}`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartProducts.length > 0 && (
        <div className={styles.summaryContainer}>
          <h3 className={styles.summaryTitle}>
            Resumen del Carrito
          </h3>
          
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Total de Productos</div>
              <div className={styles.summaryValue}>{cartProducts.length}</div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Precio Total</div>
              <div className={styles.summaryValue}>
                ${cartProducts.reduce((sum, product) => sum + product.precio_unitario, 0).toFixed(2)} USD
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Productos Únicos</div>
              <div className={styles.summaryValue}>
                {new Set(cartProducts.map(p => p.marca)).size} marcas
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleBuyAll}
            className={styles.checkoutButton}
          >
            Proceder al Pago
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCart;