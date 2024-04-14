import { EmpleadosPreoperativo } from "./empleados_preoperativo.model";

export interface Preoperativo{
    fecha: string,
    encargado: string,
    turno: string,
    lugar: string,
    festivo: boolean,
    empleados_preoperativos?: EmpleadosPreoperativo[];
}