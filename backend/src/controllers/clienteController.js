const bcrypt = require('bcrypt');
const Cliente = require('../models/Cliente');

const registrarCliente = async (req, res) => {
  try {
    const {
      documento,
      tipoDocumento,
      nombre,
      apellidos,
      correo,
      telefono,
      direccion,
      contrasena
    } = req.body;

    if (
      !documento ||
      !tipoDocumento ||
      !nombre ||
      !apellidos ||
      !correo ||
      !telefono ||
      !direccion ||
      !contrasena
    ) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos del cliente son obligatorios'
      });
    }

    const clientePorDocumento = await Cliente.findOne({
      documento: documento.trim()
    });

    if (clientePorDocumento) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un cliente con ese documento'
      });
    }

    const clientePorCorreo = await Cliente.findOne({
      correo: correo.trim().toLowerCase()
    });

    if (clientePorCorreo) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un cliente con ese correo'
      });
    }

    const contrasenaCifrada = await bcrypt.hash(contrasena, 10);

    const cliente = await Cliente.create({
      documento: documento.trim(),
      tipoDocumento,
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      correo: correo.trim().toLowerCase(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      contrasena: contrasenaCifrada
    });

    const clienteRespuesta = cliente.toObject();
    delete clienteRespuesta.contrasena;

    return res.status(201).json({
      success: true,
      message: 'Cliente registrado correctamente',
      data: clienteRespuesta
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos del cliente inválidos',
        error: error.message
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El documento o correo ya se encuentra registrado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al registrar el cliente'
    });
  }
};

const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().select('-contrasena');

    return res.status(200).json({
      success: true,
      data: clientes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al consultar los clientes'
    });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      documento,
      tipoDocumento,
      nombre,
      apellidos,
      correo,
      telefono,
      direccion,
      estado
    } = req.body;

    const datosActualizar = {};

    if (documento !== undefined) {
      datosActualizar.documento = documento.trim();
    }

    if (tipoDocumento !== undefined) {
      datosActualizar.tipoDocumento = tipoDocumento;
    }

    if (nombre !== undefined) {
      datosActualizar.nombre = nombre.trim();
    }

    if (apellidos !== undefined) {
      datosActualizar.apellidos = apellidos.trim();
    }

    if (correo !== undefined) {
      datosActualizar.correo = correo.trim().toLowerCase();
    }

    if (telefono !== undefined) {
      datosActualizar.telefono = telefono.trim();
    }

    if (direccion !== undefined) {
      datosActualizar.direccion = direccion.trim();
    }

    if (estado !== undefined) {
      datosActualizar.estado = estado;
    }

    const cliente = await Cliente.findByIdAndUpdate(
      id,
      datosActualizar,
      {
        new: true,
        runValidators: true
      }
    ).select('-contrasena');

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cliente actualizado correctamente',
      data: cliente
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'El identificador del cliente no es válido'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos del cliente inválidos',
        error: error.message
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El documento o correo ya se encuentra registrado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el cliente'
    });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByIdAndDelete(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cliente eliminado correctamente'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'El identificador del cliente no es válido'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el cliente'
    });
  }
};

module.exports = {
  registrarCliente,
  listarClientes,
  actualizarCliente,
  eliminarCliente
};