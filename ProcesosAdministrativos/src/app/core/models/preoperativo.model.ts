import { EmpleadosPreoperativo } from "./empleados_preoperativo.model";

export interface Preoperativo {
  id?: number;
  fecha: string;
  encargado: string;
  turno: string;
  lugar: string;
  festivo: boolean;
  horas_extra?: boolean;
  empleados_preoperativos?: EmpleadosPreoperativo[];
}