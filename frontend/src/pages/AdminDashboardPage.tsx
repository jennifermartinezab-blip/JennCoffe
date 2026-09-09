import { useEffect, useMemo, useState } from 'react';

import AdminLayout from '../layouts/AdminLayout';

import {
  obtenerPedidosAdmin
} from '../services/adminPedidosService';

import {
  obtenerClientesAdmin
} from '../services/adminClientesService';

import type {
  PedidoAdmin
} from '../services/adminPedidosService';

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
  const [pedidos, setPedidos] =
    useState<PedidoAdmin[]>([]);

  const [totalClientes, setTotalClientes] =
    useState(0);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setCargando(true);
        setError('');

        const [
          pedidosObtenidos,
          clientesObtenidos
        ] = await Promise.all([
          obtenerPedidosAdmin(),
          obtenerClientesAdmin()
        ]);

        setPedidos(pedidosObtenidos);
        setTotalClientes(
          clientesObtenidos.length
        );
      } catch (error) {
        console.error(
          'Error al cargar el dashboard:',
          error
        );

        setError(
          'No fue posible cargar los indicadores del dashboard.'
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDashboard();
  }, []);

  const pedidosHoy = useMemo(() => {
    const hoy = new Date();

    return pedidos.filter((pedido) => {
      const fechaPedido =
        new Date(pedido.fecha);

      return (
        fechaPedido.getFullYear() ===
          hoy.getFullYear() &&
        fechaPedido.getMonth() ===
          hoy.getMonth() &&
        fechaPedido.getDate() ===
          hoy.getDate()
      );
    });
  }, [pedidos]);

  const ventasHoy = useMemo(() => {
    return pedidosHoy
      .filter(
        (pedido) =>
          pedido.estado !== 'Cancelado'
      )
      .reduce(
        (total, pedido) =>
          total + pedido.total,
        0
      );
  }, [pedidosHoy]);

  const totalPendientes = useMemo(() => {
    return pedidos.filter(
      (pedido) =>
        pedido.estado === 'Pendiente'
    ).length;
  }, [pedidos]);

  const pedidosRecientes = useMemo(() => {
    return [...pedidos]
      .sort(
        (a, b) =>
          new Date(b.fecha).getTime() -
          new Date(a.fecha).getTime()
      )
      .slice(0, 5);
  }, [pedidos]);

  const obtenerNombreCliente = (
    pedido: PedidoAdmin
  ) => {
    if (
      typeof pedido.cliente === 'string'
    ) {
      return 'Cliente';
    }

    const nombre =
      pedido.cliente.nombre || '';

    const apellidos =
      pedido.cliente.apellidos || '';

    const nombreCompleto =
      `${nombre} ${apellidos}`.trim();

    return nombreCompleto || 'Cliente';
  };

  const formatearMoneda = (
    valor: number
  ) => {
    return valor.toLocaleString(
      'es-CO',
      {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      }
    );
  };

  const formatearFecha = (
    fecha: string
  ) => {
    return new Date(fecha).toLocaleString(
      'es-CO',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

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
            Resumen general de la operación de JennCoffee.
          </p>
        </header>

        {error && (
          <p
            className="admin-dashboard__error"
            role="alert"
          >
            {error}
          </p>
        )}

        <section
          className="admin-dashboard__stats"
          aria-label="Indicadores administrativos"
        >
          <article className="admin-dashboard__stat-card">
            <h2 className="admin-dashboard__stat-title">
              Pedidos hoy
            </h2>

            <strong className="admin-dashboard__stat-value">
              {cargando
                ? '—'
                : pedidosHoy.length}
            </strong>
          </article>

          <article className="admin-dashboard__stat-card">
            <h2 className="admin-dashboard__stat-title">
              Ventas hoy
            </h2>

            <strong className="admin-dashboard__stat-value admin-dashboard__stat-value--money">
              {cargando
                ? '—'
                : formatearMoneda(
                    ventasHoy
                  )}
            </strong>
          </article>

          <article className="admin-dashboard__stat-card">
            <h2 className="admin-dashboard__stat-title">
              Pendientes
            </h2>

            <strong className="admin-dashboard__stat-value">
              {cargando
                ? '—'
                : totalPendientes}
            </strong>
          </article>

          <article className="admin-dashboard__stat-card">
            <h2 className="admin-dashboard__stat-title">
              Clientes
            </h2>

            <strong className="admin-dashboard__stat-value">
              {cargando
                ? '—'
                : totalClientes}
            </strong>
          </article>
        </section>

        <section className="admin-dashboard__recent">
          <div className="admin-dashboard__recent-header">
            <div>
              <h2 className="admin-dashboard__recent-title">
                Pedidos recientes
              </h2>

              <p className="admin-dashboard__recent-text">
                Últimos pedidos registrados en el sistema.
              </p>
            </div>

            <button
              type="button"
              className="admin-dashboard__recent-button"
              onClick={onIrPedidos}
            >
              Ver pedidos
            </button>
          </div>

          {cargando ? (
            <p className="admin-dashboard__recent-empty">
              Cargando pedidos...
            </p>
          ) : pedidosRecientes.length === 0 ? (
            <p className="admin-dashboard__recent-empty">
              No hay pedidos registrados.
            </p>
          ) : (
            <div className="admin-dashboard__table-wrapper">
              <table className="admin-dashboard__table">
                <thead>
                  <tr>
                    <th>
                      Cliente
                    </th>

                    <th>
                      Fecha
                    </th>

                    <th>
                      Total
                    </th>

                    <th>
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pedidosRecientes.map(
                    (pedido) => (
                      <tr key={pedido._id}>
                        <td>
                          {obtenerNombreCliente(
                            pedido
                          )}
                        </td>

                        <td>
                          {formatearFecha(
                            pedido.fecha
                          )}
                        </td>

                        <td>
                          {formatearMoneda(
                            pedido.total
                          )}
                        </td>

                        <td>
                          <span
                            className={`admin-dashboard__order-status admin-dashboard__order-status--${pedido.estado
                              .toLowerCase()
                              .normalize('NFD')
                              .replace(
                                /[\u0300-\u036f]/g,
                                ''
                              )
                              .replace(
                                /\s+/g,
                                '-'
                              )}`}
                          >
                            {pedido.estado}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </AdminLayout>
  );
}

export default AdminDashboardPage;