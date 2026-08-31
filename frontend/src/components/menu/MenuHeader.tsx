import './MenuHeader.css';

function MenuHeader() {
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