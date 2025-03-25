export interface CreateOrderRequestDto  {
    idCliente : number,
    fechaRecepcion : Date,
    comentario : string,
    fechaEntrega : Date,
    idSucursal : number,
    idLocal : number,
    detalle : any[]
    
}