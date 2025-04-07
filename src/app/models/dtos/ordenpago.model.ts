import { B } from "@angular/cdk/keycodes";

export interface OrdenPago {
  id: string;
  idOrden: string;
  valor: number;
  saldo: number;
  fechaPago: Date;
  idTipoPago: number;
  tipoPago: string;
}
