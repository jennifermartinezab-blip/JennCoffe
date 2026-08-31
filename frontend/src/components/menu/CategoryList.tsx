import type { Categoria } from '../../types/Categoria';

import './CategoryList.css';

interface CategoryListProps {
  categorias: Categoria[];
}

function CategoryList({ categorias }: CategoryListProps) {
  return (
    <section className="category-list">
      <div className="category-list__header">
        <h2 className="category-list__title">Categorías</h2>

        <span className="category-list__link">
          Ver todas
        </span>
      </div>

      {categorias.length === 0 ? (
        <p className="category-list__empty">
          No hay categorías disponibles.
        </p>
      ) : (
        <div className="category-list__grid">
          {categorias.map((categoria) => (
            <article
              key={categoria._id}
              className="category-list__item"
            >
              <span className="category-list__icon">
                ☕
              </span>

              <span className="category-list__name">
                {categoria.nombre}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoryList;