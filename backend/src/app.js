const express = require('express');

const categoriaRoutes = require('./routes/categoriaRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'JennCoffee API funcionando correctamente'
  });
});

app.use('/api/categorias', categoriaRoutes);

module.exports = app;