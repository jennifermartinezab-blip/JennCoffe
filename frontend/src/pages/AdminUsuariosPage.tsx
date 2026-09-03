import { useEffect, useMemo, useState } from 'react';

import AdminLayout from '../layouts/AdminLayout';

import {
  actualizarUsuarioAdmin,
  crearUsuarioAdmin,
  eliminarUsuarioAdmin,
  obtenerUsuariosAdmin,
  type UsuarioAdmin
} from '../services/adminUsuariosService';

import './AdminUsuariosPage.css';

interface AdminUsuariosPageProps {
  onCerrarSesion: () => void;
  onIrDashboard: () => void;
  onIrProductos: () => void;
  onIrCategorias: () => void;
  onIrClientes: () => void;
  onIrPedidos: () => void;
  onIrUsuarios: () => void;
}

const USUARIOS_POR_PAGINA = 5;

function AdminUsuariosPage({
  onCerrarSesion,
  onIrDashboard,
  onIrProductos,
  onIrCategorias,
  onIrClientes,
  onIrPedidos,
  onIrUsuarios
}: AdminUsuariosPageProps) {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [usuarioEditando, setUsuarioEditando] =
    useState<UsuarioAdmin | null>(null);

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('Administrador');
  const [estado, setEstado] = useState('Activo');

  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] =
    useState<string | null>(null);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      setError('');

      const usuariosObtenidos =
        await obtenerUsuariosAdmin();

      setUsuarios(usuariosObtenidos);
    } catch (error) {
      console.error(
        'Error al consultar usuarios administrativos:',
        error
      );

      setError(
        'No fue posible consultar los usuarios administrativos.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosOrdenados = useMemo(() => {
    return [...usuarios].sort((a, b) => {
      const fechaA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const fechaB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return fechaB - fechaA;
    });
  }, [usuarios]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      usuariosOrdenados.length /
        USUARIOS_POR_PAGINA
    )
  );

  const usuariosPaginaActual = useMemo(() => {
    const inicio =
      (paginaActual - 1) *
      USUARIOS_POR_PAGINA;

    return usuariosOrdenados.slice(
      inicio,
      inicio + USUARIOS_POR_PAGINA
    );
  }, [
    usuariosOrdenados,
    paginaActual
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
    setUsuario('');
    setContrasena('');
    setRol('Administrador');
    setEstado('Activo');
    setUsuarioEditando(null);
  };

  const abrirCrearUsuario = () => {
    limpiarFormulario();

    setError('');
    setMensaje('');
    setMostrarFormulario(true);
  };

  const abrirEditarUsuario = (
    usuarioSeleccionado: UsuarioAdmin
  ) => {
    setUsuarioEditando(usuarioSeleccionado);

    setUsuario(usuarioSeleccionado.usuario);
    setContrasena('');
    setRol(usuarioSeleccionado.rol);
    setEstado(usuarioSeleccionado.estado);

    setError('');
    setMensaje('');
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  const guardarUsuario = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!usuario.trim()) {
      setError('El usuario es obligatorio.');
      return;
    }

    if (
      !usuarioEditando &&
      !contrasena.trim()
    ) {
      setError(
        'La contraseña es obligatoria para crear el usuario.'
      );
      return;
    }

    try {
      setGuardando(true);
      setError('');
      setMensaje('');

      if (usuarioEditando) {
        const datosActualizar: {
          usuario: string;
          rol: string;
          estado: string;
          contrasena?: string;
        } = {
          usuario: usuario.trim(),
          rol,
          estado
        };

        if (contrasena.trim()) {
          datosActualizar.contrasena =
            contrasena.trim();
        }

        const usuarioActualizado =
          await actualizarUsuarioAdmin(
            usuarioEditando._id,
            datosActualizar
          );

        setUsuarios((usuariosActuales) =>
          usuariosActuales.map(
            (item) =>
              item._id === usuarioActualizado._id
                ? usuarioActualizado
                : item
          )
        );

        setMensaje(
          'Usuario actualizado correctamente.'
        );
      } else {
        const usuarioCreado =
          await crearUsuarioAdmin({
            usuario: usuario.trim(),
            contrasena: contrasena.trim(),
            rol,
            estado
          });

        setUsuarios((usuariosActuales) => [
          usuarioCreado,
          ...usuariosActuales
        ]);

        setPaginaActual(1);

        setMensaje(
          'Usuario creado correctamente.'
        );
      }

      cerrarFormulario();
    } catch (error: any) {
      console.error(
        'Error al guardar usuario administrativo:',
        error
      );

      const mensajeBackend =
        error?.response?.data?.message;

      setError(
        mensajeBackend ||
          'No fue posible guardar el usuario administrativo.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminarUsuario = async (
    usuarioSeleccionado: UsuarioAdmin
  ) => {
    const confirmado = window.confirm(
      `¿Deseas eliminar el usuario "${usuarioSeleccionado.usuario}"?`
    );

    if (!confirmado) {
      return;
    }

    try {
      setEliminandoId(usuarioSeleccionado._id);
      setError('');
      setMensaje('');

      await eliminarUsuarioAdmin(
        usuarioSeleccionado._id
      );

      setUsuarios((usuariosActuales) =>
        usuariosActuales.filter(
          (item) =>
            item._id !== usuarioSeleccionado._id
        )
      );

      setMensaje(
        'Usuario eliminado correctamente.'
      );
    } catch (error: any) {
      console.error(
        'Error al eliminar usuario administrativo:',
        error
      );

      const mensajeBackend =
        error?.response?.data?.message;

      setError(
        mensajeBackend ||
          'No fue posible eliminar el usuario administrativo.'
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
      vistaActiva="usuarios"
      onIrDashboard={onIrDashboard}
      onIrProductos={onIrProductos}
      onIrCategorias={onIrCategorias}
      onIrClientes={onIrClientes}
      onIrPedidos={onIrPedidos}
      onIrUsuarios={onIrUsuarios}
      onCerrarSesion={onCerrarSesion}
    >
      <main className="admin-usuarios-page">
        <header className="admin-usuarios-page__header">
          <div>
            <h1 className="admin-usuarios-page__title">
              Usuarios administradores
            </h1>

            <p className="admin-usuarios-page__subtitle">
              Gestión de usuarios administrativos de JennCoffee.
            </p>
          </div>

          <button
            type="button"
            className="admin-usuarios-page__new-button"
            onClick={abrirCrearUsuario}
          >
            + Nuevo usuario
          </button>
        </header>

        {error && (
          <p
            className="admin-usuarios-page__error"
            role="alert"
          >
            {error}
          </p>
        )}

        {mensaje && (
          <p className="admin-usuarios-page__success">
            {mensaje}
          </p>
        )}

        {mostrarFormulario && (
          <section className="admin-usuarios-form-card">
            <div className="admin-usuarios-form-card__header">
              <h2>
                {usuarioEditando
                  ? 'Editar usuario'
                  : 'Nuevo usuario'}
              </h2>

              <button
                type="button"
                className="admin-usuarios-form-card__close"
                onClick={cerrarFormulario}
              >
                ×
              </button>
            </div>

            <form
              className="admin-usuarios-form"
              onSubmit={guardarUsuario}
            >
              <label className="admin-usuarios-form__field">
                <span>Usuario</span>

                <input
                  type="text"
                  value={usuario}
                  onChange={(event) =>
                    setUsuario(event.target.value)
                  }
                  placeholder="Nombre de usuario"
                />
              </label>

              <label className="admin-usuarios-form__field">
                <span>
                  {usuarioEditando
                    ? 'Nueva contraseña'
                    : 'Contraseña'}
                </span>

                <input
                  type="password"
                  value={contrasena}
                  onChange={(event) =>
                    setContrasena(
                      event.target.value
                    )
                  }
                  placeholder={
                    usuarioEditando
                      ? 'Déjala vacía para conservarla'
                      : 'Contraseña'
                  }
                />
              </label>

              <label className="admin-usuarios-form__field">
                <span>Rol</span>

                <select
                  value={rol}
                  onChange={(event) =>
                    setRol(event.target.value)
                  }
                >
                  <option value="Administrador">
                    Administrador
                  </option>
                </select>
              </label>

              <label className="admin-usuarios-form__field">
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

              <div className="admin-usuarios-form__actions">
                <button
                  type="button"
                  className="admin-usuarios-form__cancel"
                  onClick={cerrarFormulario}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="admin-usuarios-form__save"
                  disabled={guardando}
                >
                  {guardando
                    ? 'Guardando...'
                    : usuarioEditando
                      ? 'Guardar cambios'
                      : 'Crear usuario'}
                </button>
              </div>
            </form>
          </section>
        )}

        {cargando ? (
          <p className="admin-usuarios-page__loading">
            Cargando usuarios...
          </p>
        ) : usuariosOrdenados.length === 0 ? (
          <p className="admin-usuarios-page__empty">
            No hay usuarios administrativos registrados.
          </p>
        ) : (
          <>
            <section className="admin-usuarios-list">
              {usuariosPaginaActual.map(
                (usuarioAdmin) => (
                  <article
                    key={usuarioAdmin._id}
                    className="admin-usuario-card"
                  >
                    <div className="admin-usuario-card__info">
                      <div>
                        <span className="admin-usuario-card__label">
                          Usuario
                        </span>

                        <strong className="admin-usuario-card__name">
                          {usuarioAdmin.usuario}
                        </strong>
                      </div>

                      <div>
                        <span className="admin-usuario-card__label">
                          Rol
                        </span>

                        <span className="admin-usuario-card__value">
                          {usuarioAdmin.rol}
                        </span>
                      </div>

                      <div>
                        <span className="admin-usuario-card__label">
                          Estado
                        </span>

                        <span
                          className={
                            usuarioAdmin.estado === 'Activo'
                              ? 'admin-usuario-card__status admin-usuario-card__status--activo'
                              : 'admin-usuario-card__status admin-usuario-card__status--inactivo'
                          }
                        >
                          {usuarioAdmin.estado}
                        </span>
                      </div>
                    </div>

                    <div className="admin-usuario-card__actions">
                      <button
                        type="button"
                        className="admin-usuario-card__edit"
                        onClick={() =>
                          abrirEditarUsuario(
                            usuarioAdmin
                          )
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="admin-usuario-card__delete"
                        disabled={
                          eliminandoId ===
                          usuarioAdmin._id
                        }
                        onClick={() =>
                          eliminarUsuario(
                            usuarioAdmin
                          )
                        }
                      >
                        {eliminandoId ===
                        usuarioAdmin._id
                          ? 'Eliminando...'
                          : 'Eliminar'}
                      </button>
                    </div>
                  </article>
                )
              )}
            </section>

            {totalPaginas > 1 && (
              <nav className="admin-usuarios-pagination">
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
                            ? 'admin-usuarios-pagination__active'
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
      </main>
    </AdminLayout>
  );
}

export default AdminUsuariosPage;