const express = require('express');

const {
  crearProducto,
  listarProductos,
  actualizarProducto,
  eliminarProducto,
  buscarProductos
} = require('../controllers/productoController');

const router = express.Router();

router.post('/', crearProducto);

router.get('/', listarProductos);

router.get('/buscar', buscarProductos);

router.put('/:id', actualizarProducto);

router.delete('/:id', eliminarProducto);

module.exports = router;