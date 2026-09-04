import { useEffect, useMemo, useState } from 'react';

import AdminLayout from '../layouts/AdminLayout';

import {
  actualizarProductoAdmin,
  crearProductoAdmin,
  eliminarProductoAdmin,
  obtenerProductosAdmin,
  type ProductoAdmin
} from '../services/adminProductosService';

import {
  obtenerCategoriasAdmin,
  type CategoriaAdmin
} from '../services/adminCategoriasService';

import './AdminProductosPage.css';

interface AdminProductosPageProps {
  onCerrarSesion: () => void;
  onIrDashboard: () => void;
  onIrProductos: () => void;
  onIrCategorias: () => void;
  onIrClientes: () => void;
  onIrPedidos: () => void;
  onIrUsuarios: () => void;
}

const PRODUCTOS_POR_PAGINA = 5;

function AdminProductosPage({
  onCerrarSesion,
  onIrDashboard,
  onIrProductos,
  onIrCategorias,
  onIrClientes,
  onIrPedidos,
  onIrUsuarios
}: AdminProductosPageProps) {
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [categorias, setCategorias] = useState<CategoriaAdmin[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [productoEditando, setProductoEditando] =
    useState<ProductoAdmin | null>(null);

  const [productoDetalle, setProductoDetalle] =
    useState<ProductoAdmin | null>(null);

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [disponibilidad, setDisponibilidad] =
    useState(true);
  const [estado, setEstado] = useState('Activo');

  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] =
    useState<string | null>(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError('');

      const [
        productosObtenidos,
        categoriasObtenidas
      ] = await Promise.all([
        obtenerProductosAdmin(),
        obtenerCategoriasAdmin()
      ]);

      setProductos(productosObtenidos);
      setCategorias(categoriasObtenidas);
    } catch (error) {
      console.error(
        'Error al cargar productos:',
        error
      );

      setError(
        'No fue posible consultar los productos.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const obtenerCategoriaId = (
    producto: ProductoAdmin
  ) => {
    if (typeof producto.categoria === 'string') {
      return producto.categoria;
    }

    return producto.categoria._id;
  };

  const obtenerNombreCategoria = (
    producto: ProductoAdmin
  ) => {
    if (typeof producto.categoria === 'string') {
      const categoriaEncontrada =
        categorias.find(
          (categoria) =>
            categoria._id === producto.categoria
        );

      return categoriaEncontrada?.nombre || 'Sin categoría';
    }

    return producto.categoria.nombre;
  };

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const categoriaNombre =
        obtenerNombreCategoria(producto).toLowerCase();

      const coincideBusqueda =
        !texto ||
        producto.codigo.toLowerCase().includes(texto) ||
        producto.nombre.toLowerCase().includes(texto) ||
        categoriaNombre.includes(texto);

      const coincideCategoria =
        !categoriaFiltro ||
        obtenerCategoriaId(producto) ===
          categoriaFiltro;

      return coincideBusqueda && coincideCategoria;
    });
  }, [
    productos,
    busqueda,
    categoriaFiltro,
    categorias
  ]);

  const productosOrdenados = useMemo(() => {
    return [...productosFiltrados].sort((a, b) => {
      return a.codigo.localeCompare(
        b.codigo,
        'es',
        {
          numeric: true
        }
      );
    });
  }, [productosFiltrados]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      productosOrdenados.length /
        PRODUCTOS_POR_PAGINA
    )
  );

  const productosPaginaActual = useMemo(() => {
    const inicio =
      (paginaActual - 1) *
      PRODUCTOS_POR_PAGINA;

    return productosOrdenados.slice(
      inicio,
      inicio + PRODUCTOS_POR_PAGINA
    );
  }, [
    productosOrdenados,
    paginaActual
  ]);

  useEffect(() => {
    setPaginaActual(1);
  }, [
    busqueda,
    categoriaFiltro
  ]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [
    paginaActual,
    totalPaginas
  ]);

  const limpiarFormulario = () => {
    setCodigo('');
    setNombre('');
    setDescripcion('');
    setCategoriaId('');
    setPrecio('');
    setImagen('');
    setDisponibilidad(true);
    setEstado('Activo');
    setProductoEditando(null);
  };

  const abrirCrearProducto = () => {
    limpiarFormulario();

    setError('');
    setMensaje('');

    if (categorias.length > 0) {
      setCategoriaId(categorias[0]._id);
    }

    setMostrarFormulario(true);
  };

  const abrirEditarProducto = (
    producto: ProductoAdmin
  ) => {
    setProductoEditando(producto);

    setCodigo(producto.codigo);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setCategoriaId(
      obtenerCategoriaId(producto)
    );
    setPrecio(String(producto.precio));
    setImagen(producto.imagen);
    setDisponibilidad(
      producto.disponibilidad
    );
    setEstado(producto.estado);

    setError('');
    setMensaje('');
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  const guardarProducto = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!codigo.trim()) {
      setError('El código es obligatorio.');
      return;
    }

    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    if (!descripcion.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }

    if (!categoriaId) {
      setError('Debes seleccionar una categoría.');
      return;
    }

    const precioNumerico = Number(precio);

    if (
      !Number.isFinite(precioNumerico) ||
      precioNumerico <= 0
    ) {
      setError(
        'El precio debe ser mayor que cero.'
      );
      return;
    }

    if (!imagen.trim()) {
      setError('La imagen es obligatoria.');
      return;
    }

    try {
      setGuardando(true);
      setError('');
      setMensaje('');

      const datosProducto = {
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        categoria: categoriaId,
        precio: precioNumerico,
        imagen: imagen.trim(),
        disponibilidad,
        estado
      };

      if (productoEditando) {
        const productoActualizado =
          await actualizarProductoAdmin(
            productoEditando._id,
            datosProducto
          );

        setProductos((productosActuales) =>
          productosActuales.map(
            (producto) =>
              producto._id ===
              productoActualizado._id
                ? productoActualizado
                : producto
          )
        );

        setMensaje(
          'Producto actualizado correctamente.'
        );
      } else {
        const productoCreado =
          await crearProductoAdmin(
            datosProducto
          );

        setProductos((productosActuales) => [
          productoCreado,
          ...productosActuales
        ]);

        setPaginaActual(1);

        setMensaje(
          'Producto creado correctamente.'
        );
      }

      cerrarFormulario();
    } catch (error: any) {
      console.error(
        'Error al guardar producto:',
        error
      );

      const mensajeBackend =
        error?.response?.data?.message;

      setError(
        mensajeBackend ||
          'No fue posible guardar el producto.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminarProducto = async (
    producto: ProductoAdmin
  ) => {
    const confirmado = window.confirm(
      `¿Deseas eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    try {
      setEliminandoId(producto._id);
      setError('');
      setMensaje('');

      await eliminarProductoAdmin(
        producto._id
      );

      setProductos((productosActuales) =>
        productosActuales.filter(
          (item) =>
            item._id !== producto._id
        )
      );

      setMensaje(
        'Producto eliminado correctamente.'
      );
    } catch (error: any) {
      console.error(
        'Error al eliminar producto:',
        error
      );

      const mensajeBackend =
        error?.response?.data?.message;

      setError(
        mensajeBackend ||
          'No fue posible eliminar el producto.'
      );
    } finally {
      setEliminandoId(null);
    }
  };

  const cambiarPagina = (
    nuevaPagina: number
  ) => {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas
    ) {
      return;
    }

    setPaginaActual(nuevaPagina);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const obtenerRutaImagen = (
    imagenProducto: string
  ) => {
    if (
      imagenProducto.startsWith('http://') ||
      imagenProducto.startsWith('https://') ||
      imagenProducto.startsWith('/')
    ) {
      return imagenProducto;
    }

    return `/images/products/${imagenProducto}`;
  };

  return (
    <AdminLayout
      vistaActiva="productos"
      onIrDashboard={onIrDashboard}
      onIrProductos={onIrProductos}
      onIrCategorias={onIrCategorias}
      onIrClientes={onIrClientes}
      onIrPedidos={onIrPedidos}
      onIrUsuarios={onIrUsuarios}
      onCerrarSesion={onCerrarSesion}
    >
      <main className="admin-productos-page">
        <section className="admin-productos-panel">
          <header className="admin-productos-panel__header">
            <div>
              <h1 className="admin-productos-page__title">
                Productos
              </h1>

              <p className="admin-productos-page__subtitle">
                Gestión del catálogo de JennCoffee.
              </p>
            </div>

            <button
              type="button"
              className="admin-productos-page__new-button"
              onClick={abrirCrearProducto}
            >
              + Nuevo producto
            </button>
          </header>

          <div className="admin-productos-toolbar">
            <div className="admin-productos-search">
              <span className="admin-productos-search__icon">
                ⌕
              </span>

              <input
                type="search"
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(event.target.value)
                }
                placeholder="Buscar producto..."
                aria-label="Buscar productos"
              />
            </div>

            <select
              className="admin-productos-filter"
              value={categoriaFiltro}
              onChange={(event) =>
                setCategoriaFiltro(
                  event.target.value
                )
              }
              aria-label="Filtrar por categoría"
            >
              <option value="">
                Filtrar
              </option>

              {categorias.map(
                (categoria) => (
                  <option
                    key={categoria._id}
                    value={categoria._id}
                  >
                    {categoria.nombre}
                  </option>
                )
              )}
            </select>
          </div>

          {error && (
            <p
              className="admin-productos-page__error"
              role="alert"
            >
              {error}
            </p>
          )}

          {mensaje && (
            <p className="admin-productos-page__success">
              {mensaje}
            </p>
          )}

          {mostrarFormulario && (
            <section className="admin-productos-form-card">
              <div className="admin-productos-form-card__header">
                <h2>
                  {productoEditando
                    ? 'Editar producto'
                    : 'Nuevo producto'}
                </h2>

                <button
                  type="button"
                  className="admin-productos-form-card__close"
                  onClick={cerrarFormulario}
                >
                  ×
                </button>
              </div>

              <form
                className="admin-productos-form"
                onSubmit={guardarProducto}
              >
                <label className="admin-productos-form__field">
                  <span>Código</span>

                  <input
                    type="text"
                    value={codigo}
                    onChange={(event) =>
                      setCodigo(event.target.value)
                    }
                  />
                </label>

                <label className="admin-productos-form__field">
                  <span>Nombre</span>

                  <input
                    type="text"
                    value={nombre}
                    onChange={(event) =>
                      setNombre(event.target.value)
                    }
                  />
                </label>

                <label className="admin-productos-form__field admin-productos-form__field--full">
                  <span>Descripción</span>

                  <textarea
                    value={descripcion}
                    onChange={(event) =>
                      setDescripcion(
                        event.target.value
                      )
                    }
                    rows={3}
                  />
                </label>

                <label className="admin-productos-form__field">
                  <span>Categoría</span>

                  <select
                    value={categoriaId}
                    onChange={(event) =>
                      setCategoriaId(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Selecciona una categoría
                    </option>

                    {categorias.map(
                      (categoria) => (
                        <option
                          key={categoria._id}
                          value={categoria._id}
                        >
                          {categoria.nombre}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="admin-productos-form__field">
                  <span>Precio</span>

                  <input
                    type="number"
                    min="1"
                    value={precio}
                    onChange={(event) =>
                      setPrecio(event.target.value)
                    }
                  />
                </label>

                <label className="admin-productos-form__field admin-productos-form__field--full">
                  <span>Imagen</span>

                  <input
                    type="text"
                    value={imagen}
                    onChange={(event) =>
                      setImagen(event.target.value)
                    }
                  />
                </label>

                <label className="admin-productos-form__field">
                  <span>Disponibilidad</span>

                  <select
                    value={
                      disponibilidad
                        ? 'Disponible'
                        : 'No disponible'
                    }
                    onChange={(event) =>
                      setDisponibilidad(
                        event.target.value ===
                          'Disponible'
                      )
                    }
                  >
                    <option value="Disponible">
                      Disponible
                    </option>

                    <option value="No disponible">
                      No disponible
                    </option>
                  </select>
                </label>

                <label className="admin-productos-form__field">
                  <span>Estado</span>

                  <select
                    value={estado}
                    onChange={(event) =>
                      setEstado(event.target.value)
                    }
                  >
                    <option value="Activo">
                      Activo
                    </option>

                    <option value="Inactivo">
                      Inactivo
                    </option>
                  </select>
                </label>

                <div className="admin-productos-form__actions">
                  <button
                    type="button"
                    className="admin-productos-form__cancel"
                    onClick={cerrarFormulario}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="admin-productos-form__save"
                    disabled={guardando}
                  >
                    {guardando
                      ? 'Guardando...'
                      : productoEditando
                        ? 'Guardar cambios'
                        : 'Crear producto'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {productoDetalle && (
            <section className="admin-productos-detail">
              <div className="admin-productos-detail__header">
                <h2>
                  Detalle del producto
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setProductoDetalle(null)
                  }
                >
                  ×
                </button>
              </div>

              <div className="admin-productos-detail__content">
                <img
                  src={obtenerRutaImagen(
                    productoDetalle.imagen
                  )}
                  alt={productoDetalle.nombre}
                />

                <div>
                  <strong>
                    {productoDetalle.codigo}
                  </strong>

                  <h3>
                    {productoDetalle.nombre}
                  </h3>

                  <p>
                    {productoDetalle.descripcion}
                  </p>

                  <span>
                    Categoría:{' '}
                    {obtenerNombreCategoria(
                      productoDetalle
                    )}
                  </span>

                  <span>
                    Precio: $
                    {productoDetalle.precio.toLocaleString(
                      'es-CO'
                    )}
                  </span>

                  <span>
                    Disponibilidad:{' '}
                    {productoDetalle.disponibilidad
                      ? 'Disponible'
                      : 'No disponible'}
                  </span>
                </div>
              </div>
            </section>
          )}

          {cargando ? (
            <p className="admin-productos-page__loading">
              Cargando productos...
            </p>
          ) : productosOrdenados.length === 0 ? (
            <p className="admin-productos-page__empty">
              No hay productos para mostrar.
            </p>
          ) : (
            <>
              <div className="admin-productos-table-wrapper">
                <table className="admin-productos-table">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {productosPaginaActual.map(
                      (producto) => (
                        <tr key={producto._id}>
                          <td>
                            <img
                              className="admin-productos-table__image"
                              src={obtenerRutaImagen(
                                producto.imagen
                              )}
                              alt={producto.nombre}
                            />
                          </td>

                          <td>
                            {producto.codigo}
                          </td>

                          <td>
                            {producto.nombre}
                          </td>

                          <td>
                            {obtenerNombreCategoria(
                              producto
                            )}
                          </td>

                          <td>
                            $
                            {producto.precio.toLocaleString(
                              'es-CO'
                            )}
                          </td>

                          <td>
                            <span
                              className={
                                producto.estado === 'Activo'
                                  ? 'admin-productos-table__status admin-productos-table__status--activo'
                                  : 'admin-productos-table__status admin-productos-table__status--inactivo'
                              }
                            >
                              {producto.estado}
                            </span>
                          </td>

                          <td>
                            <div className="admin-productos-table__actions">
                              <button
                                type="button"
                                title="Editar"
                                onClick={() =>
                                  abrirEditarProducto(
                                    producto
                                  )
                                }
                              >
                                ✎
                              </button>

                              <button
                                type="button"
                                title="Ver"
                                onClick={() =>
                                  setProductoDetalle(
                                    producto
                                  )
                                }
                              >
                                ◉
                              </button>

                              <button
                                type="button"
                                title="Eliminar"
                                className="admin-productos-table__delete"
                                disabled={
                                  eliminandoId ===
                                  producto._id
                                }
                                onClick={() =>
                                  eliminarProducto(
                                    producto
                                  )
                                }
                              >
                                {eliminandoId ===
                                producto._id
                                  ? '…'
                                  : '🗑'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {totalPaginas > 1 && (
                <nav className="admin-productos-pagination">
                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() =>
                      cambiarPagina(
                        paginaActual - 1
                      )
                    }
                  >
                    ← Anterior
                  </button>

                  {Array.from(
                    {
                      length: totalPaginas
                    },
                    (_, index) => {
                      const numeroPagina =
                        index + 1;

                      return (
                        <button
                          key={numeroPagina}
                          type="button"
                          className={
                            paginaActual ===
                            numeroPagina
                              ? 'admin-productos-pagination__active'
                              : ''
                          }
                          onClick={() =>
                            cambiarPagina(
                              numeroPagina
                            )
                          }
                        >
                          {numeroPagina}
                        </button>
                      );
                    }
                  )}

                  <button
                    type="button"
                    disabled={
                      paginaActual ===
                      totalPaginas
                    }
                    onClick={() =>
                      cambiarPagina(
                        paginaActual + 1
                      )
                    }
                  >
                    Siguiente →
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </main>
    </AdminLayout>
  );
}

export default AdminProductosPage;