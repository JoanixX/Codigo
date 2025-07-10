const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
});

require('./database');
app.use(express.json());
app.use(cors());

// Logging básico
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rutas principales
const indexRoutes = require('./routes/index.routes');
app.use('/', indexRoutes);

// CRUD extendido
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/categorias', require('./routes/categorias.routes'));
app.use('/api/resenas', require('./routes/resenas.routes'));

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
