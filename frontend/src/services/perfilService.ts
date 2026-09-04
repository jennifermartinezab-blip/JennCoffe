import api from './api';

export interface PerfilCliente {
  _id: string;
  documento: string;
  tipoDocumento: string;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
  estado: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActualizarPerfilClienteData {
  nombre?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
}

interface PerfilClienteResponse {
  success: boolean;
  message?: string;
  data: PerfilCliente;
}

export const obtenerMiPerfil = async (): Promise<PerfilCliente> => {
  const respuesta = await api.get<PerfilClienteResponse>(
    '/clientes/me'
  );

  return respuesta.data.data;
};

export const actualizarMiPerfil = async (
  datos: ActualizarPerfilClienteData
): Promise<PerfilCliente> => {
  const respuesta = await api.put<PerfilClienteResponse>(
    '/clientes/me',
    datos
  );

  return respuesta.data.data;
};