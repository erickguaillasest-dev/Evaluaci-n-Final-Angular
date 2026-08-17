import { Condomino } from '../condominos/condomino';

export interface Pago {
  id?: number;
  fechaPago: string;
  anioMesPago: string;
  valorPagoAlicuota: number;
  valorPagoConsumoServicios: number;
  condomino: Condomino;
  cedulaCondomino?: string;
}