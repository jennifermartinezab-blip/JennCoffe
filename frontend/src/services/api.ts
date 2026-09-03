import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const tokenCliente = localStorage.getItem(
    'jenncoffee_token'
  );

  const tokenAdministrador = localStorage.getItem(
    'jenncoffee_admin_token'
  );

  const tokenActivo =
    tokenAdministrador || tokenCliente;

  if (tokenActivo) {
    config.headers.Authorization =
      `Bearer ${tokenActivo}`;
  }

  return config;
});

export default api;