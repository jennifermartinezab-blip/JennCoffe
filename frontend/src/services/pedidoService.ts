import api from './api';

import type { CarritoItem } from '../types/CarritoItem';

export type MetodoPago =
  | 'Tarjeta simulada'
  | 'Efectivo';

export type ResultadoPagoSimulado =
  | 'Aprobado'
  | 'Fallido';

interface ProductoPedidoRequest {
  producto: string;
  cantidad: number;
}

interface PagoPedidoRequest {
  metodo: MetodoPago;
  resultadoSimulado: ResultadoPagoSimulado;
}

interface RegistrarPedidoRequest {
  productos: ProductoPedidoRequest[];
  direccionEntrega: string;
  pago: PagoPedidoRequest;
}

interface ProductoPedidoResponse {
  producto: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface PagoPedidoResponse {
  metodo: MetodoPago;
  estado: 'Aprobado' | 'Fallido';
}

export interface PedidoRegistrado {
  _id: string;
  cliente: string;
  productos: ProductoPedidoResponse[];
  direccionEntrega: string;
  total: number;
  pago: PagoPedidoResponse;
  estado: string;
  fecha?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RegistrarPedidoResponse {
  success: boolean;
  message: string;
  data: PedidoRegistrado;
}

export const registrarPedido = async (
  carrito: CarritoItem[],
  direccionEntrega: string,
  metodoPago: MetodoPago,
  resultadoSimulado: ResultadoPagoSimulado = 'Aprobado'
): Promise<RegistrarPedidoResponse> => {
  const datos: RegistrarPedidoRequest = {
    productos: carrito.map((item) => ({
      producto: item.producto._id,
      cantidad: item.cantidad
    })),
    direccionEntrega,
    pago: {
      metodo: metodoPago,
      resultadoSimulado
    }
  };

  const respuesta =
    await api.post<RegistrarPedidoResponse>(
      '/pedidos',
      datos
    );

  return respuesta.data;
};