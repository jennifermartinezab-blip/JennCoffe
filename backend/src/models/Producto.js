const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },

    nombre: {
      type: String,
      required: true,
      trim: true
    },

    descripcion: {
      type: String,
      required: true,
      trim: true
    },

    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true
    },

    precio: {
      type: Number,
      required: true,
      validate: {
        validator: function (valor) {
          return Number.isFinite(valor) && valor > 0;
        },
        message: 'El precio debe ser un número mayor que cero'
      }
    },

    imagen: {
      type: String,
      required: true,
      trim: true
    },

    disponibilidad: {
      type: Boolean,
      default: true
    },

    estado: {
      type: String,
      enum: ['Activo', 'Inactivo'],
      default: 'Activo'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Producto', productoSchema);