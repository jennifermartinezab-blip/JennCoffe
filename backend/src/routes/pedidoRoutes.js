const express = require('express');

const {
  registrarPedido,
  listarMisPedidos,
  listarPedidos,
  obtenerPedido,
  actualizarEstadoPedido,
  cancelarPedido
} = require('../controllers/pedidoController');

const {
  verificarToken,
  soloCliente,
  soloAdministrador
} = require('../middlewares/authMiddleware');

const router = express.Router();

// RF21 + RF22
router.post(
  '/',
  verificarToken,
  soloCliente,
  registrarPedido
);

// RF23 - Mis pedidos del cliente autenticado
router.get(
  '/mis',
  verificarToken,
  soloCliente,
  listarMisPedidos
);

// RF23 + RF27 + RF28 + RF29
// Consulta administrativa de pedidos y filtros por estado
router.get(
  '/',
  verificarToken,
  soloAdministrador,
  listarPedidos
);

// RF24 - Detalle de pedido
router.get(
  '/:id',
  verificarToken,
  obtenerPedido
);

// RF25 - Actualizar estado del pedido
router.patch(
  '/:id/estado',
  verificarToken,
  soloAdministrador,
  actualizarEstadoPedido
);

// RF26 - Cancelar pedido
router.patch(
  '/:id/cancelar',
  verificarToken,
  soloCliente,
  cancelarPedido
);

module.exports = router;