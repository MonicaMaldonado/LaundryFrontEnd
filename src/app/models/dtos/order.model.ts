import { DecimalPipe } from "@angular/common";

export interface Order {
    id: string;
    idCliente: string;
    cliente: string;
    fechaRecepcion: Date;
   // fechaEntrega: Date;
    comentario: string;
    estado: string;
    valor: number;
    //idUsuario: string;
    idLocal: string;
    local: string;
    usuario: string;
}
