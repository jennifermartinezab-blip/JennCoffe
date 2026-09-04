import { useEffect, useState } from 'react';

import {
  actualizarMiPerfil,
  obtenerMiPerfil
} from '../services/perfilService';

import type {
  PerfilCliente
} from '../services/perfilService';

import './PerfilPage.css';

interface PerfilPageProps {
  onVolverAlMenu: () => void;
  onCerrarSesion: () => void;
}

function PerfilPage({
  onVolverAlMenu,
  onCerrarSesion
}: PerfilPageProps) {
  const [perfil, setPerfil] =
    useState<PerfilCliente | null>(null);

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setCargando(true);
        setError('');

        const datos = await obtenerMiPerfil();

        setPerfil(datos);
        setNombre(datos.nombre);
        setApellidos(datos.apellidos);
        setCorreo(datos.correo);
        setTelefono(datos.telefono);
        setDireccion(datos.direccion);
      } catch (error: any) {
        console.error(
          'Error al consultar el perfil:',
          error
        );

        const mensajeBackend =
          error?.response?.data?.message;

        setError(
          mensajeBackend ||
            'No fue posible consultar el perfil.'
        );
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, []);

  const manejarSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !nombre.trim() ||
      !apellidos.trim() ||
      !correo.trim() ||
      !telefono.trim() ||
      !direccion.trim()
    ) {
      setError(
        'Todos los campos editables son obligatorios.'
      );
      return;
    }

    try {
      setGuardando(true);
      setError('');
      setMensaje('');

      const perfilActualizado =
        await actualizarMiPerfil({
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          correo: correo.trim(),
          telefono: telefono.trim(),
          direccion: direccion.trim()
        });

      setPerfil(perfilActualizado);

      setMensaje(
        'Perfil actualizado correctamente.'
      );
    } catch (error: any) {
      console.error(
        'Error al actualizar el perfil:',
        error
      );

      const mensajeBackend =
        error?.response?.data?.message;

      setError(
        mensajeBackend ||
          'No fue posible actualizar el perfil.'
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <main className="perfil-page">
        <section className="perfil-card">
          <p className="perfil-status">
            Cargando perfil...
          </p>
        </section>
      </main>
    );
  }

  if (!perfil) {
    return (
      <main className="perfil-page">
        <section className="perfil-card">
          <h1 className="perfil-title">
            Mi perfil
          </h1>

          <p className="perfil-error">
            {error ||
              'No fue posible cargar la información del perfil.'}
          </p>

          <button
            type="button"
            className="perfil-secondary-button"
            onClick={onVolverAlMenu}
          >
            Volver al menú
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="perfil-page">
      <section className="perfil-card">
        <header className="perfil-header">
          <div>
            <p className="perfil-brand">
              JennCoffee
            </p>

            <h1 className="perfil-title">
              Mi perfil
            </h1>

            <p className="perfil-subtitle">
              Consulta y actualiza tus datos personales.
            </p>
          </div>

          <div className="perfil-header__actions">
            <button
              type="button"
              className="perfil-secondary-button"
              onClick={onVolverAlMenu}
            >
              Volver al menú
            </button>

            <button
              type="button"
              className="perfil-logout-button"
              onClick={onCerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="perfil-summary">
          <div className="perfil-avatar">
            {perfil.nombre
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h2>
              {perfil.nombre}{' '}
              {perfil.apellidos}
            </h2>

            <p>
              {perfil.correo}
            </p>

            <span
              className={`perfil-state ${
                perfil.estado === 'Activo'
                  ? 'perfil-state--active'
                  : 'perfil-state--inactive'
              }`}
            >
              {perfil.estado}
            </span>
          </div>
        </div>

        <form
          className="perfil-form"
          onSubmit={manejarSubmit}
        >
          <div className="perfil-form__grid">
            <label className="perfil-field">
              <span>
                Tipo de documento
              </span>

              <input
                type="text"
                value={perfil.tipoDocumento}
                disabled
              />
            </label>

            <label className="perfil-field">
              <span>
                Documento
              </span>

              <input
                type="text"
                value={perfil.documento}
                disabled
              />
            </label>

            <label className="perfil-field">
              <span>
                Nombre
              </span>

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

            <label className="perfil-field">
              <span>
                Apellidos
              </span>

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

            <label className="perfil-field">
              <span>
                Correo
              </span>

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

            <label className="perfil-field">
              <span>
                Teléfono
              </span>

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

            <label className="perfil-field perfil-field--full">
              <span>
                Dirección
              </span>

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
          </div>

          <p className="perfil-info">
            El documento y el tipo de documento no se pueden modificar desde el perfil.
          </p>

          {error && (
            <p
              className="perfil-error"
              role="alert"
            >
              {error}
            </p>
          )}

          {mensaje && (
            <p className="perfil-success">
              {mensaje}
            </p>
          )}

          <div className="perfil-form__actions">
            <button
              type="submit"
              className="perfil-primary-button"
              disabled={guardando}
            >
              {guardando
                ? 'Guardando...'
                : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default PerfilPage;