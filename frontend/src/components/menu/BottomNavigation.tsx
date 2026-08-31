import './BottomNavigation.css';

function BottomNavigation() {
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