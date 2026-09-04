import api from './api';

export interface ClienteAdmin {
  _id: string;
  documento: string;
  tipoDocumento: string;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActualizarClienteAdminData {
  documento?: string;
  tipoDocumento?: string;
  nombre?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  estado?: string;
}

interface ClientesAdminResponse {
  success: boolean;
  data: ClienteAdmin[];
}

interface ClienteAdminResponse {
  success: boolean;
  message?: string;
  data: ClienteAdmin;
}

interface EliminarClienteAdminResponse {
  success: boolean;
  message: string;
}

export const obtenerClientesAdmin = async (): Promise<
  ClienteAdmin[]
> => {
  const respuesta =
    await api.get<ClientesAdminResponse>(
      '/clientes'
    );

  return respuesta.data.data;
};

export const actualizarClienteAdmin = async (
  clienteId: string,
  datos: ActualizarClienteAdminData
): Promise<ClienteAdmin> => {
  const respuesta =
    await api.put<ClienteAdminResponse>(
      `/clientes/${clienteId}`,
      datos
    );

  return respuesta.data.data;
};

export const eliminarClienteAdmin = async (
  clienteId: string
): Promise<void> => {
  await api.delete<EliminarClienteAdminResponse>(
    `/clientes/${clienteId}`
  );
};