const express = require('express');
const router = express.Router();
const Cliente = require('../models/clienteModel');

// Verificar si usuario o correo ya existe
router.post('/check-exists', async (req, res) => {
  try {
    const { usuario, correo_electronico } = req.body;
    
    if (!usuario && !correo_electronico) {
      return res.status(400).json({ 
        error: 'Debe proporcionar usuario o correo electrónico' 
      });
    }
    
    const query = {};
    if (usuario) query.usuario = usuario;
    if (correo_electronico) query.correo_electronico = correo_electronico;
    
    const existingUser = await Cliente.findOne(query);
    
    res.json({
      exists: !!existingUser,
      usuarioExists: usuario ? !!existingUser : false,
      emailExists: correo_electronico ? !!existingUser : false
    });
  } catch (err) {
    console.error('Error al verificar usuario existente:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear cliente
router.post('/', async (req, res) => {
  try {
    // Validar campos requeridos
    const { usuario, correo_electronico, contraseña } = req.body;
    
    if (!usuario || !correo_electronico || !contraseña) {
      return res.status(400).json({ 
        error: 'Campos requeridos: usuario, correo_electronico, contraseña' 
      });
    }

    const cliente = new Cliente({
      _id: Date.now().toString(),
      ...req.body,
      fecha_registro: new Date()
    });
    
    await cliente.save();
    res.status(201).json(cliente);
  } catch (err) {
    console.error('Error al crear cliente:', err.message);
    
    // Manejar errores específicos de MongoDB
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'Usuario o correo electrónico ya existe' 
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Datos de validación incorrectos',
        details: err.message 
      });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login simple (buscar por usuario y contraseña)
router.post('/login', async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;
    const cliente = await Cliente.findOne({ usuario, contraseña });
    
    if (!cliente) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    res.json({ cliente });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find().select('-contraseña');
    res.json(clientes);
  } catch (err) {
    console.error('Error al obtener clientes:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id).select('-contraseña');
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    console.error('Error al obtener cliente:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-contraseña');
    
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    console.error('Error al actualizar cliente:', err.message);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Datos de validación incorrectos',
        details: err.message 
      });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar cliente
router.delete('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ message: 'Cliente eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener carrito de un cliente
router.get('/:id/carrito', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ carrito: cliente.carrito || { productos: [] } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar carrito de un cliente
router.put('/:id/carrito', async (req, res) => {
  try {
    const { carrito } = req.body;
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { carrito },
      { new: true, runValidators: true }
    );
    
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ carrito: cliente.carrito });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener favoritos de un cliente
router.get('/:id/favoritos', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ favoritos: cliente.favoritos || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar producto a favoritos
router.post('/:id/favoritos/:productoId', async (req, res) => {
  try {
    const { id, productoId } = req.params;
    const cliente = await Cliente.findById(id);
    
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    
    if (!cliente.favoritos.includes(productoId)) {
      cliente.favoritos.push(productoId);
      await cliente.save();
    }
    
    res.json({ favoritos: cliente.favoritos });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remover producto de favoritos
router.delete('/:id/favoritos/:productoId', async (req, res) => {
  try {
    const { id, productoId } = req.params;
    const cliente = await Cliente.findById(id);
    
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    
    cliente.favoritos = cliente.favoritos.filter(id => id !== productoId);
    await cliente.save();
    
    res.json({ favoritos: cliente.favoritos });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener pedidos de un cliente
router.get('/:id/pedidos', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ pedidos: cliente.pedidos || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar pedido a un cliente
router.post('/:id/pedidos', async (req, res) => {
  try {
    const { pedido } = req.body;
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    
    cliente.pedidos.push(pedido);
    await cliente.save();
    
    res.json({ pedidos: cliente.pedidos });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
