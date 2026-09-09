import { useState } from 'react';

import './LoginPage.css';

import {
  guardarToken,
  loginCliente
} from '../services/authService';

interface LoginPageProps {
  onLoginCorrecto: () => void;
  onIrAdministrador: () => void;
  onIrRegistro: () => void;
}

function LoginPage({
  onLoginCorrecto,
  onIrAdministrador,
  onIrRegistro
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
        <header className="login-card__header">
          <img
            src="/images/branding/jenncoffee-inicio.jpg"
            alt="Identidad visual de JennCoffee"
            className="login-card__brand-image"
          />
        </header>

        <div className="login-card__form-box">
          <h2 className="login-card__title">
            ¡Bienvenida de nuevo!
          </h2>

          <p className="login-card__subtitle">
            Inicia sesión para continuar.
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
                Correo electrónico
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

          <div className="login-card__register">
            <span>
              ¿No tienes cuenta?
            </span>

            <button
              type="button"
              className="login-card__register-button"
              onClick={onIrRegistro}
            >
              Regístrate aquí
            </button>
          </div>

          <p className="login-card__note">
            Acceso exclusivo para clientes registrados en JennCoffee.
          </p>

          <button
            type="button"
            className="login-card__admin-button"
            onClick={onIrAdministrador}
          >
            Ingresar como administrador
          </button>
        </div>

        <div
          className="login-card__footer-visual"
          aria-hidden="true"
        >
          <img
            src="/images/branding/jenncoffee-login.jpg"
            alt=""
            className="login-card__footer-image"
          />
        </div>
      </section>
    </main>
  );
}

export default LoginPage;