import { useEffect, useMemo, useState } from 'react';

import AdminLayout from '../layouts/AdminLayout';

import {
  actualizarClienteAdmin,
  eliminarClienteAdmin,
  obtenerClientesAdmin,
  type ClienteAdmin
} from '../services/adminClientesService';

import './AdminClientesPage.css';

interface AdminClientesPageProps {
  onCerrarSesion: () => void;
  onIrDashboard: () => void;
  onIrProductos: () => void;
  onIrCategorias: () => void;
  onIrClientes: () => void;
  onIrPedidos: () => void;
  onIrUsuarios: () => void;
}

const CLIENTES_POR_PAGINA = 5;

function AdminClientesPage({
  onCerrarSesion,
  onIrDashboard,
  onIrProductos,
  onIrCategorias,
  onIrClientes,
  onIrPedidos,
  onIrUsuarios
}: AdminClientesPageProps) {
  const [clientes, setClientes] = useState<ClienteAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [clienteEditando, setClienteEditando] =
    useState<ClienteAdmin | null>(null);

  const [documento, setDocumento] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estado, setEstado] = useState('Activo');

  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] =
    useState<string | null>(null);

  const cargarClientes = async () => {
    try {
      setCargando(true);
      setError('');

      const clientesObtenidos =
        await obtenerClientesAdmin();

      setClientes(clientesObtenidos);
    } catch (error) {
      console.error(
        'Error al consultar clientes:',
        error
      );

      setError(
        'No fue posible consultar los clientes.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const clientesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return clientes;
    }

    return clientes.filter((cliente) => {
      const nombreCompleto =
        `${cliente.nombre} ${cliente.apellidos}`.toLowerCase();

      return (
        cliente.documento.toLowerCase().includes(texto) ||
        nombreCompleto.includes(texto) ||
        cliente.correo.toLowerCase().includes(texto) ||
        cliente.telefono.toLowerCase().includes(texto)
      );
    });
  }, [
    clientes,
    busqueda
  ]);

  const clientesOrdenados = useMemo(() => {
    return [...clientesFiltrados].sort((a, b) => {
      const nombreA =
        `${a.nombre} ${a.apellidos}`;

      const nombreB =
        `${b.nombre} ${b.apellidos}`;

      return nombreA.localeCompare(
        nombreB,
        'es'
      );
    });
  }, [clientesFiltrados]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      clientesOrdenados.length /
        CLIENTES_POR_PAGINA
    )
  );

  const clientesPaginaActual = useMemo(() => {
    const inicio =
      (paginaActual - 1) *
      CLIENTES_POR_PAGINA;

    return clientesOrdenados.slice(
      inicio,
      inicio + CLIENTES_POR_PAGINA
    );
  }, [
    clientesOrdenados,
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

  const abrirEditarCliente = (
    cliente: ClienteAdmin
  ) => {
    setClienteEditando(cliente);

    setDocumento(cliente.documento);
    setTipoDocumento(cliente.tipoDocumento);
    setNombre(cliente.nombre);
    setApellidos(cliente.apellidos);
    setCorreo(cliente.correo);
    setTelefono(cliente.telefono);
    setDireccion(cliente.direccion);
    setEstado(cliente.estado || 'Activo');

    setError('');
    setMensaje('');
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setClienteEditando(null);
    setMostrarFormulario(false);
  };

  const guardarCliente = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!clienteEditando) {
      return;
    }

    if (!documento.trim()) {
      setError('El documento es obligatorio.');
      return;
    }

    if (!tipoDocumento.trim()) {
      setError(
        'El tipo de documento es obligatorio.'
      );
      return;
    }

    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    if (!apellidos.trim()) {
      setError('Los apellidos son obligatorios.');
      return;
    }

    if (!correo.trim()) {
      setError('El correo es obligatorio.');
      return;
    }

    if (!telefono.trim()) {
      setError('El teléfono es obligatorio.');
      return;
    }

    if (!direccion.trim()) {
      setError('La dirección es obligatoria.');
      return;
    }

    try {
      setGuardando(true);
      setError('');
      setMensaje('');

      const clienteActualizado =
        await actualizarClienteAdmin(
          clienteEditando._id,
          {
            documento: documento.trim(),
            tipoDocumento: tipoDocumento.trim(),
            nombre: nombre.trim(),
            apellidos: apellidos.trim(),
            correo: correo.trim(),
            telefono: telefono.trim(),
            direccion: direccion.trim(),
            estado
          }
        );

      setClientes((clientesActuales) =>
        clientesActuales.map((cliente) =>
          cliente._id === clienteActualizado._id
            ? clienteActualizado
            : cliente
        )
      );

      setMensaje(
        'Cliente actualizado correctamente.'
      );

      cerrarFormulario();
    } catch (error: any) {
      console.error(
        'Error al actualizar cliente:',
        error
      );

      const mensajeBackend =
        error?.response?.data?.message;

      setError(
        mensajeBackend ||
          'No fue posible actualizar el cliente.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminarCliente = async (
    cliente: ClienteAdmin
  ) => {
    const confirmado = window.confirm(
      `¿Deseas eliminar al cliente "${cliente.nombre} ${cliente.apellidos}"?`
    );

    if (!confirmado) {
      return;
    }

    try {
      setEliminandoId(cliente._id);
      setError('');
      setMensaje('');

      await eliminarClienteAdmin(
        cliente._id
      );

      setClientes((clientesActuales) =>
        clientesActuales.filter(
          (item) =>
            item._id !== cliente._id
        )
      );

      setMensaje(
        'Cliente eliminado correctamente.'
      );
    } catch (error: any) {
      console.error(
        'Error al eliminar cliente:',
        error
      );

      const mensajeBackend =
        error?.response?.data?.message;

      setError(
        mensajeBackend ||
          'No fue posible eliminar el cliente.'
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
      vistaActiva="clientes"
      onIrDashboard={onIrDashboard}
      onIrProductos={onIrProductos}
      onIrCategorias={onIrCategorias}
      onIrClientes={onIrClientes}
      onIrPedidos={onIrPedidos}
      onIrUsuarios={onIrUsuarios}
      onCerrarSesion={onCerrarSesion}
    >
      <main className="admin-clientes-page">
        <section className="admin-clientes-panel">
          <header className="admin-clientes-panel__header">
            <div>
              <h1 className="admin-clientes-page__title">
                Clientes
              </h1>

              <p className="admin-clientes-page__subtitle">
                Gestión administrativa de clientes.
              </p>
            </div>
          </header>

          <div className="admin-clientes-search">
            <input
              type="search"
              value={busqueda}
              onChange={(event) =>
                setBusqueda(event.target.value)
              }
              placeholder="Buscar por documento, nombre, correo o teléfono..."
            />
          </div>

          {error && (
            <p
              className="admin-clientes-page__error"
              role="alert"
            >
              {error}
            </p>
          )}

          {mensaje && (
            <p className="admin-clientes-page__success">
              {mensaje}
            </p>
          )}

          {mostrarFormulario &&
            clienteEditando && (
              <section className="admin-clientes-form-card">
                <div className="admin-clientes-form-card__header">
                  <h2>
                    Editar cliente
                  </h2>

                  <button
                    type="button"
                    onClick={cerrarFormulario}
                  >
                    ×
                  </button>
                </div>

                <form
                  className="admin-clientes-form"
                  onSubmit={guardarCliente}
                >
                  <label className="admin-clientes-form__field">
                    <span>Documento</span>

                    <input
                      type="text"
                      value={documento}
                      onChange={(event) =>
                        setDocumento(
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-clientes-form__field">
                    <span>
                      Tipo de documento
                    </span>

                    <input
                      type="text"
                      value={tipoDocumento}
                      onChange={(event) =>
                        setTipoDocumento(
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-clientes-form__field">
                    <span>Nombre</span>

                    <input
                      type="text"
                      value={nombre}
                      onChange={(event) =>
                        setNombre(
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-clientes-form__field">
                    <span>Apellidos</span>

                    <input
                      type="text"
                      value={apellidos}
                      onChange={(event) =>
                        setApellidos(
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-clientes-form__field">
                    <span>Correo</span>

                    <input
                      type="email"
                      value={correo}
                      onChange={(event) =>
                        setCorreo(
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-clientes-form__field">
                    <span>Teléfono</span>

                    <input
                      type="text"
                      value={telefono}
                      onChange={(event) =>
                        setTelefono(
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-clientes-form__field admin-clientes-form__field--full">
                    <span>Dirección</span>

                    <input
                      type="text"
                      value={direccion}
                      onChange={(event) =>
                        setDireccion(
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-clientes-form__field">
                    <span>Estado</span>

                    <select
                      value={estado}
                      onChange={(event) =>
                        setEstado(
                          event.target.value
                        )
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

                  <div className="admin-clientes-form__actions">
                    <button
                      type="button"
                      className="admin-clientes-form__cancel"
                      onClick={cerrarFormulario}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="admin-clientes-form__save"
                      disabled={guardando}
                    >
                      {guardando
                        ? 'Guardando...'
                        : 'Guardar cambios'}
                    </button>
                  </div>
                </form>
              </section>
            )}

          {cargando ? (
            <p className="admin-clientes-page__loading">
              Cargando clientes...
            </p>
          ) : clientesOrdenados.length === 0 ? (
            <p className="admin-clientes-page__empty">
              No hay clientes para mostrar.
            </p>
          ) : (
            <>
              <div className="admin-clientes-table-wrapper">
                <table className="admin-clientes-table">
                  <thead>
                    <tr>
                      <th>Documento</th>
                      <th>Cliente</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {clientesPaginaActual.map(
                      (cliente) => (
                        <tr key={cliente._id}>
                          <td>
                            {cliente.tipoDocumento}{' '}
                            {cliente.documento}
                          </td>

                          <td>
                            <strong>
                              {cliente.nombre}{' '}
                              {cliente.apellidos}
                            </strong>

                            <small className="admin-clientes-table__address">
                              {cliente.direccion}
                            </small>
                          </td>

                          <td>
                            {cliente.correo}
                          </td>

                          <td>
                            {cliente.telefono}
                          </td>

                          <td>
                            <span
                              className={
                                cliente.estado ===
                                  'Inactivo'
                                  ? 'admin-clientes-table__status admin-clientes-table__status--inactivo'
                                  : 'admin-clientes-table__status admin-clientes-table__status--activo'
                              }
                            >
                              {cliente.estado ||
                                'Activo'}
                            </span>
                          </td>

                          <td>
                            <div className="admin-clientes-table__actions">
                              <button
                                type="button"
                                title="Editar"
                                onClick={() =>
                                  abrirEditarCliente(
                                    cliente
                                  )
                                }
                              >
                                ✎
                              </button>

                              <button
                                type="button"
                                title="Eliminar"
                                className="admin-clientes-table__delete"
                                disabled={
                                  eliminandoId ===
                                  cliente._id
                                }
                                onClick={() =>
                                  eliminarCliente(
                                    cliente
                                  )
                                }
                              >
                                {eliminandoId ===
                                cliente._id
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
                <nav className="admin-clientes-pagination">
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
                              ? 'admin-clientes-pagination__active'
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

export default AdminClientesPage;