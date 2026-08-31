import type { Producto } from '../../types/Producto';

import './ProductCard.css';

interface ProductCardProps {
  producto: Producto;
}

function ProductCard({ producto }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__image-container">
        <img
          className="product-card__image"
          src={`/images/products/${producto.imagen}`}
          alt={producto.nombre}
        />
      </div>

      <div className="product-card__content">
        <h3 className="product-card__name">
          {producto.nombre}
        </h3>

        <p className="product-card__description">
          {producto.descripcion}
        </p>

        <p className="product-card__price">
          ${producto.precio.toLocaleString('es-CO')}
        </p>

        <span
          className={
            producto.disponibilidad
              ? 'product-card__status product-card__status--available'
              : 'product-card__status product-card__status--unavailable'
          }
        >
          {producto.disponibilidad ? 'Disponible' : 'No disponible'}
        </span>
      </div>
    </article>
  );
}

export default ProductCard;