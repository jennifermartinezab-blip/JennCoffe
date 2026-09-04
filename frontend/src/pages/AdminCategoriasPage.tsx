import { useEffect, useMemo, useState } from 'react';

import AdminLayout from '../layouts/AdminLayout';

import {
  actualizarCategoriaAdmin,
  crearCategoriaAdmin,
  eliminarCategoriaAdmin,
  obtenerCategoriasAdmin,
  type CategoriaAdmin
} from '../services/adminCategoriasService';

import './AdminCategoriasPage.css';

interface AdminCategoriasPageProps {
  onCerrarSesion: () => void;
  onIrDashboard: () => void;
  onIrProductos: () => void;
  onIrCategorias: () => void;
  onIrClientes: () => void;
  onIrPedidos: () => void;
  onIrUsuarios: () => void;
}

const CATEGORIAS_POR_PAGINA = 5;

function AdminCategoriasPage({
  onCerrarSesion,
  onIrDashboard,
  onIrProductos,
  onIrCategorias,
  onIrClientes,
  onIrPedidos,
  onIrUsuarios
}: AdminCategoriasPageProps) {
  const [categorias, setCategorias] = useState<CategoriaAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [categoriaEditando, setCategoriaEditando] =
    useState<CategoriaAdmin | null>(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Activo');

  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] =
    useState<string | null>(null);

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      setError('');

      const categoriasObtenidas =
        await obtenerCategoriasAdmin();

      setCategorias(categoriasObtenidas);
    } catch (error) {
      console.error(
        'Error al consultar categorías:',
        error
      );

      setError(
        'No fue posible consultar las categorías.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const categoriasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return categorias;
    }

    return categorias.filter((categoria) =>
      categoria.nombre
        .toLowerCase()
        .includes(texto)
    );
  }, [
    categorias,
    busqueda
  ]);

  const categoriasOrdenadas = useMemo(() => {
    return [...categoriasFiltradas].sort((a, b) =>
      a.nombre.localeCompare(
        b.nombre,
        'es'
      )
    );
  }, [categoriasFiltradas]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      categoriasOrdenadas.length /
        CATEGORIAS_POR_PAGINA
    )
  );

  const categoriasPaginaActual = useMemo(() => {
    const inicio =
      (paginaActual - 1) *
      CATEGORIAS_POR_PAGINA;

    return categoriasOrdenadas.slice(
      inicio,
      inicio + CATEGORIAS_POR_PAGINA
    );
  }, [
    categoriasOrdenadas,
    paginaActual
  ]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [
    paginaActual,
    totalPaginas
  ]);

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setEstado('Activo');
    setCategoriaEditando(null);
  };

  const abrirCrearCategoria = () => {
    limpiarFormulario();

    setError('');
    setMensaje('');
    setMostrarFormulario(true);
  };

  const abrirEditarCategoria = (
    categoria: CategoriaAdmin
  ) => {
    setCategoriaEditando(categoria);

    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion || '');
    setEstado(categoria.estado || 'Activo');

    setError('');
    setMensaje('');
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  const guardarCategoria = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!nombre.trim()) {
      setError(
        'El nombre de la categoría es obligatorio.'
      );
      return;
    }

    try {
      setGuardando(true);
      setError('');
      setMensaje('');

      if (categoriaEditando) {
        const categoriaActualizada =
          await actualizarCategoriaAdmin(
            categoriaEditando._id,
            {
              nombre: nombre.trim(),
              descripcion: descripcion.trim(),
              estado
            }
          );

        setCategorias((categoriasActuales) =>
          categoriasActuales.map(
            (categoria) =>
              categoria._id ===
              categoriaActualizada._id
                ? categoriaActualizada
                : categoria
          )
        );

        setMensaje(
          'Categoría actualizada correctamente.'
        );
      } else {
        const categoriaCreada =
          await crearCategoriaAdmin({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            estado
          });

        setCategorias((categoriasActuales) => [
          categoriaCreada,
          ...categoriasActuales
        ]);

        setPaginaActual(1);

        setMensaje(
          'Categoría creada correctamente.'
        );
      }

      cerrarFormulario();
    } catch (error: any) {
      console.error(
        'Error al guardar categoría:',
        error
      );

      const mensajeBackend =
        error?.response?.data?.message;

      setError(
        mensajeBackend ||
          'No fue posible guardar la categoría.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminarCategoria = async (
    categoria: CategoriaAdmin
  ) => {
    const confirmado = window.confirm(
      `¿Deseas eliminar la categoría "${categoria.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    try {
      setEliminandoId(categoria._id);
      setError('');
      setMensaje('');

      await eliminarCategoriaAdmin(
        categoria._id
      );

      setCategorias((categoriasActuales) =>
        categoriasActuales.filter(
          (item) =>
            item._id !== categoria._id
        )
      );

      setMensaje(
        'Categoría eliminada correctamente.'
      );
    } catch (error: any) {
      console.error(
        'Error al eliminar categoría:',
        error
      );

      const mensajeBackend =
        error?.response?.data?.message;

      setError(
        mensajeBackend ||
          'No fue posible eliminar la categoría.'
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

  return (
    <AdminLayout
      vistaActiva="categorias"
      onIrDashboard={onIrDashboard}
      onIrProductos={onIrProductos}
      onIrCategorias={onIrCategorias}
      onIrClientes={onIrClientes}
      onIrPedidos={onIrPedidos}
      onIrUsuarios={onIrUsuarios}
      onCerrarSesion={onCerrarSesion}
    >
      <main className="admin-categorias-page">
        <section className="admin-categorias-panel">
          <header className="admin-categorias-panel__header">
            <div>
              <h1 className="admin-categorias-page__title">
                Categorías
              </h1>

              <p className="admin-categorias-page__subtitle">
                Gestión de categorías del catálogo.
              </p>
            </div>

            <button
              type="button"
              className="admin-categorias-page__new-button"
              onClick={abrirCrearCategoria}
            >
              + Nueva categoría
            </button>
          </header>

          <div className="admin-categorias-search">
            <input
              type="search"
              value={busqueda}
              onChange={(event) =>
                setBusqueda(event.target.value)
              }
              placeholder="Buscar categoría..."
            />
          </div>

          {error && (
            <p
              className="admin-categorias-page__error"
              role="alert"
            >
              {error}
            </p>
          )}

          {mensaje && (
            <p className="admin-categorias-page__success">
              {mensaje}
            </p>
          )}

          {mostrarFormulario && (
            <section className="admin-categorias-form-card">
              <div className="admin-categorias-form-card__header">
                <h2>
                  {categoriaEditando
                    ? 'Editar categoría'
                    : 'Nueva categoría'}
                </h2>

                <button
                  type="button"
                  onClick={cerrarFormulario}
                >
                  ×
                </button>
              </div>

              <form
                className="admin-categorias-form"
                onSubmit={guardarCategoria}
              >
                <label className="admin-categorias-form__field">
                  <span>Nombre</span>

                  <input
                    type="text"
                    value={nombre}
                    onChange={(event) =>
                      setNombre(event.target.value)
                    }
                  />
                </label>

                <label className="admin-categorias-form__field admin-categorias-form__field--full">
                  <span>Descripción</span>

                  <textarea
                    rows={3}
                    value={descripcion}
                    onChange={(event) =>
                      setDescripcion(
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="admin-categorias-form__field">
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

                <div className="admin-categorias-form__actions">
                  <button
                    type="button"
                    className="admin-categorias-form__cancel"
                    onClick={cerrarFormulario}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="admin-categorias-form__save"
                    disabled={guardando}
                  >
                    {guardando
                      ? 'Guardando...'
                      : categoriaEditando
                        ? 'Guardar cambios'
                        : 'Crear categoría'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {cargando ? (
            <p className="admin-categorias-page__loading">
              Cargando categorías...
            </p>
          ) : categoriasOrdenadas.length === 0 ? (
            <p className="admin-categorias-page__empty">
              No hay categorías para mostrar.
            </p>
          ) : (
            <>
              <div className="admin-categorias-table-wrapper">
                <table className="admin-categorias-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {categoriasPaginaActual.map(
                      (categoria) => (
                        <tr key={categoria._id}>
                          <td>
                            <strong>
                              {categoria.nombre}
                            </strong>
                          </td>

                          <td>
                            {categoria.descripcion ||
                              'Sin descripción'}
                          </td>

                          <td>
                            <span
                              className={
                                categoria.estado ===
                                  'Inactivo'
                                  ? 'admin-categorias-table__status admin-categorias-table__status--inactivo'
                                  : 'admin-categorias-table__status admin-categorias-table__status--activo'
                              }
                            >
                              {categoria.estado ||
                                'Activo'}
                            </span>
                          </td>

                          <td>
                            <div className="admin-categorias-table__actions">
                              <button
                                type="button"
                                title="Editar"
                                onClick={() =>
                                  abrirEditarCategoria(
                                    categoria
                                  )
                                }
                              >
                                ✎
                              </button>

                              <button
                                type="button"
                                title="Eliminar"
                                className="admin-categorias-table__delete"
                                disabled={
                                  eliminandoId ===
                                  categoria._id
                                }
                                onClick={() =>
                                  eliminarCategoria(
                                    categoria
                                  )
                                }
                              >
                                {eliminandoId ===
                                categoria._id
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
                <nav className="admin-categorias-pagination">
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
                              ? 'admin-categorias-pagination__active'
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

export default AdminCategoriasPage;