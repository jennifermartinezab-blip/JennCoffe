const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
  {
    documento: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    tipoDocumento: {
      type: String,
      required: true,
      enum: ['CC', 'CE', 'TI', 'PASAPORTE'],
      trim: true
    },

    nombre: {
      type: String,
      required: true,
      trim: true
    },

    apellidos: {
      type: String,
      required: true,
      trim: true
    },

    correo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    telefono: {
      type: String,
      required: true,
      trim: true
    },

    direccion: {
      type: String,
      required: true,
      trim: true
    },

    contrasena: {
      type: String,
      required: true
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

module.exports = mongoose.model('Cliente', clienteSchema);