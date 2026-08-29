const express = require('express');

const {
  crearProducto,
  listarProductos,
  actualizarProducto,
  eliminarProducto,
  buscarProductos
} = require('../controllers/productoController');

const {
  verificarToken,
  soloAdministrador
} = require('../middlewares/authMiddleware');

const router = express.Router();

// RF01 - Registrar producto
// Solo administrador
router.post(
  '/',
  verificarToken,
  soloAdministrador,
  crearProducto
);

// RF04 - Consultar productos
router.get('/', listarProductos);

// RF05 - Buscar productos por nombre, código o categoría
router.get('/buscar', buscarProductos);

// RF02 - Actualizar producto
// Solo administrador
router.put(
  '/:id',
  verificarToken,
  soloAdministrador,
  actualizarProducto
);

// RF03 - Eliminar producto
// Solo administrador
router.delete(
  '/:id',
  verificarToken,
  soloAdministrador,
  eliminarProducto
);

module.exports = router;