const express = require('express');

const {
  registrarCliente,
  listarClientes,
  obtenerMiPerfil,
  actualizarMiPerfil,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/clienteController');

const {
  verificarToken,
  soloAdministrador,
  soloCliente
} = require('../middlewares/authMiddleware');

const router = express.Router();

// RF10 - Registrar cliente
// Ruta pública para permitir que el cliente cree su cuenta
router.post(
  '/',
  registrarCliente
);

// Perfil del cliente autenticado
// Debe ir antes de /:id para evitar que "me" sea interpretado como un id
router.get(
  '/me',
  verificarToken,
  soloCliente,
  obtenerMiPerfil
);

router.put(
  '/me',
  verificarToken,
  soloCliente,
  actualizarMiPerfil
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