import { useState } from 'react';

import {
  registrarCliente
} from '../services/authService';

import './RegistroPage.css';

interface RegistroPageProps {
  onVolverLogin: () => void;
}

function RegistroPage({
  onVolverLogin
}: RegistroPageProps) {
  const [documento, setDocumento] = useState('');
  const [tipoDocumento, setTipoDocumento] =
    useState('CC');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] =
    useState('');

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !documento.trim() ||
      !tipoDocumento.trim() ||
      !nombre.trim() ||
      !apellidos.trim() ||
      !correo.trim() ||
      !telefono.trim() ||
      !direccion.trim() ||
      !contrasena.trim()
    ) {
      setError(
        'Todos los campos son obligatorios.'
      );
      return;
    }

    if (
      contrasena !== confirmarContrasena
    ) {
      setError(
        'Las contraseñas no coinciden.'
      );
      return;
    }

    try {
      setCargando(true);
      setError('');
      setMensaje('');

      await registrarCliente({
        documento: documento.trim(),
        tipoDocumento: tipoDocumento.trim(),
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        contrasena
      });

      setMensaje(
        'Cuenta creada correctamente. Ya puedes iniciar sesión.'
      );

      setDocumento('');
      setTipoDocumento('CC');
      setNombre('');
      setApellidos('');
      setCorreo('');
      setTelefono('');
      setDireccion('');
      setContrasena('');
      setConfirmarContrasena('');
    } catch (error: any) {
      console.error(
        'Error al registrar cliente:',
        error
      );

      const mensajeBackend =
        error?.response?.data?.message;

      setError(
        mensajeBackend ||
          'No fue posible crear la cuenta.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="registro-page">
      <section className="registro-card">
        <div className="registro-card__header">
          <p className="registro-card__brand">
            JennCoffee
          </p>

          <h1 className="registro-card__title">
            Crear cuenta
          </h1>

          <p className="registro-card__subtitle">
            Regístrate para realizar pedidos en JennCoffee.
          </p>
        </div>

        <form
          className="registro-form"
          onSubmit={manejarSubmit}
        >
          <div className="registro-form__grid">
            <label className="registro-form__field">
              <span>
                Tipo de documento
              </span>

              <select
                value={tipoDocumento}
                onChange={(event) =>
                  setTipoDocumento(
                    event.target.value
                  )
                }
              >
                <option value="CC">
                  Cédula de ciudadanía
                </option>

                <option value="CE">
                  Cédula de extranjería
                </option>

                <option value="TI">
                  Tarjeta de identidad
                </option>

                <option value="Pasaporte">
                  Pasaporte
                </option>
              </select>
            </label>

            <label className="registro-form__field">
              <span>
                Documento
              </span>

              <input
                type="text"
                value={documento}
                onChange={(event) =>
                  setDocumento(
                    event.target.value
                  )
                }
                placeholder="Número de documento"
              />
            </label>

            <label className="registro-form__field">
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
                placeholder="Nombre"
              />
            </label>

            <label className="registro-form__field">
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
                placeholder="Apellidos"
              />
            </label>

            <label className="registro-form__field">
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
                placeholder="correo@ejemplo.com"
              />
            </label>

            <label className="registro-form__field">
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
                placeholder="Teléfono"
              />
            </label>

            <label className="registro-form__field registro-form__field--full">
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
                placeholder="Dirección de entrega"
              />
            </label>

            <label className="registro-form__field">
              <span>
                Contraseña
              </span>

              <input
                type="password"
                value={contrasena}
                onChange={(event) =>
                  setContrasena(
                    event.target.value
                  )
                }
                placeholder="Contraseña"
                autoComplete="new-password"
              />
            </label>

            <label className="registro-form__field">
              <span>
                Confirmar contraseña
              </span>

              <input
                type="password"
                value={confirmarContrasena}
                onChange={(event) =>
                  setConfirmarContrasena(
                    event.target.value
                  )
                }
                placeholder="Repite la contraseña"
                autoComplete="new-password"
              />
            </label>
          </div>

          {error && (
            <p
              className="registro-form__error"
              role="alert"
            >
              {error}
            </p>
          )}

          {mensaje && (
            <p className="registro-form__success">
              {mensaje}
            </p>
          )}

          <div className="registro-form__actions">
            <button
              type="button"
              className="registro-form__back"
              onClick={onVolverLogin}
            >
              Volver al inicio de sesión
            </button>

            <button
              type="submit"
              className="registro-form__submit"
              disabled={cargando}
            >
              {cargando
                ? 'Creando cuenta...'
                : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default RegistroPage;