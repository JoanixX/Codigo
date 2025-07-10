const mongoose = require('mongoose');

const productoCarritoSchema = new mongoose.Schema({
  producto_id: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio_unitario: { type: Number, required: true }
}, { _id: false });

const carritoSchema = new mongoose.Schema({
  fecha_actualizacion: { type: Date },
  productos: { type: [productoCarritoSchema], required: true }
}, { _id: false });

const productoPedidoSchema = new mongoose.Schema({
  producto_id: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio_unitario: { type: Number, required: true }
}, { _id: false });

const pagoSchema = new mongoose.Schema({
  monto: { type: Number, required: true },
  metodo_pago: { type: String, required: true },
  fecha_pago: { type: Date, required: true },
  estado_pago: { type: String, required: true }
}, { _id: false });

const pedidoSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  fecha_pedido: { type: Date, required: true },
  precio_total: { type: Number, required: true },
  direccion_envio: { type: String, required: true },
  estado: { type: String, required: true },
  productos: { type: [productoPedidoSchema], required: true },
  pago: { type: pagoSchema, required: true }
}, { _id: false });

const clienteSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  correo_electronico: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  nombre: { type: String, default: '' },
  apellido: { type: String, default: '' },
  telefono: { type: String, default: '' },
  direccion: { type: String, default: '' },
  fecha_registro: { type: Date, default: Date.now },
  rol: { type: String, enum: ['cliente', 'administrador'], default: 'cliente' },
  wallet: { type: Number, default: 100 }, // Saldo inicial de 100
  carrito: { type: carritoSchema },
  pedidos: { type: [pedidoSchema] },
  favoritos: [{ type: String }] // IDs de productos favoritos
}, { versionKey: false });

module.exports = mongoose.model('Cliente', clienteSchema);
