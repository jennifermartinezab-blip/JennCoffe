import AdminLayout from '../layouts/AdminLayout';

import './AdminDashboardPage.css';

interface AdminDashboardPageProps {
  onCerrarSesion: () => void;
  onIrDashboard: () => void;
  onIrProductos: () => void;
  onIrCategorias: () => void;
  onIrClientes: () => void;
  onIrPedidos: () => void;
  onIrUsuarios: () => void;
}

function AdminDashboardPage({
  onCerrarSesion,
  onIrDashboard,
  onIrProductos,
  onIrCategorias,
  onIrClientes,
  onIrPedidos,
  onIrUsuarios
}: AdminDashboardPageProps) {
  return (
    <AdminLayout
      vistaActiva="dashboard"
      onIrDashboard={onIrDashboard}
      onIrProductos={onIrProductos}
      onIrCategorias={onIrCategorias}
      onIrClientes={onIrClientes}
      onIrPedidos={onIrPedidos}
      onIrUsuarios={onIrUsuarios}
      onCerrarSesion={onCerrarSesion}
    >
      <section className="admin-dashboard__content">
        <header className="admin-dashboard__header">
          <h1 className="admin-dashboard__title">
            Dashboard
          </h1>

          <p className="admin-dashboard__subtitle">
            Panel de administración de JennCoffee.
          </p>
        </header>

        <section
          className="admin-dashboard__stats"
          aria-label="Indicadores administrativos"
        >
          <article className="admin-dashboard__stat-card">
            <h2 className="admin-dashboard__stat-title">
              Pedidos hoy
            </h2>

            <strong className="admin-dashboard__stat-value">
              —
            </strong>
          </article>

          <article className="admin-dashboard__stat-card">
            <h2 className="admin-dashboard__stat-title">
              Ventas hoy
            </h2>

            <strong className="admin-dashboard__stat-value">
              —
            </strong>
          </article>

          <article className="admin-dashboard__stat-card">
            <h2 className="admin-dashboard__stat-title">
              Pendientes
            </h2>

            <strong className="admin-dashboard__stat-value">
              —
            </strong>
          </article>

          <article className="admin-dashboard__stat-card">
            <h2 className="admin-dashboard__stat-title">
              Clientes
            </h2>

            <strong className="admin-dashboard__stat-value">
              —
            </strong>
          </article>
        </section>

        <section className="admin-dashboard__recent">
          <h2 className="admin-dashboard__recent-title">
            Pedidos recientes
          </h2>

          <p className="admin-dashboard__recent-text">
            Aquí se mostrarán los pedidos más recientes.
          </p>
        </section>
      </section>
    </AdminLayout>
  );
}

export default AdminDashboardPage;