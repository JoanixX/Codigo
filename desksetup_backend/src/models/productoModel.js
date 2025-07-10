const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  nombre: { type: String, required: true },
  precio_unitario: { type: Number, required: true },
  descripcion: { type: String, required: true },
  stock: { type: Number, required: true },
  marca: { type: String, required: true },
  imagen_url: { type: String, required: true },
  categoria_id: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true }
}, { versionKey: false });

module.exports = mongoose.model('Producto', productoSchema);
