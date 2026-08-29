const express = require('express');

const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');

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
app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;