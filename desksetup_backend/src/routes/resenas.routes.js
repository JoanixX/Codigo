const express = require('express');
const router = express.Router();
const Resena = require('../models/resenaModel');

// Obtener reseñas de un producto
router.get('/producto/:productoId', async (req, res) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;
    const skip = (pagina - 1) * limite;
    
    const resenas = await Resena.find({
      producto_id: req.params.productoId
    })
    .sort({ fecha_resena: -1 })
    .skip(skip)
    .limit(parseInt(limite));
    
    const total = await Resena.countDocuments({
      producto_id: req.params.productoId
    });
    
    res.json({
      resenas,
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

// Obtener reseñas de un cliente
router.get('/cliente/:clienteId', async (req, res) => {
  try {
    const resenas = await Resena.find({
      cliente_id: req.params.clienteId
    }).sort({ fecha_resena: -1 });
    
    res.json(resenas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear reseña
router.post('/', async (req, res) => {
  try {
    const { cliente_id, producto_id, puntuacion, comentario } = req.body;
    
    // Verificar que no haya una reseña existente del mismo usuario para el mismo producto
    const resenaExistente = await Resena.findOne({
      cliente_id,
      producto_id
    });
    
    if (resenaExistente) {
      return res.status(400).json({ error: 'Ya has reseñado este producto' });
    }
    
    const resena = new Resena({
      _id: Date.now().toString(),
      cliente_id,
      producto_id,
      puntuacion,
      comentario,
      fecha_resena: new Date(),
      likes: 0
    });
    
    await resena.save();
    res.status(201).json(resena);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar reseña
router.put('/:id', async (req, res) => {
  try {
    const { puntuacion, comentario } = req.body;
    
    const resena = await Resena.findByIdAndUpdate(
      req.params.id,
      { puntuacion, comentario },
      { new: true, runValidators: true }
    );
    
    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    
    res.json(resena);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar reseña
router.delete('/:id', async (req, res) => {
  try {
    const resena = await Resena.findByIdAndDelete(req.params.id);
    
    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dar like a una reseña
router.post('/:id/like', async (req, res) => {
  try {
    const resena = await Resena.findById(req.params.id);
    
    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    
    // Incrementar likes
    resena.likes = (resena.likes || 0) + 1;
    await resena.save();
    
    res.json({ 
      success: true, 
      likes: resena.likes,
      message: 'Like agregado exitosamente' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener respuestas de una reseña
router.get('/:id/respuestas', async (req, res) => {
  try {
    // Por ahora retornamos un array vacío ya que no tenemos un modelo de respuestas
    // En una implementación real, tendrías un modelo RespuestaResena
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar respuesta a una reseña
router.post('/:id/respuestas', async (req, res) => {
  try {
    const { comentario } = req.body;
    
    // Verificar que la reseña existe
    const resena = await Resena.findById(req.params.id);
    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    
    // Crear nueva respuesta (simulado)
    const nuevaRespuesta = {
      _id: `resp${Date.now()}`,
      review_id: req.params.id,
      cliente_id: 'cliente789', // En una app real, esto vendría del token de autenticación
      comentario,
      fecha_respuesta: new Date().toISOString(),
      likes: 0
    };
    
    res.status(201).json(nuevaRespuesta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener estadísticas de reseñas de un producto
router.get('/producto/:productoId/estadisticas', async (req, res) => {
  try {
    const resenas = await Resena.find({
      producto_id: req.params.productoId
    });
    
    const totalResenas = resenas.length;
    const promedioPuntuacion = totalResenas > 0 
      ? resenas.reduce((sum, resena) => sum + resena.puntuacion, 0) / totalResenas 
      : 0;
    
    const distribucionPuntuaciones = {
      1: resenas.filter(r => r.puntuacion === 1).length,
      2: resenas.filter(r => r.puntuacion === 2).length,
      3: resenas.filter(r => r.puntuacion === 3).length,
      4: resenas.filter(r => r.puntuacion === 4).length,
      5: resenas.filter(r => r.puntuacion === 5).length
    };
    
    res.json({
      totalResenas,
      promedioPuntuacion: Math.round(promedioPuntuacion * 10) / 10,
      distribucionPuntuaciones
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las reseñas
router.get('/', async (req, res) => {
  try {
    const resenas = await Resena.find().sort({ fecha_resena: -1 });
    res.json(resenas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
