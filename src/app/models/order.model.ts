export interface Order {
    id: string;
    idCliente: string;
    fechaReception: Date;
    fechaEntrega: Date;
    comentarios: string;
    estado: string;
    //idUsuario: string;
    usuario: string;
    idLocal: string;
}