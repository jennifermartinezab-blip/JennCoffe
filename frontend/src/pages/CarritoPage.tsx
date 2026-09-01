import './CarritoPage.css';

import type { CarritoItem } from '../types/CarritoItem';

interface CarritoPageProps {
  carrito: CarritoItem[];
  onEliminarProducto: (productoId: string) => void;
  onAumentarCantidad: (productoId: string) => void;
  onDisminuirCantidad: (productoId: string) => void;
  onVolverAlMenu: () => void;
}

function CarritoPage({
  carrito,
  onEliminarProducto,
  onAumentarCantidad,
  onDisminuirCantidad,
  onVolverAlMenu
}: CarritoPageProps) {
  return (
    <main className="carrito-page">
      <header className="carrito-page__header">
        <button
          type="button"
          className="carrito-page__back-button"
          onClick={onVolverAlMenu}
          aria-label="Volver al menú"
        >
          ←
        </button>

        <h1 className="carrito-page__title">
          Carrito
        </h1>
      </header>

      {carrito.length === 0 ? (
        <section className="carrito-page__empty">
          <div
            className="carrito-page__empty-icon"
            aria-hidden="true"
          >
            🛒
          </div>

          <h2 className="carrito-page__empty-title">
            Tu carrito está vacío
          </h2>

          <p className="carrito-page__empty-text">
            Agrega productos del menú para comenzar tu pedido.
          </p>

          <button
            type="button"
            className="carrito-page__menu-button"
            onClick={onVolverAlMenu}
          >
            Volver al menú
          </button>
        </section>
      ) : (
        <section
          className="carrito-page__list"
          aria-label="Productos en el carrito"
        >
          {carrito.map((item) => (
            <article
              key={item.producto._id}
              className="carrito-item"
            >
              <div className="carrito-item__image-container">
                <img
                  className="carrito-item__image"
                  src={`/images/products/${item.producto.imagen}`}
                  alt={item.producto.nombre}
                />
              </div>

              <div className="carrito-item__content">
                <h2 className="carrito-item__name">
                  {item.producto.nombre}
                </h2>

                <p className="carrito-item__price">
                  ${item.producto.precio.toLocaleString('es-CO')}
                </p>

                <div
                  className="carrito-item__quantity-control"
                  aria-label={`Cantidad de ${item.producto.nombre}`}
                >
                  <button
                    type="button"
                    className="carrito-item__quantity-button"
                    onClick={() =>
                      onDisminuirCantidad(item.producto._id)
                    }
                    disabled={item.cantidad === 1}
                    aria-label={`Disminuir cantidad de ${item.producto.nombre}`}
                  >
                    −
                  </button>

                  <span
                    className="carrito-item__quantity-value"
                    aria-live="polite"
                  >
                    {item.cantidad}
                  </span>

                  <button
                    type="button"
                    className="carrito-item__quantity-button"
                    onClick={() =>
                      onAumentarCantidad(item.producto._id)
                    }
                    aria-label={`Aumentar cantidad de ${item.producto.nombre}`}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="carrito-item__delete-button"
                onClick={() =>
                  onEliminarProducto(item.producto._id)
                }
                aria-label={`Eliminar ${item.producto.nombre} del carrito`}
              >
                Eliminar
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default CarritoPage;