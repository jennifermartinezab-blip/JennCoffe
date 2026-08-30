const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Usuario = require('../models/Usuario');

const escaparRegex = (texto) => {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const registrarUsuario = async (req, res) => {
  try {
    const {
      usuario,
      contrasena,
      rol,
      estado
    } = req.body;

    if (
      typeof usuario !== 'string' ||
      typeof contrasena !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'El usuario y la contraseña deben tener un formato válido'
      });
    }

    const usuarioNormalizado = usuario.trim();
    const contrasenaNormalizada = contrasena.trim();

    if (!usuarioNormalizado || !contrasenaNormalizada) {
      return res.status(400).json({
        success: false,
        message: 'El usuario y la contraseña son obligatorios'
      });
    }

    if (rol !== undefined && typeof rol !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'El rol debe tener un formato válido'
      });
    }

    if (estado !== undefined && typeof estado !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'El estado debe tener un formato válido'
      });
    }

    const usuarioExistente = await Usuario.findOne({
      usuario: {
        $regex: `^${escaparRegex(usuarioNormalizado)}$`,
        $options: 'i'
      }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario administrativo con ese nombre'
      });
    }

    const contrasenaCifrada = await bcrypt.hash(
      contrasenaNormalizada,
      10
    );

    const usuarioCreado = await Usuario.create({
      usuario: usuarioNormalizado,
      contrasena: contrasenaCifrada,
      rol: rol !== undefined ? rol.trim() : 'Administrador',
      estado: estado !== undefined ? estado.trim() : 'Activo'
    });

    const usuarioRespuesta = usuarioCreado.toObject();
    delete usuarioRespuesta.contrasena;

    return res.status(201).json({
      success: true,
      message: 'Usuario administrativo registrado correctamente',
      data: usuarioRespuesta
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos del usuario administrativo inválidos'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El usuario administrativo ya se encuentra registrado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al registrar el usuario administrativo'
    });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select('-contrasena')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: usuarios
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al consultar los usuarios administrativos'
    });
  }
};

const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador del usuario no es válido'
      });
    }

    const usuario = await Usuario.findById(id)
      .select('-contrasena');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario administrativo no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al consultar el usuario administrativo'
    });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador del usuario no es válido'
      });
    }

    const usuarioActual = await Usuario.findById(id);

    if (!usuarioActual) {
      return res.status(404).json({
        success: false,
        message: 'Usuario administrativo no encontrado'
      });
    }

    const {
      usuario,
      contrasena,
      rol,
      estado
    } = req.body;

    const datosActualizar = {};

    if (usuario !== undefined) {
      if (typeof usuario !== 'string' || !usuario.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El usuario debe tener un formato válido'
        });
      }

      const usuarioNormalizado = usuario.trim();

      const usuarioExistente = await Usuario.findOne({
        _id: { $ne: id },
        usuario: {
          $regex: `^${escaparRegex(usuarioNormalizado)}$`,
          $options: 'i'
        }
      });

      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario administrativo con ese nombre'
        });
      }

      datosActualizar.usuario = usuarioNormalizado;
    }

    if (contrasena !== undefined) {
      if (
        typeof contrasena !== 'string' ||
        !contrasena.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener un formato válido'
        });
      }

      datosActualizar.contrasena = await bcrypt.hash(
        contrasena.trim(),
        10
      );
    }

    if (rol !== undefined) {
      if (typeof rol !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'El rol debe tener un formato válido'
        });
      }

      datosActualizar.rol = rol.trim();
    }

    if (estado !== undefined) {
      if (typeof estado !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'El estado debe tener un formato válido'
        });
      }

      datosActualizar.estado = estado.trim();
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      datosActualizar,
      {
        new: true,
        runValidators: true
      }
    ).select('-contrasena');

    return res.status(200).json({
      success: true,
      message: 'Usuario administrativo actualizado correctamente',
      data: usuarioActualizado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos del usuario administrativo inválidos'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario administrativo con ese nombre'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario administrativo'
    });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador del usuario no es válido'
      });
    }

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario administrativo no encontrado'
      });
    }

    await Usuario.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Usuario administrativo eliminado correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario administrativo'
    });
  }
};

module.exports = {
  registrarUsuario,
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario
};