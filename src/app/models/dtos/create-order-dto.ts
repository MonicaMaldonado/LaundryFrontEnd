export interface CreateOrderRequestDto  {
    id : number,
    idCliente : number,
    fechaRecepcion : Date,
    comentario : string,
    fechaEntrega : Date,
    idSucursal : number,
    idLocal : number,
    detalle : any[]
    
}