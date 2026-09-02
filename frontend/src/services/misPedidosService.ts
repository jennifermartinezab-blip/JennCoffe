import api from './api';

export interface ProductoPedido {
  producto: {
    _id: string;
    codigo: string;
    imagen: string;
    estado: string;
    disponibilidad: boolean;
  } | string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PagoPedido {
  metodo: 'Tarjeta simulada' | 'Efectivo';
  estado: 'Aprobado' | 'Fallido';
}

export interface PedidoCliente {
  _id: string;
  productos: ProductoPedido[];
  direccionEntrega: string;
  total: number;
  pago: PagoPedido;
  estado:
    | 'Pendiente'
    | 'En preparación'
    | 'En camino'
    | 'Entregado'
    | 'Cancelado';
  fecha: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MisPedidosResponse {
  success: boolean;
  data: PedidoCliente[];
}

export const obtenerMisPedidos = async (): Promise<PedidoCliente[]> => {
  const respuesta = await api.get<MisPedidosResponse>(
    '/pedidos/mis'
  );

  return respuesta.data.data;
};