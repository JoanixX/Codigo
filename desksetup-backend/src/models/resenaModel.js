const mongoose = require('mongoose');

const respuestaSchema = new mongoose.Schema({
  cliente_id: { type: String, required: true },
  comentario: { type: String, required: true },
  likes: { type: Number, required: true },
  fecha_respuesta: { type: Date, required: true }
}, { _id: false });

const resenaSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  cliente_id: { type: String, required: true },
  producto_id: { type: String, required: true },
  comentario: { type: String, required: true },
  puntuacion: { type: Number, required: true, min: 1, max: 5 },
  fecha_resena: { type: Date, default: Date.now },
  likes: { type: Number },
  respuestas: { type: [respuestaSchema] }
}, { versionKey: false });

module.exports = mongoose.model('Resena', resenaSchema, 'reseñas');
