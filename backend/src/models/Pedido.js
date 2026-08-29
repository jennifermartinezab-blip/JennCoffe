const mongoose = require('mongoose');

const detalleProductoSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },

    nombre: {
      type: String,
      required: true,
      trim: true
    },

    cantidad: {
      type: Number,
      required: true,
      min: 1
    },

    precioUnitario: {
      type: Number,
      required: true,
      min: 0
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);

const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true,
      index: true
    },

    productos: {
      type: [detalleProductoSchema],
      required: true,
      validate: {
        validator: function (productos) {
          return productos.length > 0;
        },
        message: 'El pedido debe contener al menos un producto'
      }
    },

    direccionEntrega: {
      type: String,
      required: true,
      trim: true
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },

    fecha: {
      type: Date,
      default: Date.now
    },

    estado: {
      type: String,
      enum: [
        'Pendiente',
        'En preparación',
        'En camino',
        'Entregado',
        'Cancelado'
      ],
      default: 'Pendiente',
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Pedido', pedidoSchema);