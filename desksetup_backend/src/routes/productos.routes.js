const express = require('express');
const Producto = require('../models/productoModel');
const Cliente = require('../models/clienteModel');
const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Crear nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio_unitario, marca, imagen_url, categoria_id, stock } = req.body;

    if (!nombre || !descripcion || !precio_unitario || !marca || !imagen_url || !categoria_id) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const nuevoProducto = new Producto({
      _id: Date.now().toString(),
      nombre,
      descripcion,
      precio_unitario: Number(precio_unitario),
      marca,
      imagen_url,
      categoria_id,
      stock: Number(stock) || 10,
      activo: true
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const { nombre, descripcion, precio_unitario, marca, imagen_url, categoria_id, stock, activo } = req.body;

    if (nombre) producto.nombre = nombre;
    if (descripcion) producto.descripcion = descripcion;
    if (precio_unitario !== undefined) producto.precio_unitario = Number(precio_unitario);
    if (marca) producto.marca = marca;
    if (imagen_url) producto.imagen_url = imagen_url;
    if (categoria_id) producto.categoria_id = categoria_id;
    if (stock !== undefined) producto.stock = Number(stock);
    if (activo !== undefined) producto.activo = activo;

    await producto.save();
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Comprar productos (actualizar stock y wallet)
router.post('/comprar', async (req, res) => {
  try {
    const { clienteId, productos } = req.body;

    if (!clienteId || !productos || !Array.isArray(productos)) {
      return res.status(400).json({ error: 'Datos de compra inválidos' });
    }

    // Obtener cliente
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    let totalCompra = 0;
    const productosActualizados = [];

    // Verificar stock y calcular total
    for (const item of productos) {
      const producto = await Producto.findById(item.producto_id);
      if (!producto) {
        return res.status(404).json({ error: `Producto ${item.producto_id} no encontrado` });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({ 
          error: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}` 
        });
      }

      totalCompra += producto.precio_unitario * item.cantidad;
      productosActualizados.push({ producto, cantidad: item.cantidad });
    }

    // Verificar saldo suficiente
    if (cliente.wallet < totalCompra) {
      return res.status(400).json({ 
        error: 'Saldo insuficiente en wallet' 
      });
    }

    // Actualizar stock de productos
    for (const { producto, cantidad } of productosActualizados) {
      producto.stock -= cantidad;
      await producto.save();
    }

    // Descontar del wallet del cliente
    cliente.wallet -= totalCompra;

    // Agregar transacción al historial del cliente
    const nuevaTransaccion = {
      id: Date.now().toString(),
      tipo: 'compra',
      monto: totalCompra,
      descripcion: `Compra de ${productos.length} producto(s)`,
      fecha: new Date().toISOString()
    };

    if (!cliente.historial) {
      cliente.historial = [];
    }
    cliente.historial.unshift(nuevaTransaccion);

    await cliente.save();

    res.json({
      success: true,
      message: 'Compra realizada exitosamente',
      totalCompra,
      saldoRestante: cliente.wallet,
      productosComprados: productosActualizados.map(({ producto, cantidad }) => ({
        nombre: producto.nombre,
        cantidad,
        precio: producto.precio_unitario
      }))
    });

  } catch (error) {
    console.error('Error en compra:', error);
    res.status(500).json({ error: 'Error al procesar compra' });
  }
});

module.exports = router;
