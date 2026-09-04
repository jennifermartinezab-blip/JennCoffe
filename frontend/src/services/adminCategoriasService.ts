import api from './api';

export interface CategoriaAdmin {
  _id: string;
  nombre: string;
  descripcion?: string;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoriasResponse {
  success: boolean;
  data: CategoriaAdmin[];
}

export const obtenerCategoriasAdmin = async (): Promise<
  CategoriaAdmin[]
> => {
  const respuesta =
    await api.get<CategoriasResponse>(
      '/categorias'
    );

  return respuesta.data.data;
};