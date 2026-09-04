import './BottomNavigation.css';

interface BottomNavigationProps {
  cantidadCarrito: number;
  onAbrirCarrito: () => void;
  onAbrirMisPedidos: () => void;
  onAbrirPerfil: () => void;
}

function BottomNavigation({
  cantidadCarrito,
  onAbrirCarrito,
  onAbrirMisPedidos,
  onAbrirPerfil
}: BottomNavigationProps) {
  return (
    <nav
      className="bottom-navigation"
      aria-label="Navegación principal del cliente"
    >
      <div className="bottom-navigation__item bottom-navigation__item--active">
        <span
          className="bottom-navigation__icon"
          aria-hidden="true"
        >
          ⌂
        </span>

        <span className="bottom-navigation__label">
          Inicio
        </span>
      </div>

      <div className="bottom-navigation__item">
        <span
          className="bottom-navigation__icon"
          aria-hidden="true"
        >
          ☰
        </span>

        <span className="bottom-navigation__label">
          Menú
        </span>
      </div>

      <button
        type="button"
        className="bottom-navigation__item bottom-navigation__button"
        onClick={onAbrirCarrito}
        aria-label={`Abrir carrito con ${cantidadCarrito} productos`}
      >
        <span
          className="bottom-navigation__icon"
          aria-hidden="true"
        >
          🛒
        </span>

        {cantidadCarrito > 0 && (
          <span
            className="bottom-navigation__cart-count"
            aria-hidden="true"
          >
            {cantidadCarrito}
          </span>
        )}

        <span className="bottom-navigation__label">
          Carrito
        </span>
      </button>

      <button
        type="button"
        className="bottom-navigation__item bottom-navigation__button"
        onClick={onAbrirMisPedidos}
        aria-label="Abrir mis pedidos"
      >
        <span
          className="bottom-navigation__icon"
          aria-hidden="true"
        >
          ◫
        </span>

        <span className="bottom-navigation__label">
          Mis pedidos
        </span>
      </button>

      <button
        type="button"
        className="bottom-navigation__item bottom-navigation__button"
        onClick={onAbrirPerfil}
        aria-label="Abrir mi perfil"
      >
        <span
          className="bottom-navigation__icon"
          aria-hidden="true"
        >
          ♙
        </span>

        <span className="bottom-navigation__label">
          Perfil
        </span>
      </button>
    </nav>
  );
}

export default BottomNavigation;