import { Routes } from "@angular/router"; 
import {MostrarPreoperativosComponent} from "./mostrar-preoperativos/mostrar-preoperativos.component";
import { ReporteAsistenciaComponent } from "./reporte-asistencia/reporte-asistencia.component";

export const OMRoutes: Routes =[

    {
        path: '', component: MostrarPreoperativosComponent
    },
    {
        path: 'Asistencia', component: ReporteAsistenciaComponent
    }

];