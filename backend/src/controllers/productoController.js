const mongoose = require('mongoose');

const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const Pedido = require('../models/Pedido');

const escaparRegex = (texto) => {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const crearProducto = async (req, res) => {
  try {
    const {
      codigo,
      nombre,
      descripcion,
      categoria,
      precio,
      imagen,
      disponibilidad,
      estado
    } = req.body;

    if (
      typeof codigo !== 'string' ||
      !codigo.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'El código del producto es obligatorio'
      });
    }

    if (
      typeof nombre !== 'string' ||
      !nombre.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del producto es obligatorio'
      });
    }

    if (
      typeof descripcion !== 'string' ||
      !descripcion.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'La descripción del producto es obligatoria'
      });
    }

    if (
      typeof categoria !== 'string' ||
      !mongoose.Types.ObjectId.isValid(categoria)
    ) {
      return res.status(400).json({
        success: false,
        message: 'El identificador de la categoría no es válido'
      });
    }

    const precioNumerico = Number(precio);

    if (
      precio === undefined ||
      precio === null ||
      !Number.isFinite(precioNumerico) ||
      precioNumerico <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número mayor que cero'
      });
    }

    if (
      typeof imagen !== 'string' ||
      !imagen.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'La imagen del producto es obligatoria'
      });
    }

    if (
      disponibilidad !== undefined &&
      typeof disponibilidad !== 'boolean'
    ) {
      return res.status(400).json({
        success: false,
        message: 'La disponibilidad debe ser verdadera o falsa'
      });
    }

    const codigoLimpio = codigo.trim().toUpperCase();

    const productoExistente = await Producto.findOne({
      codigo: {
        $regex: `^${escaparRegex(codigoLimpio)}$`,
        $options: 'i'
      }
    });

    if (productoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un producto con ese código'
      });
    }

    const categoriaExistente = await Categoria.findById(categoria);

    if (!categoriaExistente) {
      return res.status(400).json({
        success: false,
        message: 'La categoría indicada no existe'
      });
    }

    const producto = await Producto.create({
      codigo: codigoLimpio,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoria,
      precio: precioNumerico,
      imagen: imagen.trim(),
      disponibilidad,
      estado
    });

    const productoCreado = await Producto.findById(producto._id).populate(
      'categoria',
      'nombre estado'
    );

    return res.status(201).json({
      success: true,
      message: 'Producto registrado correctamente',
      data: productoCreado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos del producto inválidos'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un producto con ese código'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al registrar el producto'
    });
  }
};

const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate(
      'categoria',
      'nombre estado'
    );

    return res.status(200).json({
      success: true,
      data: productos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al consultar los productos'
    });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      codigo,
      nombre,
      descripcion,
      categoria,
      precio,
      imagen,
      disponibilidad,
      estado
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador del producto no es válido'
      });
    }

    const productoActual = await Producto.findById(id);

    if (!productoActual) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const datosActualizar = {};

    if (codigo !== undefined) {
      if (
        typeof codigo !== 'string' ||
        !codigo.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: 'El código del producto no puede estar vacío'
        });
      }

      const codigoLimpio = codigo.trim().toUpperCase();

      const productoDuplicado = await Producto.findOne({
        _id: { $ne: id },
        codigo: {
          $regex: `^${escaparRegex(codigoLimpio)}$`,
          $options: 'i'
        }
      });

      if (productoDuplicado) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro producto con ese código'
        });
      }

      datosActualizar.codigo = codigoLimpio;
    }

    if (nombre !== undefined) {
      if (
        typeof nombre !== 'string' ||
        !nombre.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: 'El nombre del producto no puede estar vacío'
        });
      }

      datosActualizar.nombre = nombre.trim();
    }

    if (descripcion !== undefined) {
      if (
        typeof descripcion !== 'string' ||
        !descripcion.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: 'La descripción del producto no puede estar vacía'
        });
      }

      datosActualizar.descripcion = descripcion.trim();
    }

    if (categoria !== undefined) {
      if (
        typeof categoria !== 'string' ||
        !mongoose.Types.ObjectId.isValid(categoria)
      ) {
        return res.status(400).json({
          success: false,
          message: 'El identificador de la categoría no es válido'
        });
      }

      const categoriaExistente = await Categoria.findById(categoria);

      if (!categoriaExistente) {
        return res.status(400).json({
          success: false,
          message: 'La categoría indicada no existe'
        });
      }

      datosActualizar.categoria = categoria;
    }

    if (precio !== undefined) {
      const precioNumerico = Number(precio);

      if (
        !Number.isFinite(precioNumerico) ||
        precioNumerico <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'El precio debe ser un número mayor que cero'
        });
      }

      datosActualizar.precio = precioNumerico;
    }

    if (imagen !== undefined) {
      if (
        typeof imagen !== 'string' ||
        !imagen.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: 'La imagen del producto no puede estar vacía'
        });
      }

      datosActualizar.imagen = imagen.trim();
    }

    if (disponibilidad !== undefined) {
      if (typeof disponibilidad !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'La disponibilidad debe ser verdadera o falsa'
        });
      }

      datosActualizar.disponibilidad = disponibilidad;
    }

    if (estado !== undefined) {
      datosActualizar.estado = estado;
    }

    const producto = await Producto.findByIdAndUpdate(
      id,
      datosActualizar,
      {
        new: true,
        runValidators: true
      }
    ).populate(
      'categoria',
      'nombre estado'
    );

    return res.status(200).json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: producto
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos del producto inválidos'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro producto con ese código'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al actualizar el producto'
    });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador del producto no es válido'
      });
    }

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const pedidoAsociado = await Pedido.exists({
      'productos.producto': id
    });

    if (pedidoAsociado) {
      return res.status(409).json({
        success: false,
        message:
          'No se puede eliminar el producto porque está asociado a pedidos registrados'
      });
    }

    await Producto.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al eliminar el producto'
    });
  }
};

const buscarProductos = async (req, res) => {
  try {
    const {
      nombre,
      codigo,
      categoria
    } = req.query;

    const filtro = {};

    if (nombre) {
      filtro.nombre = {
        $regex: escaparRegex(nombre),
        $options: 'i'
      };
    }

    if (codigo) {
      filtro.codigo = {
        $regex: escaparRegex(codigo),
        $options: 'i'
      };
    }

    if (categoria) {
      if (!mongoose.Types.ObjectId.isValid(categoria)) {
        return res.status(400).json({
          success: false,
          message: 'El identificador de la categoría no es válido'
        });
      }

      filtro.categoria = categoria;
    }

    const productos = await Producto.find(filtro).populate(
      'categoria',
      'nombre estado'
    );

    return res.status(200).json({
      success: true,
      data: productos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al buscar productos'
    });
  }
};

module.exports = {
  crearProducto,
  listarProductos,
  actualizarProducto,
  eliminarProducto,
  buscarProductos
};