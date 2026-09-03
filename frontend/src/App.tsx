import { useState } from 'react';

import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminPedidosPage from './pages/AdminPedidosPage';
import AdminUsuariosPage from './pages/AdminUsuariosPage';
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

import {
  eliminarTokenAdministrador,
  obtenerTokenAdministrador
} from './services/adminAuthService';

import type { Producto } from './types/Producto';
import type { CarritoItem } from './types/CarritoItem';

type VistaActual =
  | 'menu'
  | 'carrito'
  | 'confirmarPedido'
  | 'misPedidos'
  | 'detallePedido';

type VistaAdministrador =
  | 'dashboard'
  | 'productos'
  | 'categorias'
  | 'clientes'
  | 'pedidos'
  | 'usuarios';

type TipoAcceso =
  | 'cliente'
  | 'administrador';

function App() {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  const [vistaActual, setVistaActual] =
    useState<VistaActual>('menu');

  const [
    vistaAdministrador,
    setVistaAdministrador
  ] = useState<VistaAdministrador>('dashboard');

  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] =
    useState<string | null>(null);

  const [tipoAcceso, setTipoAcceso] =
    useState<TipoAcceso>('cliente');

  const [clienteAutenticado, setClienteAutenticado] =
    useState(Boolean(obtenerToken()));

  const [
    administradorAutenticado,
    setAdministradorAutenticado
  ] = useState(Boolean(obtenerTokenAdministrador()));

  const agregarAlCarrito = (producto: Producto) => {
    if (
      !producto.disponibilidad ||
      producto.estado !== 'Activo'
    ) {
      return;
    }

    setCarrito((carritoActual) => {
      const productoYaAgregado = carritoActual.some(
        (item) =>
          item.producto._id === producto._id
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

  const eliminarProductoDelCarrito = (
    productoId: string
  ) => {
    setCarrito((carritoActual) =>
      carritoActual.filter(
        (item) =>
          item.producto._id !== productoId
      )
    );
  };

  const aumentarCantidad = (
    productoId: string
  ) => {
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

  const disminuirCantidad = (
    productoId: string
  ) => {
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
        total +
        item.producto.precio *
          item.cantidad,
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

  const abrirDetallePedido = (
    pedidoId: string
  ) => {
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

  const abrirAccesoAdministrador = () => {
    setTipoAcceso('administrador');
  };

  const volverAccesoCliente = () => {
    setTipoAcceso('cliente');
  };

  const irDashboardAdmin = () => {
    setVistaAdministrador('dashboard');
  };

  const irProductosAdmin = () => {
    setVistaAdministrador('productos');
  };

  const irCategoriasAdmin = () => {
    setVistaAdministrador('categorias');
  };

  const irClientesAdmin = () => {
    setVistaAdministrador('clientes');
  };

  const irPedidosAdmin = () => {
    setVistaAdministrador('pedidos');
  };

  const irUsuariosAdmin = () => {
    setVistaAdministrador('usuarios');
  };

  const loginClienteCorrecto = () => {
    eliminarTokenAdministrador();
    setAdministradorAutenticado(false);

    setClienteAutenticado(true);
    setTipoAcceso('cliente');
    setVistaActual('menu');
  };

  const loginAdministradorCorrecto = () => {
    eliminarToken();
    setClienteAutenticado(false);

    setAdministradorAutenticado(true);
    setTipoAcceso('administrador');
    setVistaAdministrador('dashboard');
  };

  const pedidoRegistrado = () => {
    setCarrito([]);
    setVistaActual('misPedidos');
  };

  const cerrarSesionCliente = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        'No fue posible completar el logout del cliente en el servidor:',
        error
      );
    } finally {
      eliminarToken();

      setCarrito([]);
      setPedidoSeleccionadoId(null);
      setVistaActual('menu');
      setClienteAutenticado(false);
      setTipoAcceso('cliente');
    }
  };

  const cerrarSesionAdministrador = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        'No fue posible completar el logout del administrador en el servidor:',
        error
      );
    } finally {
      eliminarTokenAdministrador();

      setAdministradorAutenticado(false);
      setTipoAcceso('cliente');
      setVistaAdministrador('dashboard');

      setCarrito([]);
      setPedidoSeleccionadoId(null);
      setVistaActual('menu');
    }
  };

  if (
    tipoAcceso === 'administrador' &&
    !administradorAutenticado
  ) {
    return (
      <AdminLoginPage
        onLoginAdministradorCorrecto={
          loginAdministradorCorrecto
        }
        onVolverCliente={volverAccesoCliente}
      />
    );
  }

  if (administradorAutenticado) {
    const propsNavegacionAdmin = {
      onCerrarSesion: cerrarSesionAdministrador,
      onIrDashboard: irDashboardAdmin,
      onIrProductos: irProductosAdmin,
      onIrCategorias: irCategoriasAdmin,
      onIrClientes: irClientesAdmin,
      onIrPedidos: irPedidosAdmin,
      onIrUsuarios: irUsuariosAdmin
    };

    if (vistaAdministrador === 'pedidos') {
      return (
        <AdminPedidosPage
          {...propsNavegacionAdmin}
        />
      );
    }

    if (vistaAdministrador === 'usuarios') {
      return (
        <AdminUsuariosPage
          {...propsNavegacionAdmin}
        />
      );
    }

    return (
      <AdminDashboardPage
        {...propsNavegacionAdmin}
      />
    );
  }

  if (!clienteAutenticado) {
    return (
      <LoginPage
        onLoginCorrecto={loginClienteCorrecto}
        onIrAdministrador={
          abrirAccesoAdministrador
        }
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
        onVolverAMisPedidos={
          volverAMisPedidos
        }
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

  if (
    vistaActual ===
    'confirmarPedido'
  ) {
    return (
      <ConfirmarPedidoPage
        carrito={carrito}
        total={calcularTotalCarrito()}
        onVolverAlCarrito={
          volverAlCarrito
        }
        onPedidoRegistrado={
          pedidoRegistrado
        }
      />
    );
  }

  if (vistaActual === 'carrito') {
    return (
      <CarritoPage
        carrito={carrito}
        onEliminarProducto={
          eliminarProductoDelCarrito
        }
        onAumentarCantidad={
          aumentarCantidad
        }
        onDisminuirCantidad={
          disminuirCantidad
        }
        onVolverAlMenu={
          volverAlMenu
        }
        onConfirmarPedido={
          abrirConfirmacionPedido
        }
      />
    );
  }

  return (
    <MenuPage
      carrito={carrito}
      onAgregarAlCarrito={
        agregarAlCarrito
      }
      onAbrirCarrito={
        abrirCarrito
      }
      onAbrirMisPedidos={
        abrirMisPedidos
      }
      onCerrarSesion={
        cerrarSesionCliente
      }
    />
  );
}

export default App;