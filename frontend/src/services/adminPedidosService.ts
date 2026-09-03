import api from './api';

export type EstadoPedido =
  | 'Pendiente'
  | 'En preparación'
  | 'En camino'
  | 'Entregado'
  | 'Cancelado';

export interface ProductoPedidoAdmin {
  producto: {
    _id: string;
    codigo?: string;
    imagen?: string;
  } | string;

  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PagoPedidoAdmin {
  metodo: 'Tarjeta simulada' | 'Efectivo';
  estado: 'Aprobado' | 'Fallido';
}

export interface ClientePedidoAdmin {
  _id: string;
  documento?: string;
  nombre?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
}

export interface PedidoAdmin {
  _id: string;

  cliente:
    | ClientePedidoAdmin
    | string;

  productos: ProductoPedidoAdmin[];

  direccionEntrega: string;

  total: number;

  pago?: PagoPedidoAdmin;

  estado: EstadoPedido;

  fecha: string;

  createdAt?: string;
  updatedAt?: string;
}

interface PedidosAdminResponse {
  success: boolean;
  data: PedidoAdmin[];
}

interface ActualizarEstadoResponse {
  success: boolean;
  message: string;
  data: PedidoAdmin;
}

export const obtenerPedidosAdmin = async (
  estado?: EstadoPedido
): Promise<PedidoAdmin[]> => {
  const respuesta = await api.get<PedidosAdminResponse>(
    '/pedidos',
    {
      params: estado
        ? {
            estado
          }
        : undefined
    }
  );

  return respuesta.data.data;
};

export const actualizarEstadoPedido = async (
  pedidoId: string,
  estado: EstadoPedido
): Promise<PedidoAdmin> => {
  const respuesta =
    await api.patch<ActualizarEstadoResponse>(
      `/pedidos/${pedidoId}/estado`,
      {
        estado
      }
    );

  return respuesta.data.data;
};