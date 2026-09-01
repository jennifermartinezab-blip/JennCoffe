import api from './api';

interface LoginClienteData {
  tipo: 'Cliente';
  correo: string;
  contrasena: string;
}

interface ClienteAutenticado {
  id: string;
  tipo: 'Cliente';
  nombre: string;
  apellidos: string;
  correo: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  data: ClienteAutenticado;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const loginCliente = async (
  correo: string,
  contrasena: string
): Promise<LoginResponse> => {
  const datos: LoginClienteData = {
    tipo: 'Cliente',
    correo,
    contrasena
  };

  const respuesta = await api.post<LoginResponse>(
    '/auth/login',
    datos
  );

  return respuesta.data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const respuesta = await api.post<LogoutResponse>(
    '/auth/logout'
  );

  return respuesta.data;
};

export const guardarToken = (token: string) => {
  localStorage.setItem('jenncoffee_token', token);
};

export const obtenerToken = () => {
  return localStorage.getItem('jenncoffee_token');
};

export const eliminarToken = () => {
  localStorage.removeItem('jenncoffee_token');
};