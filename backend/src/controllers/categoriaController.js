const mongoose = require('mongoose');

const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');

const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, estado } = req.body;

    // Validar nombre obligatorio y tipo de dato
    if (
      typeof nombre !== 'string' ||
      !nombre.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría es obligatorio'
      });
    }

    // Validar descripción si fue enviada
    if (
      descripcion !== undefined &&
      typeof descripcion !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'La descripción de la categoría debe ser texto'
      });
    }

    const nombreLimpio = nombre.trim();

    // Evitar duplicados sin importar mayúsculas o minúsculas
    const categoriaExistente = await Categoria.findOne({
      nombre: {
        $regex: `^${nombreLimpio.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
        $options: 'i'
      }
    });

    if (categoriaExistente) {
      return res.status(400).json({
        success: false,
        message: 'La categoría ya existe'
      });
    }

    const categoria = await Categoria.create({
      nombre: nombreLimpio,
      descripcion:
        descripcion !== undefined
          ? descripcion.trim()
          : '',
      estado
    });

    return res.status(201).json({
      success: true,
      message: 'Categoría registrada correctamente',
      data: categoria
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de categoría inválidos'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'La categoría ya existe'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al registrar la categoría'
    });
  }
};

const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();

    return res.status(200).json({
      success: true,
      data: categorias
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al consultar las categorías'
    });
  }
};

const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    // Validar ObjectId antes de consultar MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador de la categoría no es válido'
      });
    }

    const categoriaActual = await Categoria.findById(id);

    if (!categoriaActual) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    const datosActualizar = {};

    if (nombre !== undefined) {
      if (
        typeof nombre !== 'string' ||
        !nombre.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de la categoría no puede estar vacío'
        });
      }

      const nombreLimpio = nombre.trim();

      // Comprobar que otra categoría no tenga ese nombre
      const categoriaDuplicada = await Categoria.findOne({
        _id: { $ne: id },
        nombre: {
          $regex: `^${nombreLimpio.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
          $options: 'i'
        }
      });

      if (categoriaDuplicada) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otra categoría con ese nombre'
        });
      }

      datosActualizar.nombre = nombreLimpio;
    }

    if (descripcion !== undefined) {
      if (typeof descripcion !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'La descripción de la categoría debe ser texto'
        });
      }

      datosActualizar.descripcion = descripcion.trim();
    }

    if (estado !== undefined) {
      datosActualizar.estado = estado;
    }

    const categoria = await Categoria.findByIdAndUpdate(
      id,
      datosActualizar,
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Categoría actualizada correctamente',
      data: categoria
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de categoría inválidos'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otra categoría con ese nombre'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al actualizar la categoría'
    });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ObjectId antes de consultar MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'El identificador de la categoría no es válido'
      });
    }

    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Proteger la integridad de los productos relacionados
    const tieneProductos = await Producto.exists({
      categoria: id
    });

    if (tieneProductos) {
      return res.status(409).json({
        success: false,
        message:
          'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }

    await Categoria.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Categoría eliminada correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al eliminar la categoría'
    });
  }
};

module.exports = {
  crearCategoria,
  listarCategorias,
  actualizarCategoria,
  eliminarCategoria
};