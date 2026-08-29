const express = require('express');

const {
  crearCategoria,
  listarCategorias,
  actualizarCategoria,
  eliminarCategoria
} = require('../controllers/categoriaController');

const {
  verificarToken,
  soloAdministrador
} = require('../middlewares/authMiddleware');

const router = express.Router();

// RF06 - Registrar categoría
// Solo administrador
router.post(
  '/',
  verificarToken,
  soloAdministrador,
  crearCategoria
);

// RF09 - Consultar categorías
router.get('/', listarCategorias);

// RF07 - Actualizar categoría
// Solo administrador
router.put(
  '/:id',
  verificarToken,
  soloAdministrador,
  actualizarCategoria
);

// RF08 - Eliminar categoría
// Solo administrador
router.delete(
  '/:id',
  verificarToken,
  soloAdministrador,
  eliminarCategoria
);

module.exports = router;