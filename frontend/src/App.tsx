import { useState } from 'react';

import MenuPage from './pages/MenuPage';
import CarritoPage from './pages/CarritoPage';

import type { Producto } from './types/Producto';
import type { CarritoItem } from './types/CarritoItem';

type VistaActual = 'menu' | 'carrito';

function App() {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [vistaActual, setVistaActual] = useState<VistaActual>('menu');

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

  const abrirCarrito = () => {
    setVistaActual('carrito');
  };

  const volverAlMenu = () => {
    setVistaActual('menu');
  };

  if (vistaActual === 'carrito') {
    return (
      <CarritoPage
        carrito={carrito}
        onEliminarProducto={eliminarProductoDelCarrito}
        onVolverAlMenu={volverAlMenu}
      />
    );
  }

  return (
    <MenuPage
      carrito={carrito}
      onAgregarAlCarrito={agregarAlCarrito}
      onAbrirCarrito={abrirCarrito}
    />
  );
}

export default App;