import { useState } from 'react';

import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import CarritoPage from './pages/CarritoPage';
import ConfirmarPedidoPage from './pages/ConfirmarPedidoPage';
import MisPedidosPage from './pages/MisPedidosPage';
import DetallePedidoPage from './pages/DetallePedidoPage';

import {
  eliminarToken,
  logout,
  obtenerToken
} from './services/authService';

import type { Producto } from './types/Producto';
import type { CarritoItem } from './types/CarritoItem';

type VistaActual =
  | 'menu'
  | 'carrito'
  | 'confirmarPedido'
  | 'misPedidos'
  | 'detallePedido';

function App() {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [vistaActual, setVistaActual] =
    useState<VistaActual>('menu');

  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] =
    useState<string | null>(null);

  const [autenticado, setAutenticado] = useState(
    Boolean(obtenerToken())
  );

  const agregarAlCarrito = (producto: Producto) => {
    if (!producto.disponibilidad || producto.estado !== 'Activo') {
      return;
    }

    setCarrito((carritoActual) => {
      const productoYaAgregado = carritoActual.some(
        (item) => item.producto._id === producto._id
      );

      if (productoYaAgregado) {
        return carritoActual;
      }

      return [
        ...carritoActual,
        {
          producto,
          cantidad: 1
        }
      ];
    });
  };

  const eliminarProductoDelCarrito = (productoId: string) => {
    setCarrito((carritoActual) =>
      carritoActual.filter(
        (item) => item.producto._id !== productoId
      )
    );
  };

  const aumentarCantidad = (productoId: string) => {
    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.producto._id === productoId
          ? {
              ...item,
              cantidad: item.cantidad + 1
            }
          : item
      )
    );
  };

  const disminuirCantidad = (productoId: string) => {
    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.producto._id === productoId &&
        item.cantidad > 1
          ? {
              ...item,
              cantidad: item.cantidad - 1
            }
          : item
      )
    );
  };

  const calcularTotalCarrito = () => {
    return carrito.reduce(
      (total, item) =>
        total + item.producto.precio * item.cantidad,
      0
    );
  };

  const abrirCarrito = () => {
    setVistaActual('carrito');
  };

  const abrirConfirmacionPedido = () => {
    if (carrito.length === 0) {
      return;
    }

    setVistaActual('confirmarPedido');
  };

  const abrirMisPedidos = () => {
    setVistaActual('misPedidos');
  };

  const abrirDetallePedido = (pedidoId: string) => {
    setPedidoSeleccionadoId(pedidoId);
    setVistaActual('detallePedido');
  };

  const volverAlCarrito = () => {
    setVistaActual('carrito');
  };

  const volverAMisPedidos = () => {
    setPedidoSeleccionadoId(null);
    setVistaActual('misPedidos');
  };

  const volverAlMenu = () => {
    setVistaActual('menu');
  };

  const loginCorrecto = () => {
    setAutenticado(true);
    setVistaActual('menu');
  };

  const pedidoRegistrado = () => {
    setCarrito([]);
    setVistaActual('misPedidos');
  };

  const cerrarSesion = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        'No fue posible completar el logout en el servidor:',
        error
      );
    } finally {
      eliminarToken();
      setCarrito([]);
      setPedidoSeleccionadoId(null);
      setVistaActual('menu');
      setAutenticado(false);
    }
  };

  if (!autenticado) {
    return (
      <LoginPage
        onLoginCorrecto={loginCorrecto}
      />
    );
  }

  if (
    vistaActual === 'detallePedido' &&
    pedidoSeleccionadoId
  ) {
    return (
      <DetallePedidoPage
        pedidoId={pedidoSeleccionadoId}
        onVolverAMisPedidos={volverAMisPedidos}
      />
    );
  }

  if (vistaActual === 'misPedidos') {
    return (
      <MisPedidosPage
        onVolverAlMenu={volverAlMenu}
        onVerDetalle={abrirDetallePedido}
      />
    );
  }

  if (vistaActual === 'confirmarPedido') {
    return (
      <ConfirmarPedidoPage
        carrito={carrito}
        total={calcularTotalCarrito()}
        onVolverAlCarrito={volverAlCarrito}
        onPedidoRegistrado={pedidoRegistrado}
      />
    );
  }

  if (vistaActual === 'carrito') {
    return (
      <CarritoPage
        carrito={carrito}
        onEliminarProducto={eliminarProductoDelCarrito}
        onAumentarCantidad={aumentarCantidad}
        onDisminuirCantidad={disminuirCantidad}
        onVolverAlMenu={volverAlMenu}
        onConfirmarPedido={abrirConfirmacionPedido}
      />
    );
  }

  return (
    <MenuPage
      carrito={carrito}
      onAgregarAlCarrito={agregarAlCarrito}
      onAbrirCarrito={abrirCarrito}
      onAbrirMisPedidos={abrirMisPedidos}
      onCerrarSesion={cerrarSesion}
    />
  );
}

export default App;