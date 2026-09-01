import ProductCard from './ProductCard';

import type { Producto } from '../../types/Producto';

import './ProductGrid.css';

interface ProductGridProps {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

function ProductGrid({
  productos,
  onAgregar
}: ProductGridProps) {
  return (
    <section className="product-grid-section">
      <div className="product-grid-section__header">
        <h2 className="product-grid-section__title">
          Productos destacados
        </h2>

        <span className="product-grid-section__link">
          Ver todos
        </span>
      </div>

      {productos.length === 0 ? (
        <p className="product-grid-section__empty">
          No hay productos disponibles.
        </p>
      ) : (
        <div className="product-grid">
          {productos.map((producto) => (
            <ProductCard
              key={producto._id}
              producto={producto}
              onAgregar={onAgregar}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductGrid;