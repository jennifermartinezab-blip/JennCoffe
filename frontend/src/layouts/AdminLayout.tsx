import type { ReactNode } from 'react';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: ReactNode;
  vistaActiva:
    | 'dashboard'
    | 'productos'
    | 'categorias'
    | 'clientes'
    | 'pedidos'
    | 'usuarios';
  onIrDashboard: () => void;
  onIrProductos: () => void;
  onIrCategorias: () => void;
  onIrClientes: () => void;
  onIrPedidos: () => void;
  onIrUsuarios: () => void;
  onCerrarSesion: () => void;
}

function AdminLayout({
  children,
  vistaActiva,
  onIrDashboard,
  onIrProductos,
  onIrCategorias,
  onIrClientes,
  onIrPedidos,
  onIrUsuarios,
  onCerrarSesion
}: AdminLayoutProps) {
  const obtenerClaseBoton = (
    vista:
      | 'dashboard'
      | 'productos'
      | 'categorias'
      | 'clientes'
      | 'pedidos'
      | 'usuarios'
  ) => {
    return vistaActiva === vista
      ? 'admin-layout__nav-button admin-layout__nav-button--active'
      : 'admin-layout__nav-button';
  };

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__brand">
          <div
            className="admin-layout__brand-icon"
            aria-hidden="true"
          >
            🐱
          </div>

          <div>
            <strong className="admin-layout__brand-name">
              JennCoffee
            </strong>

            <span className="admin-layout__brand-subtitle">
              Admin
            </span>
          </div>
        </div>

        <div className="admin-layout__profile">
          <div
            className="admin-layout__profile-avatar"
            aria-hidden="true"
          >
            A
          </div>

          <div>
            <strong className="admin-layout__profile-name">
              Admin
            </strong>

            <span className="admin-layout__profile-role">
              Administrador
            </span>
          </div>
        </div>

        <nav
          className="admin-layout__nav"
          aria-label="Navegación administrativa"
        >
          <button
            type="button"
            className={obtenerClaseBoton('dashboard')}
            onClick={onIrDashboard}
          >
            <span
              className="admin-layout__nav-icon"
              aria-hidden="true"
            >
              ⌂
            </span>

            Dashboard
          </button>

          <button
            type="button"
            className={obtenerClaseBoton('productos')}
            onClick={onIrProductos}
          >
            <span
              className="admin-layout__nav-icon"
              aria-hidden="true"
            >
              ▣
            </span>

            Productos
          </button>

          <button
            type="button"
            className={obtenerClaseBoton('categorias')}
            onClick={onIrCategorias}
          >
            <span
              className="admin-layout__nav-icon"
              aria-hidden="true"
            >
              ◫
            </span>

            Categorías
          </button>

          <button
            type="button"
            className={obtenerClaseBoton('clientes')}
            onClick={onIrClientes}
          >
            <span
              className="admin-layout__nav-icon"
              aria-hidden="true"
            >
              ♙
            </span>

            Clientes
          </button>

          <button
            type="button"
            className={obtenerClaseBoton('pedidos')}
            onClick={onIrPedidos}
          >
            <span
              className="admin-layout__nav-icon"
              aria-hidden="true"
            >
              ▤
            </span>

            Pedidos
          </button>

          <button
            type="button"
            className={obtenerClaseBoton('usuarios')}
            onClick={onIrUsuarios}
          >
            <span
              className="admin-layout__nav-icon"
              aria-hidden="true"
            >
              ♧
            </span>

            Usuarios
          </button>
        </nav>

        <button
          type="button"
          className="admin-layout__logout"
          onClick={onCerrarSesion}
        >
          <span
            className="admin-layout__logout-icon"
            aria-hidden="true"
          >
            ↪
          </span>

          Cerrar sesión
        </button>
      </aside>

      <section className="admin-layout__content">
        {children}
      </section>
    </div>
  );
}

export default AdminLayout;