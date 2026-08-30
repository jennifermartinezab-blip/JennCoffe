const express = require('express');

const {
  registrarCliente,
  listarClientes,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/clienteController');

const {
  verificarToken,
  soloAdministrador
} = require('../middlewares/authMiddleware');

const router = express.Router();

// RF10 - Registrar cliente
// Ruta pública para permitir que el cliente cree su cuenta
router.post(
  '/',
  registrarCliente
);

// RF11 - Consultar clientes
// Solo administrador
router.get(
  '/',
  verificarToken,
  soloAdministrador,
  listarClientes
);

// RF12 - Actualizar cliente
// Solo administrador
router.put(
  '/:id',
  verificarToken,
  soloAdministrador,
  actualizarCliente
);

// RF13 - Eliminar cliente
// Solo administrador
router.delete(
  '/:id',
  verificarToken,
  soloAdministrador,
  eliminarCliente
);

module.exports = router;