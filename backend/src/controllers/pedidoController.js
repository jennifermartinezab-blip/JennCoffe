const mongoose = require('mongoose');

const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const Producto = require('../models/Producto');

const TRANSICIONES_VALIDAS = {
  Pendiente: ['En preparación'],
  'En preparación': ['En camino'],
  'En camino': ['Entregado'],
  Entregado: [],
  Cancelado: []
};

const ESTADOS_PEDIDO = [
  'Pendiente',
  'En preparación',
  'En camino',
  'Entregado',
  'Cancelado'
];

const METODOS_PAGO = [
  'Tarjeta simulada',
  'Efectivo'
];

const RESULTADOS_PAGO_SIMULADO = [
  'Aprobado',
  'Fallido'
];

const registrarPedido = async (req, res) => {
  try {
    const clienteId = req.usuario.id;

    const {
      productos,
      direccionEntrega,
      pago
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(clienteId)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador del cliente no es válido'
      });
    }

    const cliente = await Cliente.findById(clienteId);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    if (cliente.estado !== 'Activo') {
      return res.status(403).json({
        success: false,
        message: 'El cliente se encuentra inactivo'
      });
    }

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El pedido debe contener al menos un producto'
      });
    }

    const cantidadesPorProducto = new Map();

    for (const item of productos) {
      if (
        !item.producto ||
        !mongoose.Types.ObjectId.isValid(item.producto)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Uno de los identificadores de producto no es válido'
        });
      }

      if (
        !Number.isInteger(item.cantidad) ||
        item.cantidad <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            'La cantidad de cada producto debe ser un número entero mayor que cero'
        });
      }

      const productoId = item.producto.toString();

      const cantidadActual =
        cantidadesPorProducto.get(productoId) || 0;

      cantidadesPorProducto.set(
        productoId,
        cantidadActual + item.cantidad
      );
    }

    const idsProductos = Array.from(
      cantidadesPorProducto.keys()
    );

    const productosEncontrados = await Producto.find({
      _id: { $in: idsProductos }
    });

    if (productosEncontrados.length !== idsProductos.length) {
      return res.status(404).json({
        success: false,
        message: 'Uno o más productos no fueron encontrados'
      });
    }

    const detallePedido = [];
    let total = 0;

    for (const producto of productosEncontrados) {
      if (producto.estado !== 'Activo') {
        return res.status(400).json({
          success: false,
          message: `El producto '${producto.nombre}' se encuentra inactivo`
        });
      }

      if (!producto.disponibilidad) {
        return res.status(400).json({
          success: false,
          message: `El producto '${producto.nombre}' no se encuentra disponible`
        });
      }

      const cantidad = cantidadesPorProducto.get(
        producto._id.toString()
      );

      const subtotal = producto.precio * cantidad;

      detallePedido.push({
        producto: producto._id,
        nombre: producto.nombre,
        cantidad,
        precioUnitario: producto.precio,
        subtotal
      });

      total += subtotal;
    }

    let direccionFinal = cliente.direccion;

    if (
      typeof direccionEntrega === 'string' &&
      direccionEntrega.trim() !== ''
    ) {
      direccionFinal = direccionEntrega.trim();
    }

    if (!direccionFinal) {
      return res.status(400).json({
        success: false,
        message: 'La dirección de entrega es obligatoria'
      });
    }

    if (
      !pago ||
      typeof pago !== 'object' ||
      Array.isArray(pago)
    ) {
      return res.status(400).json({
        success: false,
        message: 'La información del pago simulado es obligatoria'
      });
    }

    const {
      metodo,
      resultadoSimulado
    } = pago;

    if (
      !metodo ||
      !METODOS_PAGO.includes(metodo)
    ) {
      return res.status(400).json({
        success: false,
        message: 'El método de pago simulado no es válido'
      });
    }

    if (
      !resultadoSimulado ||
      !RESULTADOS_PAGO_SIMULADO.includes(resultadoSimulado)
    ) {
      return res.status(400).json({
        success: false,
        message: 'El resultado del pago simulado no es válido'
      });
    }

    if (resultadoSimulado === 'Fallido') {
      return res.status(402).json({
        success: false,
        message: 'El pago simulado fue rechazado. El pedido no fue creado',
        pago: {
          metodo,
          estado: 'Fallido'
        }
      });
    }

    const pedido = await Pedido.create({
      cliente: cliente._id,
      productos: detallePedido,
      direccionEntrega: direccionFinal,
      total,
      pago: {
        metodo,
        estado: 'Aprobado'
      },
      estado: 'Pendiente'
    });

    return res.status(201).json({
      success: true,
      message: 'Pago simulado aprobado y pedido registrado correctamente',
      data: pedido
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al registrar el pedido'
    });
  }
};

