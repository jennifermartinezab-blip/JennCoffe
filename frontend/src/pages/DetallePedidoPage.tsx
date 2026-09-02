import { useEffect, useState } from 'react';

import './DetallePedidoPage.css';

import {
  obtenerDetallePedido,
  type DetallePedido
} from '../services/detallePedidoService';

interface DetallePedidoPageProps {
  pedidoId: string;
  onVolverAMisPedidos: () => void;
}

function DetallePedidoPage({
  pedidoId,
  onVolverAMisPedidos
}: DetallePedidoPageProps) {
  const [pedido, setPedido] = useState<DetallePedido | null>(
    null
  );

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        setCargando(true);
        setError('');

        const pedidoObtenido =
          await obtenerDetallePedido(pedidoId);

        setPedido(pedidoObtenido);
      } catch (error) {
        console.error(
          'Error al consultar el detalle del pedido:',
          error
        );

        setError(
          'No fue posible consultar el detalle del pedido.'
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [pedidoId]);

  const formatearFecha = (fecha: string) => {
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(fecha));
  };

  const obtenerClaseEstado = (
    estado: DetallePedido['estado']
  ) => {
    switch (estado) {
      case 'Pendiente':
        return 'detalle-pedido-card__status--pendiente';

      case 'En preparación':
        return 'detalle-pedido-card__status--preparacion';

      case 'En camino':
        return 'detalle-pedido-card__status--camino';

      case 'Entregado':
        return 'detalle-pedido-card__status--entregado';

      case 'Cancelado':
        return 'detalle-pedido-card__status--cancelado';

      default:
        return '';
    }
  };

  if (cargando) {
    return (
      <main className="detalle-pedido-page">
        <header className="detalle-pedido-page__header">
          <button
            type="button"
            className="detalle-pedido-page__back-button"
            onClick={onVolverAMisPedidos}
            aria-label="Volver a mis pedidos"
          >
            ←
          </button>

          <h1 className="detalle-pedido-page__title">
            Detalle del pedido
          </h1>
        </header>

        <p className="detalle-pedido-page__loading">
          Cargando pedido...
        </p>
      </main>
    );
  }

  if (error || !pedido) {
    return (
      <main className="detalle-pedido-page">
        <header className="detalle-pedido-page__header">
          <button
            type="button"
            className="detalle-pedido-page__back-button"
            onClick={onVolverAMisPedidos}
            aria-label="Volver a mis pedidos"
          >
            ←
          </button>

          <h1 className="detalle-pedido-page__title">
            Detalle del pedido
          </h1>
        </header>

        <p
          className="detalle-pedido-page__error"
          role="alert"
        >
          {error || 'Pedido no encontrado.'}
        </p>
      </main>
    );
  }

  return (
    <main className="detalle-pedido-page">
      <header className="detalle-pedido-page__header">
        <button
          type="button"
          className="detalle-pedido-page__back-button"
          onClick={onVolverAMisPedidos}
          aria-label="Volver a mis pedidos"
        >
          ←
        </button>

        <h1 className="detalle-pedido-page__title">
          Detalle del pedido
        </h1>
      </header>

      <article className="detalle-pedido-card">
        <div className="detalle-pedido-card__top">
          <div>
            <h2 className="detalle-pedido-card__number">
              Pedido #{pedido._id.slice(-6)}
            </h2>

            <p className="detalle-pedido-card__date">
              {formatearFecha(pedido.fecha)}
            </p>
          </div>

          <span
            className={`detalle-pedido-card__status ${obtenerClaseEstado(
              pedido.estado
            )}`}
          >
            {pedido.estado}
          </span>
        </div>

        <section className="detalle-pedido-section">
          <h3 className="detalle-pedido-section__title">
            Productos
          </h3>

          <div className="detalle-pedido-products">
            {pedido.productos.map((item, index) => (
              <article
                key={`${pedido._id}-${index}`}
                className="detalle-pedido-product"
              >
                <h4 className="detalle-pedido-product__name">
                  {item.nombre}
                </h4>

                <span className="detalle-pedido-product__quantity">
                  × {item.cantidad}
                </span>

                <span className="detalle-pedido-product__price">
                  Precio unitario: $
                  {item.precioUnitario.toLocaleString(
                    'es-CO'
                  )}
                </span>

                <strong className="detalle-pedido-product__subtotal">
                  $
                  {item.subtotal.toLocaleString(
                    'es-CO'
                  )}
                </strong>
              </article>
            ))}
          </div>
        </section>

        <section className="detalle-pedido-summary">
          <div className="detalle-pedido-summary__row">
            <span className="detalle-pedido-summary__label">
              Dirección de entrega
            </span>

            <span className="detalle-pedido-summary__value">
              {pedido.direccionEntrega}
            </span>
          </div>

          <div className="detalle-pedido-summary__row">
            <span className="detalle-pedido-summary__label">
              Método de pago
            </span>

            <span className="detalle-pedido-summary__value">
              {pedido.pago
                ? pedido.pago.metodo
                : 'No registrado'}
            </span>
          </div>

          <div className="detalle-pedido-summary__row">
            <span className="detalle-pedido-summary__label">
              Estado del pago
            </span>

            <span
              className={
                pedido.pago?.estado === 'Aprobado'
                  ? 'detalle-pedido-summary__value detalle-pedido-summary__value--success'
                  : 'detalle-pedido-summary__value'
              }
            >
              {pedido.pago
                ? pedido.pago.estado
                : 'No registrado'}
            </span>
          </div>
        </section>

        <div className="detalle-pedido-total">
          <span className="detalle-pedido-total__label">
            Total
          </span>

          <strong className="detalle-pedido-total__value">
            ${pedido.total.toLocaleString('es-CO')}
          </strong>
        </div>
      </article>
    </main>
  );
}

export default DetallePedidoPage;