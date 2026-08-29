const express = require('express');

const {
  registrarUsuario,
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarioController');

const {
  verificarToken,
  soloAdministrador
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/',
  verificarToken,
  soloAdministrador,
  registrarUsuario
);

router.get(
  '/',
  verificarToken,
  soloAdministrador,
  listarUsuarios
);

router.get(
  '/:id',
  verificarToken,
  soloAdministrador,
  obtenerUsuario
);

router.put(
  '/:id',
  verificarToken,
  soloAdministrador,
  actualizarUsuario
);

router.delete(
  '/:id',
  verificarToken,
  soloAdministrador,
  eliminarUsuario
);

module.exports = router;