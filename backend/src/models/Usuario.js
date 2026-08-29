const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    contrasena: {
      type: String,
      required: true
    },

    rol: {
      type: String,
      required: true,
      enum: ['Administrador'],
      default: 'Administrador'
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

module.exports = mongoose.model('Usuario', usuarioSchema);