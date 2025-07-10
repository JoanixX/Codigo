const express = require('express');
const router = express.Router();
const Categoria = require('../models/categoriaModel');

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear categoría
router.post('/', async (req, res) => {
  try {
    const categoria = new Categoria({
      _id: Date.now().toString(),
      ...req.body
    });
    await categoria.save();
    res.status(201).json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar categoría
router.put('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar categoría
router.delete('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las categorías (incluyendo inactivas)
router.get('/admin/todas', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
