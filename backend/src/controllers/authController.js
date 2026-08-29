const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');

const login = async (req, res) => {
  try {
    const {
      tipo,
      correo,
      usuario,
      contrasena
    } = req.body;

    if (!tipo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'El tipo de usuario y la contraseña son obligatorios'
      });
    }

    if (!['Cliente', 'Administrador'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'El tipo de usuario no es válido'
      });
    }

    let cuenta;
    let payload;
    let datosRespuesta;

    if (tipo === 'Cliente') {
      if (!correo) {
        return res.status(400).json({
          success: false,
          message: 'El correo es obligatorio para iniciar sesión como cliente'
        });
      }

      cuenta = await Cliente.findOne({
        correo: correo.trim().toLowerCase()
      });

      if (!cuenta) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      if (cuenta.estado !== 'Activo') {
        return res.status(403).json({
          success: false,
          message: 'La cuenta del cliente se encuentra inactiva'
        });
      }

      const contrasenaValida = await bcrypt.compare(
        contrasena,
        cuenta.contrasena
      );

      if (!contrasenaValida) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      payload = {
        id: cuenta._id.toString(),
        tipo: 'Cliente'
      };

      datosRespuesta = {
        id: cuenta._id,
        tipo: 'Cliente',
        nombre: cuenta.nombre,
        apellidos: cuenta.apellidos,
        correo: cuenta.correo
      };
    }

    if (tipo === 'Administrador') {
      if (!usuario) {
        return res.status(400).json({
          success: false,
          message:
            'El usuario es obligatorio para iniciar sesión como administrador'
        });
      }

      cuenta = await Usuario.findOne({
        usuario: usuario.trim()
      });

      if (!cuenta) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      if (cuenta.estado !== 'Activo') {
        return res.status(403).json({
          success: false,
          message: 'El usuario administrativo se encuentra inactivo'
        });
      }

      if (cuenta.rol !== 'Administrador') {
        return res.status(403).json({
          success: false,
          message: 'El usuario no tiene un rol administrativo válido'
        });
      }

      const contrasenaValida = await bcrypt.compare(
        contrasena,
        cuenta.contrasena
      );

      if (!contrasenaValida) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      payload = {
        id: cuenta._id.toString(),
        tipo: 'Administrador',
        rol: cuenta.rol
      };

      datosRespuesta = {
        id: cuenta._id,
        tipo: 'Administrador',
        usuario: cuenta.usuario,
        rol: cuenta.rol
      };
    }

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '2h'
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión correcto',
      token,
      data: datosRespuesta
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al iniciar sesión'
    });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Cierre de sesión correcto'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al cerrar sesión'
    });
  }
};

module.exports = {
  login,
  logout
};