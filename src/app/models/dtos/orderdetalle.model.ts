export interface OrderDetalle {
    idOrden : number;
    idServicio : number;
    estado : string;
    comentario : string;
    fechaEntrega : Date;
    valor : number;
    descuento : number;
}