const bcrypt = require('bcrypt');

const Usuario = require('../models/Usuario');

const registrarUsuario = async (req, res) => {
  try {
    const {
      usuario,
      contrasena,
      rol,
      estado
    } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'El usuario y la contraseña son obligatorios'
      });
    }

    const usuarioNormalizado = usuario.trim();

    if (usuarioNormalizado === '') {
      return res.status(400).json({
        success: false,
        message: 'El usuario no puede estar vacío'
      });
    }

    const usuarioExistente = await Usuario.findOne({
      usuario: usuarioNormalizado
    });

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario administrativo con ese nombre'
      });
    }

    const contrasenaCifrada = await bcrypt.hash(contrasena, 10);

    const usuarioCreado = await Usuario.create({
      usuario: usuarioNormalizado,
      contrasena: contrasenaCifrada,
      rol: rol || 'Administrador',
      estado: estado || 'Activo'
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
        message: 'Datos del usuario administrativo inválidos',
        error: error.message
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
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'El identificador del usuario no es válido'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al consultar el usuario administrativo'
    });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      usuario,
      rol,
      estado
    } = req.body;

    const datosActualizar = {};

    if (usuario !== undefined) {
      const usuarioNormalizado = usuario.trim();

      if (usuarioNormalizado === '') {
        return res.status(400).json({
          success: false,
          message: 'El usuario no puede estar vacío'
        });
      }

      datosActualizar.usuario = usuarioNormalizado;
    }

    if (rol !== undefined) {
      datosActualizar.rol = rol;
    }

    if (estado !== undefined) {
      datosActualizar.estado = estado;
    }

    const usuarioActualizado =
      await Usuario.findByIdAndUpdate(
        id,
        datosActualizar,
        {
          new: true,
          runValidators: true
        }
      ).select('-contrasena');

    if (!usuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario administrativo no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Usuario administrativo actualizado correctamente',
      data: usuarioActualizado
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'El identificador del usuario no es válido'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos del usuario administrativo inválidos',
        error: error.message
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

    const usuario = await Usuario.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario administrativo no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Usuario administrativo eliminado correctamente'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'El identificador del usuario no es válido'
      });
    }

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