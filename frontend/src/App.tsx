import { useState } from 'react';

import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import CarritoPage from './pages/CarritoPage';

import {
  eliminarToken,
  logout,
  obtenerToken
} from './services/authService';

import type { Producto } from './types/Producto';
import type { CarritoItem } from './types/CarritoItem';

type VistaActual = 'menu' | 'carrito';

function App() {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [vistaActual, setVistaActual] = useState<VistaActual>('menu');

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

  const abrirCarrito = () => {
    setVistaActual('carrito');
  };

  const volverAlMenu = () => {
    setVistaActual('menu');
  };

  const loginCorrecto = () => {
    setAutenticado(true);
    setVistaActual('menu');
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

  if (vistaActual === 'carrito') {
    return (
      <CarritoPage
        carrito={carrito}
        onEliminarProducto={eliminarProductoDelCarrito}
        onAumentarCantidad={aumentarCantidad}
        onDisminuirCantidad={disminuirCantidad}
        onVolverAlMenu={volverAlMenu}
      />
    );
  }

  return (
    <MenuPage
      carrito={carrito}
      onAgregarAlCarrito={agregarAlCarrito}
      onAbrirCarrito={abrirCarrito}
      onCerrarSesion={cerrarSesion}
    />
  );
}

export default App;