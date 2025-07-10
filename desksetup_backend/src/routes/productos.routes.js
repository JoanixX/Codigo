const express = require('express');
const router = express.Router();
const Producto = require('../models/productoModel');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { categoria, busqueda, ordenar, pagina = 1, limite = 20 } = req.query;
    
    let filtro = {};
    
    // Filtro por categoría
    if (categoria) {
      filtro.categoria_id = categoria;
    }
    
    // Búsqueda por nombre o descripción
    if (busqueda) {
      filtro.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { descripcion: { $regex: busqueda, $options: 'i' } }
      ];
    }
    
    // Ordenamiento
    let orden = {};
    if (ordenar === 'precio_asc') orden.precio_unitario = 1;
    else if (ordenar === 'precio_desc') orden.precio_unitario = -1;
    else if (ordenar === 'nombre_asc') orden.nombre = 1;
    else if (ordenar === 'nombre_desc') orden.nombre = -1;
    else orden._id = 1; // Por defecto, ordenar por ID
    
    const skip = (pagina - 1) * limite;
    
    const productos = await Producto.find(filtro)
      .sort(orden)
      .skip(skip)
      .limit(parseInt(limite));
    
    const total = await Producto.countDocuments(filtro);
    
    res.json({
      productos,
      paginacion: {
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        total,
        paginas: Math.ceil(total / limite)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear producto
router.post('/', async (req, res) => {
  try {
    const producto = new Producto({
      _id: Date.now().toString(),
      ...req.body
    });
    await producto.save();
    res.status(201).json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gestionar stock
router.patch('/:id/stock', async (req, res) => {
  try {
    const { cantidad, operacion } = req.body; // operacion: 'sumar' o 'restar'
    
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    
    if (operacion === 'sumar') {
      producto.stock += parseInt(cantidad);
    } else if (operacion === 'restar') {
      producto.stock = Math.max(0, producto.stock - parseInt(cantidad));
    }
    
    await producto.save();
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener productos por categoría
router.get('/categoria/:categoriaId', async (req, res) => {
  try {
    const productos = await Producto.find({
      categoria_id: req.params.categoriaId
    });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar productos
router.get('/buscar/:termino', async (req, res) => {
  try {
    const { termino } = req.params;
    const productos = await Producto.find({
      $or: [
        { nombre: { $regex: termino, $options: 'i' } },
        { descripcion: { $regex: termino, $options: 'i' } }
      ]
    });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
