import api from './api';

export interface ProductoDetallePedido {
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

export interface PagoDetallePedido {
  metodo: 'Tarjeta simulada' | 'Efectivo';
  estado: 'Aprobado' | 'Fallido';
}

export interface DetallePedido {
  _id: string;

  cliente: {
    _id: string;
    documento: string;
    tipoDocumento: string;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    direccion: string;
    estado: string;
  } | string;

  productos: ProductoDetallePedido[];

  direccionEntrega: string;

  total: number;

  pago?: PagoDetallePedido;

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

interface DetallePedidoResponse {
  success: boolean;
  data: DetallePedido;
}

export const obtenerDetallePedido = async (
  pedidoId: string
): Promise<DetallePedido> => {
  const respuesta = await api.get<DetallePedidoResponse>(
    `/pedidos/${pedidoId}`
  );

  return respuesta.data.data;
};