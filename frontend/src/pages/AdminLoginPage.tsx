import { useState } from 'react';

import './AdminLoginPage.css';

import {
  guardarTokenAdministrador,
  loginAdministrador
} from '../services/adminAuthService';

interface AdminLoginPageProps {
  onLoginAdministradorCorrecto: () => void;
  onVolverCliente: () => void;
}

function AdminLoginPage({
  onLoginAdministradorCorrecto,
  onVolverCliente
}: AdminLoginPageProps) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const iniciarSesion = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setCargando(true);
      setError('');

      const respuesta = await loginAdministrador(
        usuario.trim(),
        contrasena
      );

      guardarTokenAdministrador(respuesta.token);

      onLoginAdministradorCorrecto();
    } catch (error) {
      console.error(
        'Error al iniciar sesión como administrador:',
        error
      );

      setError(
        'No fue posible iniciar sesión. Verifica usuario y contraseña.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <button
          type="button"
          className="admin-login-card__back-button"
          onClick={onVolverCliente}
        >
          ← Volver al acceso de cliente
        </button>

        <h1 className="admin-login-card__title">
          Administrador
        </h1>

        <p className="admin-login-card__subtitle">
          Ingresa con tus credenciales administrativas para acceder
          al panel de gestión de JennCoffee.
        </p>

        <form
          className="admin-login-form"
          onSubmit={iniciarSesion}
        >
          <div className="admin-login-form__group">
            <label
              className="admin-login-form__label"
              htmlFor="admin-usuario"
            >
              Usuario
            </label>

            <input
              id="admin-usuario"
              className="admin-login-form__input"
              type="text"
              value={usuario}
              onChange={(event) =>
                setUsuario(event.target.value)
              }
              placeholder="Ingresa tu usuario"
              autoComplete="username"
              required
            />
          </div>

          <div className="admin-login-form__group">
            <label
              className="admin-login-form__label"
              htmlFor="admin-contrasena"
            >
              Contraseña
            </label>

            <input
              id="admin-contrasena"
              className="admin-login-form__input"
              type="password"
              value={contrasena}
              onChange={(event) =>
                setContrasena(event.target.value)
              }
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p
              className="admin-login-form__error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-form__button"
            disabled={cargando}
          >
            {cargando
              ? 'Ingresando...'
              : 'Iniciar sesión'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLoginPage;