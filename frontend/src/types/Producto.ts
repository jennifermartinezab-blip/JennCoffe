import type { Categoria } from './Categoria';

export type EstadoProducto = 'Activo' | 'Inactivo';

export interface Producto {
  _id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: Categoria | string;
  precio: number;
  imagen: string;
  disponibilidad: boolean;
  estado: EstadoProducto;
}