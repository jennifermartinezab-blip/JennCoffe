const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');

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

    if (!codigo || !codigo.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El código del producto es obligatorio'
      });
    }

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del producto es obligatorio'
      });
    }

    if (!descripcion || !descripcion.trim()) {
      return res.status(400).json({
        success: false,
        message: 'La descripción del producto es obligatoria'
      });
    }

    if (!categoria) {
      return res.status(400).json({
        success: false,
        message: 'La categoría del producto es obligatoria'
      });
    }

    if (precio === undefined || precio === null || Number(precio) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser mayor que cero'
      });
    }

    if (!imagen || !imagen.trim()) {
      return res.status(400).json({
        success: false,
        message: 'La imagen del producto es obligatoria'
      });
    }

    const productoExistente = await Producto.findOne({
      codigo: codigo.trim()
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
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoria,
      precio: Number(precio),
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
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'El identificador de la categoría no es válido'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos del producto inválidos',
        error: error.message
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

    if (categoria) {
      const categoriaExistente = await Categoria.findById(categoria);

      if (!categoriaExistente) {
        return res.status(400).json({
          success: false,
          message: 'La categoría indicada no existe'
        });
      }
    }

    if (precio !== undefined && Number(precio) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser mayor que cero'
      });
    }

    const datosActualizar = {};

    if (codigo !== undefined) datosActualizar.codigo = codigo.trim();
    if (nombre !== undefined) datosActualizar.nombre = nombre.trim();
    if (descripcion !== undefined) {
      datosActualizar.descripcion = descripcion.trim();
    }
    if (categoria !== undefined) datosActualizar.categoria = categoria;
    if (precio !== undefined) datosActualizar.precio = Number(precio);
    if (imagen !== undefined) datosActualizar.imagen = imagen.trim();
    if (disponibilidad !== undefined) {
      datosActualizar.disponibilidad = disponibilidad;
    }
    if (estado !== undefined) datosActualizar.estado = estado;

    const producto = await Producto.findByIdAndUpdate(
      id,
      datosActualizar,
      {
        new: true,
        runValidators: true
      }
    ).populate('categoria', 'nombre estado');

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: producto
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'El identificador proporcionado no es válido'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos del producto inválidos',
        error: error.message
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
      message: 'Error al actualizar el producto'
    });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByIdAndDelete(id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'El identificador del producto no es válido'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el producto'
    });
  }
};

const buscarProductos = async (req, res) => {
  try {
    const { nombre, codigo, categoria } = req.query;

    const filtro = {};

    if (nombre) {
      filtro.nombre = {
        $regex: nombre,
        $options: 'i'
      };
    }

    if (codigo) {
      filtro.codigo = {
        $regex: codigo,
        $options: 'i'
      };
    }

    if (categoria) {
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
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'El identificador de la categoría no es válido'
      });
    }

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