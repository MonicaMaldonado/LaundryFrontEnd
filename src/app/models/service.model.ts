export interface Service {
    id : string;
    descripcion : string;
    costo: number;
    comentario: string;
    promocion: string | null;
    estado: string;
    idLocal: string;
    local: string;
}
