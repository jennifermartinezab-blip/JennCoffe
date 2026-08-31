const express = require('express');
const cors = require('cors');

const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const ORIGENES_PERMITIDOS = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]);

const corsOptions = {
  origin: (origen, callback) => {
    // Permite Postman y otras herramientas sin encabezado Origin
    if (!origen || ORIGENES_PERMITIDOS.has(origen)) {
      return callback(null, true);
    }

    return callback(new Error('Origen no permitido por CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JennCoffee API funcionando correctamente'
  });
});

app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Manejo global de errores
app.use((error, req, res, _next) => {
  console.error('Error no controlado:', error.message);

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

module.exports = app;