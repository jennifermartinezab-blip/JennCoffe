import { useEffect, useState } from 'react';
import './MenuPage.css';
import MenuHeader from '../components/menu/MenuHeader';
import HeroBanner from '../components/menu/HeroBanner';
import CategoryList from '../components/menu/CategoryList';
import ProductGrid from '../components/menu/ProductGrid';
import BottomNavigation from '../components/menu/BottomNavigation';
import { obtenerCategorias, obtenerProductos } from '../services/menuService';

import type { Categoria } from '../types/Categoria';
import type { Producto } from '../types/Producto';

function MenuPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarMenu = async () => {
      try {
        setCargando(true);
        setError('');

        const [categoriasObtenidas, productosObtenidos] = await Promise.all([
          obtenerCategorias(),
          obtenerProductos()
        ]);

        setCategorias(categoriasObtenidas);
        setProductos(productosObtenidos);
      } catch (error) {
        console.error('Error al cargar el menú:', error);
        setError('No fue posible cargar el menú. Intenta nuevamente.');
      } finally {
        setCargando(false);
      }
    };

    cargarMenu();
  }, []);

  if (cargando) {
    return (
      <main>
        <h1>JennCoffee</h1>
        <p>Cargando menú...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>JennCoffee</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="menu-page">
      <MenuHeader />

      <HeroBanner />

      <CategoryList categorias={categorias} />

      <ProductGrid productos={productos} />

      <BottomNavigation />
    </main>
  );
}

export default MenuPage;