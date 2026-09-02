import { useState } from 'react';

import './ConfirmarPedidoPage.css';

import {
  registrarPedido,
  type MetodoPago
} from '../services/pedidoService';

import type { CarritoItem } from '../types/CarritoItem';

interface ConfirmarPedidoPageProps {
  carrito: CarritoItem[];
  total: number;
  onVolverAlCarrito: () => void;
  onPedidoRegistrado: () => void;
}

function ConfirmarPedidoPage({
  carrito,
  total,
  onVolverAlCarrito,
  onPedidoRegistrado
}: ConfirmarPedidoPageProps) {
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [metodoPago, setMetodoPago] =
    useState<MetodoPago>('Tarjeta simulada');

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  const manejarConfirmacion = async () => {
    if (direccionEntrega.trim() === '') {
      setError('La dirección de entrega es obligatoria.');
      return;
    }

    if (carrito.length === 0) {
      setError('El carrito está vacío.');
      return;
    }

    try {
      setProcesando(true);
      setError('');

      await registrarPedido(
        carrito,
        direccionEntrega,
        metodoPago,
        'Aprobado'
      );

      onPedidoRegistrado();
    } catch (error) {
      console.error(
        'Error al registrar el pedido:',
        error
      );

      setError(
        'No fue posible registrar el pedido. Intenta nuevamente.'
      );
    } finally {
      setProcesando(false);
    }
  };

  return (
    <main className="confirmar-pedido-page">
      <header className="confirmar-pedido-page__header">
        <button
          type="button"
          className="confirmar-pedido-page__back-button"
          onClick={onVolverAlCarrito}
          aria-label="Volver al carrito"
        >
          ←
        </button>

        <h1 className="confirmar-pedido-page__title">
          Confirmar pedido
        </h1>
      </header>

      <section className="confirmar-pedido-page__section">
        <h2 className="confirmar-pedido-page__section-title">
          Dirección de entrega
        </h2>

        <div className="confirmar-pedido-page__field">
          <label
            className="confirmar-pedido-page__label"
            htmlFor="direccionEntrega"
          >
            Dirección
          </label>

          <input
            id="direccionEntrega"
            className="confirmar-pedido-page__input"
            type="text"
            value={direccionEntrega}
            onChange={(event) =>
              setDireccionEntrega(event.target.value)
            }
            placeholder="Ingresa la dirección de entrega"
          />
        </div>
      </section>

      <section className="confirmar-pedido-page__section">
        <h2 className="confirmar-pedido-page__section-title">
          Método de pago simulado
        </h2>

        <div className="confirmar-pedido-page__payment-options">
          <label className="confirmar-pedido-page__payment-option">
            <input
              className="confirmar-pedido-page__payment-radio"
              type="radio"
              name="metodoPago"
              value="Tarjeta simulada"
              checked={metodoPago === 'Tarjeta simulada'}
              onChange={() =>
                setMetodoPago('Tarjeta simulada')
              }
            />

            <span>
              Tarjeta simulada •••• •••• 1234
            </span>
          </label>

          <label className="confirmar-pedido-page__payment-option">
            <input
              className="confirmar-pedido-page__payment-radio"
              type="radio"
              name="metodoPago"
              value="Efectivo"
              checked={metodoPago === 'Efectivo'}
              onChange={() =>
                setMetodoPago('Efectivo')
              }
            />

            <span>
              Efectivo
            </span>
          </label>
        </div>
      </section>

      <section className="confirmar-pedido-page__section">
        <h2 className="confirmar-pedido-page__section-title">
          Resumen
        </h2>

        <div className="confirmar-pedido-page__summary-list">
          {carrito.map((item) => (
            <article
              key={item.producto._id}
              className="confirmar-pedido-page__summary-item"
            >
              <span className="confirmar-pedido-page__summary-name">
                {item.producto.nombre} × {item.cantidad}
              </span>

              <strong className="confirmar-pedido-page__summary-price">
                $
                {(
                  item.producto.precio * item.cantidad
                ).toLocaleString('es-CO')}
              </strong>
            </article>
          ))}
        </div>

        <div className="confirmar-pedido-page__total">
          <span className="confirmar-pedido-page__total-label">
            Total
          </span>

          <strong className="confirmar-pedido-page__total-value">
            ${total.toLocaleString('es-CO')}
          </strong>
        </div>
      </section>

      {error && (
        <p
          className="confirmar-pedido-page__error"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        className="confirmar-pedido-page__confirm-button"
        onClick={manejarConfirmacion}
        disabled={procesando}
      >
        {procesando
          ? 'Procesando...'
          : 'Confirmar y pagar'}
      </button>

      <p className="confirmar-pedido-page__note">
        Pago simulado. No se solicitan ni almacenan datos bancarios reales.
      </p>
    </main>
  );
}

export default ConfirmarPedidoPage;