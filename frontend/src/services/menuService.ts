import api from './api';

import type { Producto } from '../types/Producto';
import type { Categoria } from '../types/Categoria';
import type { ApiResponse } from '../types/ApiResponse';

export const obtenerProductos = async (): Promise<Producto[]> => {
  const respuesta = await api.get<ApiResponse<Producto[]>>('/productos');

  return respuesta.data.data;
};

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  const respuesta = await api.get<ApiResponse<Categoria[]>>('/categorias');

  return respuesta.data.data;
};