const express = require('express');

const {
  registrarCliente,
  listarClientes,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/clienteController');

const router = express.Router();

router.post('/', registrarCliente);

router.get('/', listarClientes);

router.put('/:id', actualizarCliente);

router.delete('/:id', eliminarCliente);

module.exports = router;