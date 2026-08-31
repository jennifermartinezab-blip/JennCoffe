import type { Categoria } from '../../types/Categoria';

import './CategoryList.css';

interface CategoryListProps {
  categorias: Categoria[];
  categoriaSeleccionada: string | null;
  onSeleccionarCategoria: (categoriaId: string) => void;
  onVerTodas: () => void;
}

function CategoryList({
  categorias,
  categoriaSeleccionada,
  onSeleccionarCategoria,
  onVerTodas
}: CategoryListProps) {
  return (
    <section className="category-list">
      <div className="category-list__header">
        <h2 className="category-list__title">Categorías</h2>

        <button
          type="button"
          className="category-list__link"
          onClick={onVerTodas}
        >
          Ver todas
        </button>
      </div>

      {categorias.length === 0 ? (
        <p className="category-list__empty">
          No hay categorías disponibles.
        </p>
      ) : (
        <div className="category-list__grid">
          {categorias.map((categoria) => (
            <button
              key={categoria._id}
              type="button"
              className={`category-list__item ${
                categoriaSeleccionada === categoria._id
                  ? 'category-list__item--active'
                  : ''
              }`}
              onClick={() => onSeleccionarCategoria(categoria._id)}
              aria-pressed={categoriaSeleccionada === categoria._id}
            >
              <span
                className="category-list__icon"
                aria-hidden="true"
              >
                ☕
              </span>

              <span className="category-list__name">
                {categoria.nombre}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoryList;