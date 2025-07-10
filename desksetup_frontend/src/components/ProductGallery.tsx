import React, { useState, useEffect, useCallback } from 'react';
import styles from './ProductGallery.module.css';
import ProductFilters from './ProductFilters';
import ProductCart from './ProductCart';
import ProductFavorites from './ProductFavorites';
import { PRODUCTS } from './productData';

const FAVORITES_KEY = 'product_favorites';
const CART_KEY = 'product_cart';

export type Product = typeof PRODUCTS[0];

const ProductGallery: React.FC = () => {
  const [filter, setFilter] = useState<string>('todos');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);

  useEffect(() => {
    const fav = localStorage.getItem(FAVORITES_KEY);
    if (fav) setFavorites(JSON.parse(fav));
    const crt = localStorage.getItem(CART_KEY);
    if (crt) setCart(JSON.parse(crt));
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  }, []);

  const onDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('productId', id.toString());
  };
  const onDrop = (e: React.DragEvent) => {
    const id = parseInt(e.dataTransfer.getData('productId'));
    if (!cart.includes(id)) setCart([...cart, id]);
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const filteredProducts = filter === 'todos' ? PRODUCTS : PRODUCTS.filter(product => product.rarity === filter);

  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.galleryTitle}>Galería de Productos Gamer</h2>
      <ProductFilters filter={filter} setFilter={setFilter} />
      <div className={styles.nftGrid}>
        {filteredProducts.map((product, idx) => (
            <div
              key={product.id}
              className={`${styles.nftCard} futuristic-card futuristic-stagger ${idx % 2 === 0 ? 'futuristic-fadein-left' : 'futuristic-fadein-right'}`}
              draggable
              onDragStart={e => onDragStart(e, product.id)}
            >
              <div className="futuristic-scanline" style={{position:'relative', padding: 0, margin: 0}}>
                <img src={product.img} alt={product.name} className={styles.nftImg} style={{margin: 0, padding: 0}} />
              </div>
              <div className={styles.nftInfo}>
                <span className={styles.nftName}>{product.name}</span>
                <span className={styles.nftRarity + ' rarity-' + product.rarity}>{product.rarity}</span>
                <span className={styles.nftPrice}>{product.price} USD</span>
              </div>
              <button
                onClick={() => toggleFavorite(product.id)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 24,
                  color: favorites.includes(product.id) ? '#00fff7' : '#23244a',
                  filter: favorites.includes(product.id) ? 'drop-shadow(0 0 8px #00fff7cc)' : 'none',
                  transition: 'color 0.2s, filter 0.2s',
                }}
                aria-label={favorites.includes(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                {favorites.includes(product.id) ? '★' : '☆'}
              </button>
            </div>
        ))}
      </div>
      <div onDrop={onDrop} onDragOver={onDragOver} style={{minHeight: 120}}>
        <ProductCart />
      </div>
      <ProductFavorites />
    </section>
  );
};

export default ProductGallery;
