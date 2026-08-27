const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true
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
      min: 0
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