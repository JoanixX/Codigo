const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    endpoints: {
      clientes: '/api/clientes',
      productos: '/api/productos',
      categorias: '/api/categorias',
      resenas: '/api/resenas'
    }
  });
});

module.exports = router; 