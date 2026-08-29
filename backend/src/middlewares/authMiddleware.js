const jwt = require('jsonwebtoken');

const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');

const verificarToken = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }

    const partes = authorization.split(' ');

    if (
      partes.length !== 2 ||
      partes[0] !== 'Bearer' ||
      !partes[1]
    ) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token no válido'
      });
    }

    const token = partes[1];

    const datosToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = datosToken;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'El token ha expirado'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token no válido'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al validar la autenticación'
    });
  }
};

const soloAdministrador = async (req, res, next) => {
  try {
    if (
      !req.usuario ||
      req.usuario.tipo !== 'Administrador' ||
      req.usuario.rol !== 'Administrador'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Acceso permitido únicamente para administradores'
      });
    }

    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'El usuario administrativo ya no existe'
      });
    }

    if (usuario.estado !== 'Activo') {
      return res.status(403).json({
        success: false,
        message: 'El usuario administrativo se encuentra inactivo'
      });
    }

    if (usuario.rol !== 'Administrador') {
      return res.status(403).json({
        success: false,
        message: 'El usuario no tiene un rol administrativo válido'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        'Error interno al validar los permisos del administrador'
    });
  }
};

const soloCliente = async (req, res, next) => {
  try {
    if (
      !req.usuario ||
      req.usuario.tipo !== 'Cliente'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Acceso permitido únicamente para clientes'
      });
    }

    const cliente = await Cliente.findById(req.usuario.id);

    if (!cliente) {
      return res.status(401).json({
        success: false,
        message: 'La cuenta del cliente ya no existe'
      });
    }

    if (cliente.estado !== 'Activo') {
      return res.status(403).json({
        success: false,
        message: 'La cuenta del cliente se encuentra inactiva'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        'Error interno al validar los permisos del cliente'
    });
  }
};

module.exports = {
  verificarToken,
  soloAdministrador,
  soloCliente
};