const express = require('express');
const Cliente = require('../models/clienteModel');
const router = express.Router();

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

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find({}, { contraseña: 0 });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id, { contraseña: 0 });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

// Obtener datos del wallet
router.get('/:id/wallet', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Crear historial básico si no existe
    const historial = cliente.historial || [];
    
    res.json({
      saldo: cliente.wallet || 100,
      historial: historial
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos del wallet' });
  }
});

// Realizar depósito en wallet
router.post('/:id/wallet/deposito', async (req, res) => {
  try {
    const { monto } = req.body;
    
    if (!monto || monto <= 0) {
      return res.status(400).json({ error: 'Monto inválido' });
    }

    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Actualizar saldo
    cliente.wallet = (cliente.wallet || 100) + monto;
    
    // Agregar transacción al historial
    const nuevaTransaccion = {
      id: Date.now().toString(),
      tipo: 'deposito',
      monto: monto,
      descripcion: `Depósito de $${monto}`,
      fecha: new Date().toISOString()
    };

    if (!cliente.historial) {
      cliente.historial = [];
    }
    cliente.historial.unshift(nuevaTransaccion);

    await cliente.save();

    res.json({
      saldo: cliente.wallet,
      historial: cliente.historial
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar depósito' });
  }
});

// Realizar compra (descontar del wallet)
router.post('/:id/wallet/compra', async (req, res) => {
  try {
    const { monto, descripcion } = req.body;
    
    if (!monto || monto <= 0) {
      return res.status(400).json({ error: 'Monto inválido' });
    }

    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar saldo suficiente
    if ((cliente.wallet || 100) < monto) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // Actualizar saldo
    cliente.wallet = (cliente.wallet || 100) - monto;
    
    // Agregar transacción al historial
    const nuevaTransaccion = {
      id: Date.now().toString(),
      tipo: 'compra',
      monto: monto,
      descripcion: descripcion || `Compra de $${monto}`,
      fecha: new Date().toISOString()
    };

    if (!cliente.historial) {
      cliente.historial = [];
    }
    cliente.historial.unshift(nuevaTransaccion);

    await cliente.save();

    res.json({
      saldo: cliente.wallet,
      historial: cliente.historial
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar compra' });
  }
});

// Login de cliente
router.post('/login', async (req, res) => {
  try {
    const { usuario, correo_electronico, contraseña } = req.body;

    if (!contraseña) {
      return res.status(400).json({ error: 'Contraseña es requerida' });
    }

    // Buscar cliente por usuario o correo electrónico
    const query = {};
    if (usuario) query.usuario = usuario;
    if (correo_electronico) query.correo_electronico = correo_electronico;

    if (!usuario && !correo_electronico) {
      return res.status(400).json({ error: 'Debe proporcionar usuario o correo electrónico' });
    }

    const cliente = await Cliente.findOne(query);

    if (!cliente) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña (comparación simple por ahora)
    if (cliente.contraseña !== contraseña) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Retornar cliente sin contraseña
    const clienteSinContraseña = cliente.toObject();
    delete clienteSinContraseña.contraseña;

    res.json({ cliente: clienteSinContraseña });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo cliente
router.post('/', async (req, res) => {
  try {
    const { usuario, correo_electronico, contraseña, nombre, apellido, telefono, direccion, rol } = req.body;

    // Validaciones básicas
    if (!usuario || !correo_electronico || !contraseña) {
      return res.status(400).json({ error: 'Usuario, correo y contraseña son requeridos' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Cliente.findOne({ 
      $or: [{ usuario }, { correo_electronico }] 
    });
    
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El usuario o correo ya existe' });
    }

    const nuevoCliente = new Cliente({
      _id: Date.now().toString(),
      usuario,
      correo_electronico,
      contraseña,
      nombre: nombre || '',
      apellido: apellido || '',
      telefono: telefono || '',
      direccion: direccion || '',
      rol: rol || 'cliente',
      wallet: 100 // Saldo inicial
    });

    await nuevoCliente.save();
    
    // Retornar cliente sin contraseña
    const clienteSinContraseña = nuevoCliente.toObject();
    delete clienteSinContraseña.contraseña;
    
    res.status(201).json(clienteSinContraseña);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// Actualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const { usuario, correo_electronico, nombre, apellido, telefono, direccion } = req.body;

    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar si el nuevo usuario o correo ya existe en otro cliente
    if (usuario && usuario !== cliente.usuario) {
      const usuarioExistente = await Cliente.findOne({ usuario, _id: { $ne: req.params.id } });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El nombre de usuario ya existe' });
      }
    }

    if (correo_electronico && correo_electronico !== cliente.correo_electronico) {
      const correoExistente = await Cliente.findOne({ correo_electronico, _id: { $ne: req.params.id } });
      if (correoExistente) {
        return res.status(400).json({ error: 'El correo electrónico ya existe' });
      }
    }

    // Actualizar campos
    if (usuario) cliente.usuario = usuario;
    if (correo_electronico) cliente.correo_electronico = correo_electronico;
    if (nombre !== undefined) cliente.nombre = nombre;
    if (apellido !== undefined) cliente.apellido = apellido;
    if (telefono !== undefined) cliente.telefono = telefono;
    if (direccion !== undefined) cliente.direccion = direccion;

    await cliente.save();
    
    // Retornar cliente sin contraseña
    const clienteActualizado = cliente.toObject();
    delete clienteActualizado.contraseña;
    
    res.json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// Eliminar cliente
router.delete('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
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
