import api from './api';

export interface CategoriaAdmin {
  _id: string;
  nombre: string;
  descripcion?: string;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearCategoriaAdminData {
  nombre: string;
  descripcion?: string;
  estado?: string;
}

export interface ActualizarCategoriaAdminData {
  nombre?: string;
  descripcion?: string;
  estado?: string;
}

interface CategoriasResponse {
  success: boolean;
  data: CategoriaAdmin[];
}

interface CategoriaResponse {
  success: boolean;
  message?: string;
  data: CategoriaAdmin;
}

interface EliminarCategoriaResponse {
  success: boolean;
  message: string;
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

export const crearCategoriaAdmin = async (
  datos: CrearCategoriaAdminData
): Promise<CategoriaAdmin> => {
  const respuesta =
    await api.post<CategoriaResponse>(
      '/categorias',
      datos
    );

  return respuesta.data.data;
};

export const actualizarCategoriaAdmin = async (
  categoriaId: string,
  datos: ActualizarCategoriaAdminData
): Promise<CategoriaAdmin> => {
  const respuesta =
    await api.put<CategoriaResponse>(
      `/categorias/${categoriaId}`,
      datos
    );

  return respuesta.data.data;
};

export const eliminarCategoriaAdmin = async (
  categoriaId: string
): Promise<void> => {
  await api.delete<EliminarCategoriaResponse>(
    `/categorias/${categoriaId}`
  );
};