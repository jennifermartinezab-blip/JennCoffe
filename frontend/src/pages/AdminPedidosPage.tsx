import { useEffect, useState } from 'react';

import AdminLayout from '../layouts/AdminLayout';

import './AdminPedidosPage.css';

import {
  actualizarEstadoPedido,
  obtenerPedidosAdmin,
  type EstadoPedido,
  type PedidoAdmin
} from '../services/adminPedidosService';

interface AdminPedidosPageProps {
  onCerrarSesion: () => void;
  onIrDashboard: () => void;
  onIrProductos: () => void;
  onIrCategorias: () => void;
  onIrClientes: () => void;
  onIrPedidos: () => void;
  onIrUsuarios: () => void;
}

function AdminPedidosPage({
  onCerrarSesion,
  onIrDashboard,
  onIrProductos,
  onIrCategorias,
  onIrClientes,
  onIrPedidos,
  onIrUsuarios
}: AdminPedidosPageProps) {
  const [pedidos, setPedidos] = useState<PedidoAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [actualizandoId, setActualizandoId] =
    useState<string | null>(null);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setCargando(true);
        setError('');

        const pedidosObtenidos =
          await obtenerPedidosAdmin();

        setPedidos(pedidosObtenidos);
      } catch (error) {
        console.error(
          'Error al consultar pedidos administrativos:',
          error
        );

        setError(
          'No fue posible consultar los pedidos.'
        );
      } finally {
        setCargando(false);
      }
    };

    cargarPedidos();
  }, []);

  const formatearFecha = (fecha: string) => {
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(fecha));
  };

  const obtenerNombreCliente = (
    pedido: PedidoAdmin
  ) => {
    if (typeof pedido.cliente === 'string') {
      return pedido.cliente;
    }

    const nombreCompleto = [
      pedido.cliente.nombre,
      pedido.cliente.apellidos
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    return nombreCompleto || 'Cliente';
  };

  const obtenerSiguienteEstado = (
    estado: EstadoPedido
  ): EstadoPedido | null => {
    switch (estado) {
      case 'Pendiente':
        return 'En preparación';

      case 'En preparación':
        return 'En camino';

      case 'En camino':
        return 'Entregado';

      default:
        return null;
    }
  };

  const obtenerClaseEstado = (
    estado: EstadoPedido
  ) => {
    switch (estado) {
      case 'Pendiente':
        return 'admin-pedido-card__status--pendiente';

      case 'En preparación':
        return 'admin-pedido-card__status--preparacion';

      case 'En camino':
        return 'admin-pedido-card__status--camino';

      case 'Entregado':
        return 'admin-pedido-card__status--entregado';

      case 'Cancelado':
        return 'admin-pedido-card__status--cancelado';

      default:
        return '';
    }
  };

  const cambiarEstado = async (
    pedido: PedidoAdmin
  ) => {
    const siguienteEstado =
      obtenerSiguienteEstado(pedido.estado);

    if (!siguienteEstado) {
      return;
    }

    try {
      setActualizandoId(pedido._id);
      setError('');

      const pedidoActualizado =
        await actualizarEstadoPedido(
          pedido._id,
          siguienteEstado
        );

      setPedidos((pedidosActuales) =>
        pedidosActuales.map((item) => {
          if (item._id !== pedido._id) {
            return item;
          }

          return {
            ...item,
            ...pedidoActualizado,
            cliente:
              typeof pedidoActualizado.cliente === 'string'
                ? item.cliente
                : pedidoActualizado.cliente
          };
        })
      );
    } catch (error) {
      console.error(
        'Error al actualizar el estado del pedido:',
        error
      );

      setError(
        'No fue posible actualizar el estado del pedido.'
      );
    } finally {
      setActualizandoId(null);
    }
  };

  return (
    <AdminLayout
      vistaActiva="pedidos"
      onIrDashboard={onIrDashboard}
      onIrProductos={onIrProductos}
      onIrCategorias={onIrCategorias}
      onIrClientes={onIrClientes}
      onIrPedidos={onIrPedidos}
      onIrUsuarios={onIrUsuarios}
      onCerrarSesion={onCerrarSesion}
    >
      <main className="admin-pedidos-page">
        <header className="admin-pedidos-page__header">
          <div className="admin-pedidos-page__header-left">
            <h1 className="admin-pedidos-page__title">
              Pedidos
            </h1>

            <p className="admin-pedidos-page__subtitle">
              Gestión administrativa de pedidos de JennCoffee.
            </p>
          </div>
        </header>

        {cargando ? (
          <p className="admin-pedidos-page__loading">
            Cargando pedidos...
          </p>
        ) : (
          <>
            {error && (
              <p
                className="admin-pedidos-page__error"
                role="alert"
              >
                {error}
              </p>
            )}

            {pedidos.length === 0 ? (
              <p className="admin-pedidos-page__empty">
                No hay pedidos registrados.
              </p>
            ) : (
              <section
                className="admin-pedidos-list"
                aria-label="Listado administrativo de pedidos"
              >
                {pedidos.map((pedido) => {
                  const siguienteEstado =
                    obtenerSiguienteEstado(pedido.estado);

                  return (
                    <article
                      key={pedido._id}
                      className="admin-pedido-card"
                    >
                      <div className="admin-pedido-card__top">
                        <h2 className="admin-pedido-card__number">
                          Pedido #{pedido._id.slice(-6)}
                        </h2>

                        <span
                          className={`admin-pedido-card__status ${obtenerClaseEstado(
                            pedido.estado
                          )}`}
                        >
                          {pedido.estado}
                        </span>
                      </div>

                      <div className="admin-pedido-card__grid">
                        <div className="admin-pedido-card__field">
                          <span className="admin-pedido-card__label">
                            Cliente
                          </span>

                          <span className="admin-pedido-card__value">
                            {obtenerNombreCliente(pedido)}
                          </span>
                        </div>

                        <div className="admin-pedido-card__field">
                          <span className="admin-pedido-card__label">
                            Fecha
                          </span>

                          <span className="admin-pedido-card__value">
                            {formatearFecha(pedido.fecha)}
                          </span>
                        </div>

                        <div className="admin-pedido-card__field">
                          <span className="admin-pedido-card__label">
                            Dirección
                          </span>

                          <span className="admin-pedido-card__value">
                            {pedido.direccionEntrega}
                          </span>
                        </div>

                        <div className="admin-pedido-card__field">
                          <span className="admin-pedido-card__label">
                            Estado
                          </span>

                          <span className="admin-pedido-card__value">
                            {pedido.estado}
                          </span>
                        </div>
                      </div>

                      <div className="admin-pedido-card__footer">
                        <div className="admin-pedido-card__total">
                          <span className="admin-pedido-card__total-label">
                            Total
                          </span>

                          <strong className="admin-pedido-card__total-value">
                            ${pedido.total.toLocaleString('es-CO')}
                          </strong>
                        </div>

                        {siguienteEstado ? (
                          <button
                            type="button"
                            className="admin-pedido-card__action-button"
                            disabled={
                              actualizandoId === pedido._id
                            }
                            onClick={() =>
                              cambiarEstado(pedido)
                            }
                          >
                            {actualizandoId === pedido._id
                              ? 'Actualizando...'
                              : `Cambiar a ${siguienteEstado}`}
                          </button>
                        ) : (
                          <p className="admin-pedido-card__finished">
                            Este pedido no tiene un siguiente estado disponible.
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </>
        )}
      </main>
    </AdminLayout>
  );
}

export default AdminPedidosPage;