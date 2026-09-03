import { useEffect, useMemo, useState } from 'react';

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

type FiltroEstado =
  | 'Todos'
  | EstadoPedido;

const PEDIDOS_POR_PAGINA = 5;

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

  const [paginaActual, setPaginaActual] =
    useState(1);

  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstado>('Todos');

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setCargando(true);
        setError('');

        const estadoConsulta =
          filtroEstado === 'Todos'
            ? undefined
            : filtroEstado;

        const pedidosObtenidos =
          await obtenerPedidosAdmin(
            estadoConsulta
          );

        setPedidos(pedidosObtenidos);
        setPaginaActual(1);
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
  }, [filtroEstado]);

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

  const cambiarFiltro = (
    nuevoFiltro: FiltroEstado
  ) => {
    setFiltroEstado(nuevoFiltro);
    setPaginaActual(1);
  };

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

      if (
        filtroEstado !== 'Todos' &&
        pedidoActualizado.estado !==
          filtroEstado
      ) {
        setPedidos((pedidosActuales) =>
          pedidosActuales.filter(
            (item) =>
              item._id !== pedido._id
          )
        );

        return;
      }

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

  const filtros: {
    etiqueta: string;
    valor: FiltroEstado;
  }[] = [
    {
      etiqueta: 'Todos',
      valor: 'Todos'
    },
    {
      etiqueta: 'Pendientes',
      valor: 'Pendiente'
    },
    {
      etiqueta: 'En preparación',
      valor: 'En preparación'
    },
    {
      etiqueta: 'En camino',
      valor: 'En camino'
    },
    {
      etiqueta: 'Entregados',
      valor: 'Entregado'
    },
    {
      etiqueta: 'Cancelados',
      valor: 'Cancelado'
    }
  ];

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

        <nav
          className="admin-pedidos-filters"
          aria-label="Filtros de pedidos por estado"
        >
          {filtros.map((filtro) => (
            <button
              key={filtro.valor}
              type="button"
              className={
                filtroEstado === filtro.valor
                  ? 'admin-pedidos-filters__button admin-pedidos-filters__button--active'
                  : 'admin-pedidos-filters__button'
              }
              onClick={() =>
                cambiarFiltro(
                  filtro.valor
                )
              }
            >
              {filtro.etiqueta}
            </button>
          ))}
        </nav>

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

            {pedidosOrdenados.length === 0 ? (
              <p className="admin-pedidos-page__empty">
                No hay pedidos para el filtro seleccionado.
              </p>
            ) : (
              <>
                <section
                  className="admin-pedidos-list"
                  aria-label="Listado administrativo de pedidos"
                >
                  {pedidosPaginaActual.map((pedido) => {
                    const siguienteEstado =
                      obtenerSiguienteEstado(
                        pedido.estado
                      );

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

                {totalPaginas > 1 && (
                  <nav
                    className="admin-pedidos-pagination"
                    aria-label="Paginación administrativa de pedidos"
                  >
                    <button
                      type="button"
                      className="admin-pedidos-pagination__button"
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

                    <div className="admin-pedidos-pagination__pages">
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
                                  ? 'admin-pedidos-pagination__page admin-pedidos-pagination__page--active'
                                  : 'admin-pedidos-pagination__page'
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
                              {numeroPagina}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      type="button"
                      className="admin-pedidos-pagination__button"
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
          </>
        )}
      </main>
    </AdminLayout>
  );
}

export default AdminPedidosPage;