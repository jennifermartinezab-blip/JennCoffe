import api from './api';

export interface CategoriaProductoAdmin {
  _id: string;
  nombre: string;
  estado?: string;
}

export interface ProductoAdmin {
  _id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria:
    | CategoriaProductoAdmin
    | string;
  precio: number;
  imagen: string;
  disponibilidad: boolean;
  estado: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearProductoAdminData {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagen: string;
  disponibilidad: boolean;
  estado: string;
}

export interface ActualizarProductoAdminData {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  categoria?: string;
  precio?: number;
  imagen?: string;
  disponibilidad?: boolean;
  estado?: string;
}

interface ProductosAdminResponse {
  success: boolean;
  data: ProductoAdmin[];
}

interface ProductoAdminResponse {
  success: boolean;
  message?: string;
  data: ProductoAdmin;
}

interface EliminarProductoAdminResponse {
  success: boolean;
  message: string;
}

export const obtenerProductosAdmin = async (): Promise<
  ProductoAdmin[]
> => {
  const respuesta =
    await api.get<ProductosAdminResponse>(
      '/productos'
    );

  return respuesta.data.data;
};

export const crearProductoAdmin = async (
  datos: CrearProductoAdminData
): Promise<ProductoAdmin> => {
  const respuesta =
    await api.post<ProductoAdminResponse>(
      '/productos',
      datos
    );

  return respuesta.data.data;
};

export const actualizarProductoAdmin = async (
  productoId: string,
  datos: ActualizarProductoAdminData
): Promise<ProductoAdmin> => {
  const respuesta =
    await api.put<ProductoAdminResponse>(
      `/productos/${productoId}`,
      datos
    );

  return respuesta.data.data;
};

export const eliminarProductoAdmin = async (
  productoId: string
): Promise<void> => {
  await api.delete<EliminarProductoAdminResponse>(
    `/productos/${productoId}`
  );
};