const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Cliente = require('../models/Cliente');
const Pedido = require('../models/Pedido');

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
      typeof documento !== 'string' ||
      typeof tipoDocumento !== 'string' ||
      typeof nombre !== 'string' ||
      typeof apellidos !== 'string' ||
      typeof correo !== 'string' ||
      typeof telefono !== 'string' ||
      typeof direccion !== 'string' ||
      typeof contrasena !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Los datos del cliente deben tener un formato válido'
      });
    }

    const documentoLimpio = documento.trim();
    const tipoDocumentoLimpio =
      tipoDocumento.trim();
    const nombreLimpio = nombre.trim();
    const apellidosLimpios = apellidos.trim();
    const correoLimpio =
      correo.trim().toLowerCase();
    const telefonoLimpio = telefono.trim();
    const direccionLimpia = direccion.trim();
    const contrasenaLimpia =
      contrasena.trim();

    if (
      !documentoLimpio ||
      !tipoDocumentoLimpio ||
      !nombreLimpio ||
      !apellidosLimpios ||
      !correoLimpio ||
      !telefonoLimpio ||
      !direccionLimpia ||
      !contrasenaLimpia
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Todos los campos del cliente son obligatorios'
      });
    }

    const clientePorDocumento =
      await Cliente.findOne({
        documento: documentoLimpio
      });

    if (clientePorDocumento) {
      return res.status(400).json({
        success: false,
        message:
          'Ya existe un cliente con ese documento'
      });
    }

    const clientePorCorreo =
      await Cliente.findOne({
        correo: correoLimpio
      });

    if (clientePorCorreo) {
      return res.status(400).json({
        success: false,
        message:
          'Ya existe un cliente con ese correo'
      });
    }

    const contrasenaCifrada =
      await bcrypt.hash(
        contrasenaLimpia,
        10
      );

    const cliente = await Cliente.create({
      documento: documentoLimpio,
      tipoDocumento:
        tipoDocumentoLimpio,
      nombre: nombreLimpio,
      apellidos: apellidosLimpios,
      correo: correoLimpio,
      telefono: telefonoLimpio,
      direccion: direccionLimpia,
      contrasena: contrasenaCifrada
    });

    const clienteRespuesta =
      cliente.toObject();

    delete clienteRespuesta.contrasena;

    return res.status(201).json({
      success: true,
      message:
        'Cliente registrado correctamente',
      data: clienteRespuesta
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message:
          'Datos del cliente inválidos'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          'El documento o correo ya se encuentra registrado'
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Error interno al registrar el cliente'
    });
  }
};

const listarClientes = async (req, res) => {
  try {
    const clientes =
      await Cliente.find().select(
        '-contrasena'
      );

    return res.status(200).json({
      success: true,
      data: clientes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        'Error al consultar los clientes'
    });
  }
};

const obtenerMiPerfil = async (
  req,
  res
) => {
  try {
    const cliente =
      await Cliente.findById(
        req.usuario.id
      ).select('-contrasena');

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message:
          'Cliente no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: cliente
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        'Error al consultar el perfil del cliente'
    });
  }
};

const actualizarMiPerfil = async (
  req,
  res
) => {
  try {
    const clienteId = req.usuario.id;

    const clienteActual =
      await Cliente.findById(clienteId);

    if (!clienteActual) {
      return res.status(404).json({
        success: false,
        message:
          'Cliente no encontrado'
      });
    }

    const {
      nombre,
      apellidos,
      correo,
      telefono,
      direccion
    } = req.body;

    const datosActualizar = {};

    if (nombre !== undefined) {
      if (
        typeof nombre !== 'string' ||
        !nombre.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'El nombre debe tener un formato válido'
        });
      }

      datosActualizar.nombre =
        nombre.trim();
    }

    if (apellidos !== undefined) {
      if (
        typeof apellidos !== 'string' ||
        !apellidos.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Los apellidos deben tener un formato válido'
        });
      }

      datosActualizar.apellidos =
        apellidos.trim();
    }

    if (correo !== undefined) {
      if (
        typeof correo !== 'string' ||
        !correo.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'El correo debe tener un formato válido'
        });
      }

      const correoLimpio =
        correo.trim().toLowerCase();

      const clientePorCorreo =
        await Cliente.findOne({
          correo: correoLimpio,
          _id: {
            $ne: clienteId
          }
        });

      if (clientePorCorreo) {
        return res.status(400).json({
          success: false,
          message:
            'Ya existe un cliente con ese correo'
        });
      }

      datosActualizar.correo =
        correoLimpio;
    }

    if (telefono !== undefined) {
      if (
        typeof telefono !== 'string' ||
        !telefono.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'El teléfono debe tener un formato válido'
        });
      }

      datosActualizar.telefono =
        telefono.trim();
    }

    if (direccion !== undefined) {
      if (
        typeof direccion !== 'string' ||
        !direccion.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'La dirección debe tener un formato válido'
        });
      }

      datosActualizar.direccion =
        direccion.trim();
    }

    if (
      Object.keys(datosActualizar)
        .length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'No se enviaron datos válidos para actualizar'
      });
    }

    const cliente =
      await Cliente.findByIdAndUpdate(
        clienteId,
        datosActualizar,
        {
          new: true,
          runValidators: true
        }
      ).select('-contrasena');

    return res.status(200).json({
      success: true,
      message:
        'Perfil actualizado correctamente',
      data: cliente
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message:
          'Datos del perfil inválidos'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          'El correo ya se encuentra registrado'
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Error al actualizar el perfil del cliente'
    });
  }
};

