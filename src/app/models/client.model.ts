export interface Client {
    id: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    estado: string;
    ruc: string | null | undefined;
    idLocal: string;
    //ruc?: string;  //propiedad opcional
    //price: number;
}

/* export enum Status{
    ACTIVE = 'active',
    INACTIVE= 'inactive'
}
const property : client =
status: Status.active; */