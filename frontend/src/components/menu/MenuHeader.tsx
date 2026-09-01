import './MenuHeader.css';

interface MenuHeaderProps {
  onCerrarSesion: () => void;
}

function MenuHeader({
  onCerrarSesion
}: MenuHeaderProps) {
  return (
    <header className="menu-header">
      <div className="menu-header__top">
        <span className="menu-header__menu" aria-hidden="true">
          ☰
        </span>

        <div className="menu-header__brand">
          <span className="menu-header__brand-text">
            JennCoffee
          </span>
        </div>

        <div className="menu-header__actions">
          <span aria-hidden="true">⌕</span>
          <span aria-hidden="true">♡</span>
          <span aria-hidden="true">🛒</span>

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
        <span aria-hidden="true">⌕</span>

        <span className="menu-header__search-placeholder">
          Buscar productos, categorías...
        </span>
      </div>
    </header>
  );
}

export default MenuHeader;