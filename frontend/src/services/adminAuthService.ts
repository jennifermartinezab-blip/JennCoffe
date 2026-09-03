import api from './api';

interface LoginAdministradorData {
  tipo: 'Administrador';
  usuario: string;
  contrasena: string;
}

interface AdministradorAutenticado {
  id: string;
  tipo: 'Administrador';
  usuario: string;
  rol: string;
}

interface LoginAdministradorResponse {
  success: boolean;
  message: string;
  token: string;
  data: AdministradorAutenticado;
}

export const loginAdministrador = async (
  usuario: string,
  contrasena: string
): Promise<LoginAdministradorResponse> => {
  const datos: LoginAdministradorData = {
    tipo: 'Administrador',
    usuario,
    contrasena
  };

  const respuesta = await api.post<LoginAdministradorResponse>(
    '/auth/login',
    datos
  );

  return respuesta.data;
};

export const guardarTokenAdministrador = (token: string) => {
  localStorage.setItem('jenncoffee_admin_token', token);
};

export const obtenerTokenAdministrador = () => {
  return localStorage.getItem('jenncoffee_admin_token');
};

export const eliminarTokenAdministrador = () => {
  localStorage.removeItem('jenncoffee_admin_token');
};