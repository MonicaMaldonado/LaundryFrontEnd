export interface OrderResponseDto {
    id: number,
    idCliente: number,
    usuario: string,
    estado : string,
    fechaRecepcion : Date,
    comentario : string,
    fechaEntrega : Date,
    idUsuario : number,
    idLocal :number
    orderDetalle : any[]
}