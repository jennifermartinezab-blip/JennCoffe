import { useEffect, useMemo, useState } from 'react';

import './MisPedidosPage.css';

import {
  cancelarPedido,
  obtenerMisPedidos,
  type PedidoCliente
} from '../services/misPedidosService';

interface MisPedidosPageProps {
  onVolverAlMenu: () => void;
  onVerDetalle: (pedidoId: string) => void;
}

const PEDIDOS_POR_PAGINA = 5;

function MisPedidosPage({
  onVolverAlMenu,
  onVerDetalle
}: MisPedidosPageProps) {
  const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [cancelandoId, setCancelandoId] =
    useState<string | null>(null);

  const [paginaActual, setPaginaActual] =
    useState(1);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setCargando(true);
        setError('');

        const pedidosObtenidos =
          await obtenerMisPedidos();

        setPedidos(pedidosObtenidos);
        setPaginaActual(1);
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

  const pedidosOrdenados = useMemo(() => {
    return [...pedidos].sort((a, b) => {
      return (
        new Date(b.fecha).getTime() -
        new Date(a.fecha).getTime()
      );
    });
  }, [pedidos]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      pedidosOrdenados.length /
        PEDIDOS_POR_PAGINA
    )
  );

  const pedidosPaginaActual = useMemo(() => {
    const inicio =
      (paginaActual - 1) *
      PEDIDOS_POR_PAGINA;

    const fin =
      inicio + PEDIDOS_POR_PAGINA;

    return pedidosOrdenados.slice(
      inicio,
      fin
    );
  }, [
    pedidosOrdenados,
    paginaActual
  ]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [
    paginaActual,
    totalPaginas
  ]);

  const cambiarPagina = (
    nuevaPagina: number
  ) => {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas
    ) {
      return;
    }

    setPaginaActual(nuevaPagina);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const formatearFecha = (
    fecha: string
  ) => {
    return new Intl.DateTimeFormat(
      'es-CO',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    ).format(new Date(fecha));
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

  const manejarCancelacion = async (
    pedido: PedidoCliente
  ) => {
    if (
      pedido.estado !== 'Pendiente'
    ) {
      return;
    }

    const confirmar =
      window.confirm(
        `¿Deseas cancelar el pedido #${pedido._id.slice(-6)}?`
      );

    if (!confirmar) {
      return;
    }

    try {
      setCancelandoId(
        pedido._id
      );

      setError('');

      const pedidoCancelado =
        await cancelarPedido(
          pedido._id
        );

      setPedidos(
        (pedidosActuales) =>
          pedidosActuales.map(
            (item) => {
              if (
                item._id !==
                pedido._id
              ) {
                return item;
              }

              return {
                ...item,
                ...pedidoCancelado,

                productos:
                  pedidoCancelado
                    .productos
                    ?.length > 0
                    ? pedidoCancelado
                        .productos
                    : item.productos,

                pago:
                  pedidoCancelado
                    .pago ??
                  item.pago
              };
            }
          )
      );
    } catch (error) {
      console.error(
        'Error al cancelar el pedido:',
        error
      );

      setError(
        'No fue posible cancelar el pedido. Verifica que aún se encuentre pendiente.'
      );
    } finally {
      setCancelandoId(null);
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

        <p>
          Cargando pedidos...
        </p>
      </main>
    );
  }

  if (
    error &&
    pedidos.length === 0
  ) {
    return (
      <main className="mis-pedidos-page">
        <header className="mis-pedidos-page__header">
          <button
            type="button"
            className="mis-pedidos-page__back-button"
            onClick={
              onVolverAlMenu
            }
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
          onClick={
            onVolverAlMenu
          }
          aria-label="Volver al menú"
        >
          ←
        </button>

        <h1 className="mis-pedidos-page__title">
          Mis pedidos
        </h1>
      </header>

      {error && (
        <p
          className="mis-pedidos-page__error"
          role="alert"
        >
          {error}
        </p>
      )}

      {pedidosOrdenados.length ===
      0 ? (
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
        <>
          <section
            className="mis-pedidos-page__list"
            aria-label="Historial de pedidos"
          >
            {pedidosPaginaActual.map(
              (pedido) => (
                <article
                  key={pedido._id}
                  className="pedido-card"
                >
                  <div className="pedido-card__header">
                    <h2 className="pedido-card__number">
                      Pedido #
                      {pedido._id.slice(
                        -6
                      )}
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
                        {formatearFecha(
                          pedido.fecha
                        )}
                      </span>
                    </div>

                    <div className="pedido-card__meta-item">
                      <span className="pedido-card__meta-label">
                        Dirección
                      </span>

                      <span className="pedido-card__meta-value">
                        {
                          pedido.direccionEntrega
                        }
                      </span>
                    </div>
                  </div>

                  <div className="pedido-card__products">
                    <h3 className="pedido-card__products-title">
                      Productos
                    </h3>

                    <ul className="pedido-card__products-list">
                      {pedido.productos.map(
                        (
                          item,
                          index
                        ) => (
                          <li
                            key={`${pedido._id}-${index}`}
                            className="pedido-card__product"
                          >
                            <span className="pedido-card__product-name">
                              {
                                item.nombre
                              }
                            </span>

                            <span className="pedido-card__product-quantity">
                              ×{' '}
                              {
                                item.cantidad
                              }
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="pedido-card__footer">
                    <div>
                      <span className="pedido-card__total-label">
                        Total
                      </span>

                      <strong className="pedido-card__total-value">
                        $
                        {pedido.total.toLocaleString(
                          'es-CO'
                        )}
                      </strong>
                    </div>

                    <div className="pedido-card__actions">
                      <button
                        type="button"
                        className="pedido-card__detail-button"
                        onClick={() =>
                          onVerDetalle(
                            pedido._id
                          )
                        }
                      >
                        Ver detalle
                      </button>

                      {pedido.estado ===
                        'Pendiente' && (
                        <button
                          type="button"
                          className="pedido-card__cancel-button"
                          disabled={
                            cancelandoId ===
                            pedido._id
                          }
                          onClick={() =>
                            manejarCancelacion(
                              pedido
                            )
                          }
                        >
                          {cancelandoId ===
                          pedido._id
                            ? 'Cancelando...'
                            : 'Cancelar pedido'}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            )}
          </section>

          {totalPaginas > 1 && (
            <nav
              className="mis-pedidos-pagination"
              aria-label="Paginación de pedidos"
            >
              <button
                type="button"
                className="mis-pedidos-pagination__button"
                disabled={
                  paginaActual === 1
                }
                onClick={() =>
                  cambiarPagina(
                    paginaActual - 1
                  )
                }
              >
                ← Anterior
              </button>

              <div className="mis-pedidos-pagination__pages">
                {Array.from(
                  {
                    length:
                      totalPaginas
                  },
                  (_, index) => {
                    const numeroPagina =
                      index + 1;

                    return (
                      <button
                        key={
                          numeroPagina
                        }
                        type="button"
                        className={
                          paginaActual ===
                          numeroPagina
                            ? 'mis-pedidos-pagination__page mis-pedidos-pagination__page--active'
                            : 'mis-pedidos-pagination__page'
                        }
                        onClick={() =>
                          cambiarPagina(
                            numeroPagina
                          )
                        }
                        aria-current={
                          paginaActual ===
                          numeroPagina
                            ? 'page'
                            : undefined
                        }
                      >
                        {
                          numeroPagina
                        }
                      </button>
                    );
                  }
                )}
              </div>

              <button
                type="button"
                className="mis-pedidos-pagination__button"
                disabled={
                  paginaActual ===
                  totalPaginas
                }
                onClick={() =>
                  cambiarPagina(
                    paginaActual + 1
                  )
                }
              >
                Siguiente →
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}

export default MisPedidosPage;