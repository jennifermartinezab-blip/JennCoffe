const express = require('express');

const {
  crearCategoria,
  listarCategorias,
  actualizarCategoria,
  eliminarCategoria
} = require('../controllers/categoriaController');

const router = express.Router();

router.post('/', crearCategoria);
router.get('/', listarCategorias);
router.put('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);

module.exports = router;