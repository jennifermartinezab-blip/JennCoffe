export type EstadoCategoria = 'Activo' | 'Inactivo';

export interface Categoria {
  _id: string;
  nombre: string;
  descripcion: string;
  estado: EstadoCategoria;
}