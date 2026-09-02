import { useEffect, useState } from 'react';

import './MisPedidosPage.css';

import {
  obtenerMisPedidos,
  type PedidoCliente
} from '../services/misPedidosService';

interface MisPedidosPageProps {
  onVolverAlMenu: () => void;
  onVerDetalle: (pedidoId: string) => void;
}

function MisPedidosPage({
  onVolverAlMenu,
  onVerDetalle
}: MisPedidosPageProps) {
  const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setCargando(true);
        setError('');

        const pedidosObtenidos = await obtenerMisPedidos();

        setPedidos(pedidosObtenidos);
      } catch (error) {
        console.error(
          'Error al consultar los pedidos del cliente:',
          error
        );

        setError(
          'No fue posible consultar tus pedidos. Intenta nuevamente.'
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

  const obtenerClaseEstado = (
    estado: PedidoCliente['estado']
  ) => {
    switch (estado) {
      case 'Pendiente':
        return 'pedido-card__status--pendiente';

      case 'En preparación':
        return 'pedido-card__status--preparacion';

      case 'En camino':
        return 'pedido-card__status--camino';

      case 'Entregado':
        return 'pedido-card__status--entregado';

      case 'Cancelado':
        return 'pedido-card__status--cancelado';

      default:
        return '';
    }
  };

  if (cargando) {
    return (
      <main className="mis-pedidos-page">
        <header className="mis-pedidos-page__header">
          <h1 className="mis-pedidos-page__title">
            Mis pedidos
          </h1>
        </header>

        <p>Cargando pedidos...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mis-pedidos-page">
        <header className="mis-pedidos-page__header">
          <button
            type="button"
            className="mis-pedidos-page__back-button"
            onClick={onVolverAlMenu}
            aria-label="Volver al menú"
          >
            ←
          </button>

          <h1 className="mis-pedidos-page__title">
            Mis pedidos
          </h1>
        </header>

        <p
          className="mis-pedidos-page__error"
          role="alert"
        >
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="mis-pedidos-page">
      <header className="mis-pedidos-page__header">
        <button
          type="button"
          className="mis-pedidos-page__back-button"
          onClick={onVolverAlMenu}
          aria-label="Volver al menú"
        >
          ←
        </button>

        <h1 className="mis-pedidos-page__title">
          Mis pedidos
        </h1>
      </header>

      {pedidos.length === 0 ? (
        <section className="mis-pedidos-page__empty">
          <div
            className="mis-pedidos-page__empty-icon"
            aria-hidden="true"
          >
            ◫
          </div>

          <h2 className="mis-pedidos-page__empty-title">
            Aún no tienes pedidos
          </h2>

          <p className="mis-pedidos-page__empty-text">
            Tus pedidos aparecerán aquí después de realizar una compra.
          </p>
        </section>
      ) : (
        <section
          className="mis-pedidos-page__list"
          aria-label="Historial de pedidos"
        >
          {pedidos.map((pedido) => (
            <article
              key={pedido._id}
              className="pedido-card"
            >
              <div className="pedido-card__header">
                <h2 className="pedido-card__number">
                  Pedido #{pedido._id.slice(-6)}
                </h2>

                <span
                  className={`pedido-card__status ${obtenerClaseEstado(
                    pedido.estado
                  )}`}
                >
                  {pedido.estado}
                </span>
              </div>

              <div className="pedido-card__meta">
                <div className="pedido-card__meta-item">
                  <span className="pedido-card__meta-label">
                    Fecha
                  </span>

                  <span className="pedido-card__meta-value">
                    {formatearFecha(pedido.fecha)}
                  </span>
                </div>

                <div className="pedido-card__meta-item">
                  <span className="pedido-card__meta-label">
                    Dirección
                  </span>

                  <span className="pedido-card__meta-value">
                    {pedido.direccionEntrega}
                  </span>
                </div>
              </div>

              <div className="pedido-card__products">
                <h3 className="pedido-card__products-title">
                  Productos
                </h3>

                <ul className="pedido-card__products-list">
                  {pedido.productos.map((item, index) => (
                    <li
                      key={`${pedido._id}-${index}`}
                      className="pedido-card__product"
                    >
                      <span className="pedido-card__product-name">
                        {item.nombre}
                      </span>

                      <span className="pedido-card__product-quantity">
                        × {item.cantidad}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pedido-card__footer">
                <div>
                  <span className="pedido-card__total-label">
                    Total
                  </span>

                  <strong className="pedido-card__total-value">
                    ${pedido.total.toLocaleString('es-CO')}
                  </strong>
                </div>

                <button
                  type="button"
                  className="pedido-card__detail-button"
                  onClick={() => onVerDetalle(pedido._id)}
                >
                  Ver detalle
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MisPedidosPage;