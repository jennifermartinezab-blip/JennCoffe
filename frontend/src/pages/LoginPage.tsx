import { useState } from 'react';

import './LoginPage.css';

import {
  guardarToken,
  loginCliente
} from '../services/authService';

interface LoginPageProps {
  onLoginCorrecto: () => void;
}

function LoginPage({
  onLoginCorrecto
}: LoginPageProps) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setCargando(true);
      setError('');

      const respuesta = await loginCliente(
        correo,
        contrasena
      );

      guardarToken(respuesta.token);

      onLoginCorrecto();
    } catch (error) {
      console.error(
        'Error al iniciar sesión:',
        error
      );

      setError(
        'No fue posible iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-card__visual">
          <p className="login-card__brand">
            JennCoffee
          </p>

          <div className="login-card__visual-content">
            <h1 className="login-card__visual-title">
              Tu rincón coreano favorito
            </h1>

            <p className="login-card__visual-text">
              Disfruta bebidas, platos y postres inspirados
              en los cafés coreanos.
            </p>
          </div>

          <div
            className="login-card__decoration"
            aria-hidden="true"
          >
            ☕
          </div>
        </div>

        <div className="login-card__content">
          <h2 className="login-card__title">
            Iniciar sesión
          </h2>

          <p className="login-card__subtitle">
            Ingresa con tu cuenta de cliente para continuar.
          </p>

          <form
            className="login-form"
            onSubmit={manejarSubmit}
          >
            <div className="login-form__group">
              <label
                className="login-form__label"
                htmlFor="correo"
              >
                Correo
              </label>

              <input
                id="correo"
                className="login-form__input"
                type="email"
                value={correo}
                onChange={(event) =>
                  setCorreo(event.target.value)
                }
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="login-form__group">
              <label
                className="login-form__label"
                htmlFor="contrasena"
              >
                Contraseña
              </label>

              <input
                id="contrasena"
                className="login-form__input"
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
                className="login-form__error"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-form__button"
              disabled={cargando}
            >
              {cargando
                ? 'Ingresando...'
                : 'Iniciar sesión'}
            </button>
          </form>

          <p className="login-card__note">
            Acceso exclusivo para clientes registrados en JennCoffee.
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;