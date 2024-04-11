export interface EmpleadosPreoperativoG {
    cedula: string;
    horas_diarias: number;
    horas_adicionales: number;
    estacion: string;
  }
  
  export interface PreoperativoG {
    fecha: string;
    encargado: string;
    turno: string;
    lugar: string;
    festivo: boolean;
    empleados_preoperativos?: EmpleadosPreoperativoG[];
  }