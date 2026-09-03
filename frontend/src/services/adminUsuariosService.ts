import api from './api';

export interface UsuarioAdmin {
  _id: string;
  usuario: string;
  rol: string;
  estado: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearUsuarioAdminData {
  usuario: string;
  contrasena: string;
  rol: string;
  estado: string;
}

export interface ActualizarUsuarioAdminData {
  usuario?: string;
  contrasena?: string;
  rol?: string;
  estado?: string;
}

interface UsuariosAdminResponse {
  success: boolean;
  data: UsuarioAdmin[];
}

interface UsuarioAdminResponse {
  success: boolean;
  message?: string;
  data: UsuarioAdmin;
}

interface EliminarUsuarioAdminResponse {
  success: boolean;
  message: string;
}

export const obtenerUsuariosAdmin = async (): Promise<UsuarioAdmin[]> => {
  const respuesta = await api.get<UsuariosAdminResponse>(
    '/usuarios'
  );

  return respuesta.data.data;
};

export const crearUsuarioAdmin = async (
  datos: CrearUsuarioAdminData
): Promise<UsuarioAdmin> => {
  const respuesta = await api.post<UsuarioAdminResponse>(
    '/usuarios',
    datos
  );

  return respuesta.data.data;
};

export const actualizarUsuarioAdmin = async (
  usuarioId: string,
  datos: ActualizarUsuarioAdminData
): Promise<UsuarioAdmin> => {
  const respuesta = await api.put<UsuarioAdminResponse>(
    `/usuarios/${usuarioId}`,
    datos
  );

  return respuesta.data.data;
};

export const eliminarUsuarioAdmin = async (
  usuarioId: string
): Promise<void> => {
  await api.delete<EliminarUsuarioAdminResponse>(
    `/usuarios/${usuarioId}`
  );
};