import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import styles from './ProductCart.module.css';

interface CartItem {
  producto_id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

const ProductCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.producto_id === productId
        ? { ...item, cantidad: newQuantity }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.producto_id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const handlePurchase = async () => {
    if (cartItems.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    const currentUser = authService.getUser();
    if (!currentUser) {
      setError('Debes iniciar sesión para realizar una compra');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/api/productos/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: currentUser._id,
          productos: cartItems.map(item => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar la compra');
      }

      const result = await response.json();
      
      setSuccess(`¡Compra exitosa! Total: $${result.totalCompra.toFixed(2)}`);
      clearCart();
      
      // Actualizar datos del usuario en localStorage
      const updatedUser = { ...currentUser, wallet: result.saldoRestante };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('storage'));

    } catch (error: any) {
      setError(error.message || 'Error al procesar la compra');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega algunos productos para comenzar a comprar</p>
        <a href="#products" className={styles.shopButton}>
          Ver Productos
        </a>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>Mi Carrito</h2>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          {success}
        </div>
      )}

      <div className={styles.cartItems}>
        {cartItems.map((item) => (
          <div key={item.producto_id} className={styles.cartItem}>
            <div className={styles.itemImage}>
              <img src={item.imagen} alt={item.nombre} />
            </div>
            
            <div className={styles.itemInfo}>
              <h3 className={styles.itemName}>{item.nombre}</h3>
              <p className={styles.itemPrice}>${item.precio.toFixed(2)}</p>
            </div>
            
            <div className={styles.itemQuantity}>
              <button
                onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)}
                className={styles.quantityButton}
                disabled={isLoading}
              >
                -
              </button>
              <span className={styles.quantity}>{item.cantidad}</span>
              <button
                onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)}
                className={styles.quantityButton}
                disabled={isLoading}
              >
                +
              </button>
            </div>
            
            <div className={styles.itemTotal}>
              ${(item.precio * item.cantidad).toFixed(2)}
            </div>
            
            <button
              onClick={() => removeFromCart(item.producto_id)}
              className={styles.removeButton}
              disabled={isLoading}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className={styles.cartSummary}>
        <div className={styles.summaryRow}>
          <span>Total de productos:</span>
          <span>{cartItems.reduce((total, item) => total + item.cantidad, 0)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Total a pagar:</span>
          <span className={styles.totalPrice}>${getTotalPrice().toFixed(2)}</span>
        </div>
        
        <div className={styles.cartActions}>
          <button
            onClick={clearCart}
            className={styles.clearButton}
            disabled={isLoading}
          >
            Vaciar Carrito
          </button>
          <button
            onClick={handlePurchase}
            className={styles.purchaseButton}
            disabled={isLoading || cartItems.length === 0}
          >
            {isLoading ? 'Procesando...' : 'Comprar con Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;