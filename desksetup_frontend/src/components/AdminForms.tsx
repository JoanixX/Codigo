import React, { useState } from 'react';
import styles from './AuthPage.module.css';
import { productService } from '../services/productService';
import type { ProductFormData, CategoryFormData } from '../services/productService';

interface AdminFormsProps {
  onProductAdded?: () => void;
  onCategoryAdded?: () => void;
}

const AdminForms: React.FC<AdminFormsProps> = ({ onProductAdded, onCategoryAdded }) => {
  const [activeForm, setActiveForm] = useState<'product' | 'category'>('product');
  const [productData, setProductData] = useState<ProductFormData>({
    nombre: '',
    precio_unitario: 0,
    descripcion: '',
    stock: 0,
    marca: '',
    imagen_url: '',
    categoria_id: ''
  });

  const [categoryData, setCategoryData] = useState<CategoryFormData>({
    nombre: '',
    descripcion: ''
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: name === 'precio_unitario' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await productService.createProduct(productData);
      setSuccess('Producto creado exitosamente');
      setProductData({
        nombre: '',
        precio_unitario: 0,
        descripcion: '',
        stock: 0,
        marca: '',
        imagen_url: '',
        categoria_id: ''
      });
      if (onProductAdded) onProductAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear producto');
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await productService.createCategory(categoryData);
      setSuccess('Categoría creada exitosamente');
      setCategoryData({
        nombre: '',
        descripcion: ''
      });
      if (onCategoryAdded) onCategoryAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear categoría');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2>Panel de Administración</h2>
        
        {error && (
          <div style={{ 
            color: '#ff4a4a', 
            background: 'rgba(255, 74, 74, 0.1)', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            color: '#8AFF00', 
            background: 'rgba(138, 255, 0, 0.1)', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            {success}
          </div>
        )}
        
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveForm('product')}
            style={{
              padding: '10px 20px',
              background: activeForm === 'product' ? '#6C63FF' : '#23244a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Agregar Producto
          </button>
          <button
            onClick={() => setActiveForm('category')}
            style={{
              padding: '10px 20px',
              background: activeForm === 'category' ? '#6C63FF' : '#23244a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Agregar Categoría
          </button>
        </div>

        {activeForm === 'product' ? (
          <form className={styles.authForm} onSubmit={handleProductSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre">Nombre del Producto</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={productData.nombre}
                onChange={handleProductInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="precio_unitario">Precio Unitario</label>
              <input
                type="number"
                step="0.01"
                id="precio_unitario"
                name="precio_unitario"
                value={productData.precio_unitario}
                onChange={handleProductInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={productData.descripcion}
                onChange={handleProductInputChange}
                required
                rows={3}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={productData.stock}
                onChange={handleProductInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="marca">Marca</label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={productData.marca}
                onChange={handleProductInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="imagen_url">URL de la Imagen</label>
              <input
                type="url"
                id="imagen_url"
                name="imagen_url"
                value={productData.imagen_url}
                onChange={handleProductInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="categoria_id">ID de Categoría</label>
              <input
                type="text"
                id="categoria_id"
                name="categoria_id"
                value={productData.categoria_id}
                onChange={handleProductInputChange}
                required
              />
            </div>
            <button
              type="submit"
              className={styles.submitButton}
            >
              Agregar Producto
            </button>
          </form>
        ) : (
          <form className={styles.authForm} onSubmit={handleCategorySubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="cat_nombre">Nombre de la Categoría</label>
              <input
                type="text"
                id="cat_nombre"
                name="nombre"
                value={categoryData.nombre}
                onChange={handleCategoryInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cat_descripcion">Descripción</label>
              <textarea
                id="cat_descripcion"
                name="descripcion"
                value={categoryData.descripcion}
                onChange={handleCategoryInputChange}
                required
                rows={3}
              />
            </div>
            <button
              type="submit"
              className={styles.submitButton}
            >
              Agregar Categoría
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminForms; 