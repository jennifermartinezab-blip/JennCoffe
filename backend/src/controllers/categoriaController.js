const Categoria = require('../models/Categoria');

const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, estado } = req.body;

    const categoriaExistente = await Categoria.findOne({ nombre });

    if (categoriaExistente) {
      return res.status(400).json({
        success: false,
        message: 'La categoría ya existe'
      });
    }

    const categoria = await Categoria.create({
      nombre,
      descripcion,
      estado
    });

    return res.status(201).json({
      success: true,
      message: 'Categoría registrada correctamente',
      data: categoria
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al registrar la categoría',
      error: error.message
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
      message: 'Error al consultar las categorías',
      error: error.message
    });
  }
};

const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    const categoria = await Categoria.findByIdAndUpdate(
      id,
      { nombre, descripcion, estado },
      {
        new: true,
        runValidators: true
      }
    );

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Categoría actualizada correctamente',
      data: categoria
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la categoría',
      error: error.message
    });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndDelete(id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Categoría eliminada correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la categoría',
      error: error.message
    });
  }
};

module.exports = {
  crearCategoria,
  listarCategorias,
  actualizarCategoria,
  eliminarCategoria
};