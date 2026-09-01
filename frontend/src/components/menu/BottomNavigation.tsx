import './BottomNavigation.css';

interface BottomNavigationProps {
  cantidadCarrito: number;
}

function BottomNavigation({
  cantidadCarrito
}: BottomNavigationProps) {
  return (
    <nav
      className="bottom-navigation"
      aria-label="Navegación principal del cliente"
    >
      <div className="bottom-navigation__item bottom-navigation__item--active">
        <span className="bottom-navigation__icon" aria-hidden="true">
          ⌂
        </span>

        <span className="bottom-navigation__label">
          Inicio
        </span>
      </div>

      <div className="bottom-navigation__item">
        <span className="bottom-navigation__icon" aria-hidden="true">
          ☰
        </span>

        <span className="bottom-navigation__label">
          Menú
        </span>
      </div>

      <div className="bottom-navigation__item">
        <span className="bottom-navigation__icon" aria-hidden="true">
          🛒
        </span>

        {cantidadCarrito > 0 && (
          <span
            className="bottom-navigation__cart-count"
            aria-label={`${cantidadCarrito} productos en el carrito`}
          >
            {cantidadCarrito}
          </span>
        )}

        <span className="bottom-navigation__label">
          Carrito
        </span>
      </div>

      <div className="bottom-navigation__item">
        <span className="bottom-navigation__icon" aria-hidden="true">
          ◫
        </span>

        <span className="bottom-navigation__label">
          Mis pedidos
        </span>
      </div>

      <div className="bottom-navigation__item">
        <span className="bottom-navigation__icon" aria-hidden="true">
          ♙
        </span>

        <span className="bottom-navigation__label">
          Perfil
        </span>
      </div>
    </nav>
  );
}

export default BottomNavigation;