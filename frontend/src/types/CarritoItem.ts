import type { Producto } from './Producto';

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}