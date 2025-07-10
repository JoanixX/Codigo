const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen_url: { type: String },
  activa: { type: Boolean, default: true },
  fecha_creacion: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Categoria', categoriaSchema);