const listarMisPedidos = async (req, res) => {
  try {
    const clienteId = req.usuario.id;

    if (!mongoose.Types.ObjectId.isValid(clienteId)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador del cliente no es válido'
      });
    }

    const cliente = await Cliente.findById(clienteId);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    if (cliente.estado !== 'Activo') {
      return res.status(403).json({
        success: false,
        message: 'El cliente se encuentra inactivo'
      });
    }

    const pedidos = await Pedido.find({
      cliente: clienteId
    })
      .sort({ fecha: -1 })
      .populate(
        'productos.producto',
        'codigo imagen estado disponibilidad'
      );

    return res.status(200).json({
      success: true,
      data: pedidos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al consultar los pedidos del cliente'
    });
  }
};

const listarPedidos = async (req, res) => {
  try {
    const { estado } = req.query;

    const filtro = {};

    if (estado) {
      if (!ESTADOS_PEDIDO.includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'El estado indicado no es válido'
        });
      }

      filtro.estado = estado;
    }

    const pedidos = await Pedido.find(filtro)
      .sort({ fecha: -1 })
      .populate(
        'cliente',
        'documento tipoDocumento nombre apellidos correo telefono direccion estado'
      )
      .populate(
        'productos.producto',
        'codigo imagen estado disponibilidad'
      );

    return res.status(200).json({
      success: true,
      data: pedidos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al consultar los pedidos'
    });
  }
};

const obtenerPedido = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador del pedido no es válido'
      });
    }

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    if (
      req.usuario.tipo === 'Cliente' &&
      pedido.cliente.toString() !== req.usuario.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para consultar este pedido'
      });
    }

    if (
      req.usuario.tipo !== 'Cliente' &&
      req.usuario.tipo !== 'Administrador'
    ) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para consultar este pedido'
      });
    }

    await pedido.populate([
      {
        path: 'cliente',
        select:
          'documento tipoDocumento nombre apellidos correo telefono direccion estado'
      },
      {
        path: 'productos.producto',
        select: 'codigo imagen estado disponibilidad'
      }
    ]);

    return res.status(200).json({
      success: true,
      data: pedido
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al consultar el pedido'
    });
  }
};

const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador del pedido no es válido'
      });
    }

    const estadosPermitidos = [
      'Pendiente',
      'En preparación',
      'En camino',
      'Entregado'
    ];

    if (!estado || !estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'El nuevo estado del pedido no es válido'
      });
    }

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    const transicionesPermitidas =
      TRANSICIONES_VALIDAS[pedido.estado] || [];

    if (!transicionesPermitidas.includes(estado)) {
      return res.status(409).json({
        success: false,
        message:
          `No se puede cambiar el pedido de '${pedido.estado}' a '${estado}'`
      });
    }

    pedido.estado = estado;

    await pedido.save();

    return res.status(200).json({
      success: true,
      message: 'Estado del pedido actualizado correctamente',
      data: pedido
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al actualizar el estado del pedido'
    });
  }
};

const cancelarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const clienteId = req.usuario.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador del pedido no es válido'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(clienteId)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador del cliente no es válido'
      });
    }

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    if (pedido.cliente.toString() !== clienteId) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para cancelar este pedido'
      });
    }

    if (pedido.estado !== 'Pendiente') {
      return res.status(409).json({
        success: false,
        message:
          `No se puede cancelar un pedido en estado '${pedido.estado}'`
      });
    }

    pedido.estado = 'Cancelado';

    await pedido.save();

    return res.status(200).json({
      success: true,
      message: 'Pedido cancelado correctamente',
      data: pedido
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al cancelar el pedido'
    });
  }
};

module.exports = {
  registrarPedido,
  listarMisPedidos,
  listarPedidos,
  obtenerPedido,
  actualizarEstadoPedido,
  cancelarPedido
};