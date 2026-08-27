const express = require('express');

const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JennCoffee API funcionando correctamente'
  });
});

app.use('/api/categorias', categoriaRoutes);

app.use('/api/productos', productoRoutes);

module.exports = app;