const actualizarCliente = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'El identificador del cliente no es válido'
      });
    }

    const clienteActual =
      await Cliente.findById(id);

    if (!clienteActual) {
      return res.status(404).json({
        success: false,
        message:
          'Cliente no encontrado'
      });
    }

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
      if (
        typeof documento !== 'string' ||
        !documento.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'El documento debe tener un formato válido'
        });
      }

      const documentoLimpio =
        documento.trim();

      const clientePorDocumento =
        await Cliente.findOne({
          documento: documentoLimpio,
          _id: {
            $ne: id
          }
        });

      if (clientePorDocumento) {
        return res.status(400).json({
          success: false,
          message:
            'Ya existe un cliente con ese documento'
        });
      }

      datosActualizar.documento =
        documentoLimpio;
    }

    if (tipoDocumento !== undefined) {
      if (
        typeof tipoDocumento !==
          'string' ||
        !tipoDocumento.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'El tipo de documento debe tener un formato válido'
        });
      }

      datosActualizar.tipoDocumento =
        tipoDocumento.trim();
    }

    if (nombre !== undefined) {
      if (
        typeof nombre !== 'string' ||
        !nombre.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'El nombre debe tener un formato válido'
        });
      }

      datosActualizar.nombre =
        nombre.trim();
    }

    if (apellidos !== undefined) {
      if (
        typeof apellidos !== 'string' ||
        !apellidos.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Los apellidos deben tener un formato válido'
        });
      }

      datosActualizar.apellidos =
        apellidos.trim();
    }

    if (correo !== undefined) {
      if (
        typeof correo !== 'string' ||
        !correo.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'El correo debe tener un formato válido'
        });
      }

      const correoLimpio =
        correo.trim().toLowerCase();

      const clientePorCorreo =
        await Cliente.findOne({
          correo: correoLimpio,
          _id: {
            $ne: id
          }
        });

      if (clientePorCorreo) {
        return res.status(400).json({
          success: false,
          message:
            'Ya existe un cliente con ese correo'
        });
      }

      datosActualizar.correo =
        correoLimpio;
    }

    if (telefono !== undefined) {
      if (
        typeof telefono !== 'string' ||
        !telefono.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'El teléfono debe tener un formato válido'
        });
      }

      datosActualizar.telefono =
        telefono.trim();
    }

    if (direccion !== undefined) {
      if (
        typeof direccion !== 'string' ||
        !direccion.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'La dirección debe tener un formato válido'
        });
      }

      datosActualizar.direccion =
        direccion.trim();
    }

    if (estado !== undefined) {
      if (
        typeof estado !== 'string'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'El estado debe tener un formato válido'
        });
      }

      datosActualizar.estado =
        estado.trim();
    }

    const cliente =
      await Cliente.findByIdAndUpdate(
        id,
        datosActualizar,
        {
          new: true,
          runValidators: true
        }
      ).select('-contrasena');

    return res.status(200).json({
      success: true,
      message:
        'Cliente actualizado correctamente',
      data: cliente
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message:
          'Datos del cliente inválidos'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          'El documento o correo ya se encuentra registrado'
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Error al actualizar el cliente'
    });
  }
};

const eliminarCliente = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'El identificador del cliente no es válido'
      });
    }

    const cliente =
      await Cliente.findById(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message:
          'Cliente no encontrado'
      });
    }

    const tienePedidos =
      await Pedido.exists({
        cliente: id
      });

    if (tienePedidos) {
      return res.status(409).json({
        success: false,
        message:
          'No se puede eliminar el cliente porque tiene pedidos asociados'
      });
    }

    await Cliente.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        'Cliente eliminado correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        'Error al eliminar el cliente'
    });
  }
};

module.exports = {
  registrarCliente,
  listarClientes,
  obtenerMiPerfil,
  actualizarMiPerfil,
  actualizarCliente,
  eliminarCliente
};