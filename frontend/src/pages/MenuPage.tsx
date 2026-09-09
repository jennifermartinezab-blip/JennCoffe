import {
  useEffect,
  useMemo,
  useState
} from 'react';

import './MenuPage.css';

import MenuHeader from '../components/menu/MenuHeader';
import HeroBanner from '../components/menu/HeroBanner';
import CategoryList from '../components/menu/CategoryList';
import ProductGrid from '../components/menu/ProductGrid';
import BottomNavigation from '../components/menu/BottomNavigation';

import {
  obtenerCategorias,
  obtenerProductos,
  obtenerProductosPorCategoria
} from '../services/menuService';

import type { Categoria } from '../types/Categoria';
import type { Producto } from '../types/Producto';
import type { CarritoItem } from '../types/CarritoItem';

interface MenuPageProps {
  carrito: CarritoItem[];
  onAgregarAlCarrito: (
    producto: Producto
  ) => void;
  onAbrirCarrito: () => void;
  onAbrirMisPedidos: () => void;
  onAbrirPerfil: () => void;
  onCerrarSesion: () => void;
}

function MenuPage({
  carrito,
  onAgregarAlCarrito,
  onAbrirCarrito,
  onAbrirMisPedidos,
  onAbrirPerfil,
  onCerrarSesion
}: MenuPageProps) {
  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [
    categoriaSeleccionada,
    setCategoriaSeleccionada
  ] = useState<string | null>(null);

  const [busqueda, setBusqueda] =
    useState('');

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const cargarMenu = async () => {
      try {
        setCargando(true);
        setError('');

        const [
          categoriasObtenidas,
          productosObtenidos
        ] = await Promise.all([
          obtenerCategorias(),
          obtenerProductos()
        ]);

        setCategorias(
          categoriasObtenidas
        );

        setProductos(
          productosObtenidos
        );
      } catch (error) {
        console.error(
          'Error al cargar el menú:',
          error
        );

        setError(
          'No fue posible cargar el menú. Intenta nuevamente.'
        );
      } finally {
        setCargando(false);
      }
    };

    cargarMenu();
  }, []);

  const seleccionarCategoria = async (
    categoriaId: string
  ) => {
    try {
      setError('');
      setBusqueda('');

      const productosObtenidos =
        await obtenerProductosPorCategoria(
          categoriaId
        );

      setCategoriaSeleccionada(
        categoriaId
      );

      setProductos(
        productosObtenidos
      );
    } catch (error) {
      console.error(
        'Error al filtrar productos por categoría:',
        error
      );

      setError(
        'No fue posible consultar los productos de esta categoría.'
      );
    }
  };

  const verTodas = async () => {
    try {
      setError('');
      setBusqueda('');

      const productosObtenidos =
        await obtenerProductos();

      setCategoriaSeleccionada(null);

      setProductos(
        productosObtenidos
      );
    } catch (error) {
      console.error(
        'Error al consultar todos los productos:',
        error
      );

      setError(
        'No fue posible consultar todos los productos.'
      );
    }
  };

  const verPromociones = async () => {
    const categoriaPromociones =
      categorias.find(
        (categoria) =>
          categoria.nombre
            .trim()
            .toLowerCase() ===
          'promociones'
      );

    if (!categoriaPromociones) {
      setError(
        'La categoría Promociones no está disponible.'
      );
      return;
    }

    await seleccionarCategoria(
      categoriaPromociones._id
    );
  };

  const productosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      if (texto === '') {
        return productos;
      }

      return productos.filter(
        (producto) => {
          const nombre =
            producto.nombre
              ?.toLowerCase() ?? '';

          const descripcion =
            producto.descripcion
              ?.toLowerCase() ?? '';

          return (
            nombre.includes(texto) ||
            descripcion.includes(texto)
          );
        }
      );
    }, [
      busqueda,
      productos
    ]);

  if (cargando) {
    return (
      <main>
        <h1>
          JennCoffee
        </h1>

        <p>
          Cargando menú...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>
          JennCoffee
        </h1>

        <p>
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="menu-page">
      <MenuHeader
        busqueda={
          busqueda
        }
        cantidadCarrito={
          carrito.length
        }
        onCambiarBusqueda={
          setBusqueda
        }
        onAbrirCarrito={
          onAbrirCarrito
        }
        onAbrirMisPedidos={
          onAbrirMisPedidos
        }
        onAbrirPerfil={
          onAbrirPerfil
        }
        onCerrarSesion={
          onCerrarSesion
        }
      />

      <HeroBanner
        onVerPromociones={
          verPromociones
        }
      />

      <CategoryList
        categorias={
          categorias
        }
        categoriaSeleccionada={
          categoriaSeleccionada
        }
        onSeleccionarCategoria={
          seleccionarCategoria
        }
        onVerTodas={
          verTodas
        }
      />

      <ProductGrid
        productos={
          productosFiltrados
        }
        onAgregar={
          onAgregarAlCarrito
        }
      />

      <BottomNavigation
        cantidadCarrito={
          carrito.length
        }
        onAbrirCarrito={
          onAbrirCarrito
        }
        onAbrirMisPedidos={
          onAbrirMisPedidos
        }
        onAbrirPerfil={
          onAbrirPerfil
        }
      />
    </main>
  );
}

export default MenuPage;