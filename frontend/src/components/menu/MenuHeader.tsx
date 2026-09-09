import {
  useRef,
  useState
} from 'react';

import './MenuHeader.css';

interface MenuHeaderProps {
  busqueda: string;
  cantidadCarrito: number;
  onCambiarBusqueda: (valor: string) => void;
  onAbrirCarrito: () => void;
  onAbrirMisPedidos: () => void;
  onAbrirPerfil: () => void;
  onCerrarSesion: () => void;
}

function MenuHeader({
  busqueda,
  cantidadCarrito,
  onCambiarBusqueda,
  onAbrirCarrito,
  onAbrirMisPedidos,
  onAbrirPerfil,
  onCerrarSesion
}: MenuHeaderProps) {
  const [menuAbierto, setMenuAbierto] =
    useState(false);

  const buscadorRef =
    useRef<HTMLInputElement>(null);

  const enfocarBuscador = () => {
    buscadorRef.current?.focus();
  };

  const abrirCarrito = () => {
    setMenuAbierto(false);
    onAbrirCarrito();
  };

  const abrirPedidos = () => {
    setMenuAbierto(false);
    onAbrirMisPedidos();
  };

  const abrirPerfil = () => {
    setMenuAbierto(false);
    onAbrirPerfil();
  };

  return (
    <header className="menu-header">
      <div className="menu-header__top">
        <div className="menu-header__menu-wrapper">
          <button
            type="button"
            className="menu-header__menu-button"
            onClick={() =>
              setMenuAbierto(
                (estadoActual) =>
                  !estadoActual
              )
            }
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
          >
            ☰
          </button>

          {menuAbierto && (
            <nav className="menu-header__dropdown">
              <button
                type="button"
                className="menu-header__dropdown-item"
                onClick={abrirCarrito}
              >
                Carrito
              </button>

              <button
                type="button"
                className="menu-header__dropdown-item"
                onClick={abrirPedidos}
              >
                Mis pedidos
              </button>

              <button
                type="button"
                className="menu-header__dropdown-item"
                onClick={abrirPerfil}
              >
                Mi perfil
              </button>
            </nav>
          )}
        </div>

        <div className="menu-header__brand">
          <img
            src="/images/branding/jenncoffee-cat-logo.png"
            alt="JennCoffee"
            className="menu-header__brand-image"
          />

          <span className="menu-header__brand-text">
            JennCoffee
          </span>
        </div>

        <div className="menu-header__actions">
          <button
            type="button"
            className="menu-header__icon-button"
            onClick={enfocarBuscador}
            aria-label="Buscar productos"
          >
            ⌕
          </button>

          <button
            type="button"
            className="menu-header__cart-button"
            onClick={onAbrirCarrito}
            aria-label="Abrir carrito"
          >
            <span aria-hidden="true">
              🛒
            </span>

            {cantidadCarrito > 0 && (
              <span className="menu-header__cart-badge">
                {cantidadCarrito}
              </span>
            )}
          </button>

          <button
            type="button"
            className="menu-header__logout-button"
            onClick={onCerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="menu-header__search">
        <span
          className="menu-header__search-icon"
          aria-hidden="true"
        >
          ⌕
        </span>

        <input
          ref={buscadorRef}
          className="menu-header__search-input"
          type="search"
          value={busqueda}
          onChange={(event) =>
            onCambiarBusqueda(
              event.target.value
            )
          }
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
        />
      </div>
    </header>
  );
}

export default MenuHeader;