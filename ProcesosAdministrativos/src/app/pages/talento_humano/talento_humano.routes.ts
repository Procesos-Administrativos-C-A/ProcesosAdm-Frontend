import { Routes } from "@angular/router"; 
import {MostrarPreoperativosComponent} from "./mostrar-preoperativos/mostrar-preoperativos.component";
import { ReporteAsistenciaComponent } from "./reporte-asistencia/reporte-asistencia.component";
import { ReporteConsolidadoComponent } from "./reporte-consolidado/reporte-consolidado.component";
import { TerminacionContratoComponent } from "./terminacion-contrato/terminacion-contrato.component";

export const OMRoutes: Routes =[

    {
        path: '', component: MostrarPreoperativosComponent
    },
    {
        path: 'Consolidado', component: ReporteConsolidadoComponent
    },
    {
        path: 'Asistencia', component: ReporteAsistenciaComponent
    },
    {
        path: 'Contrato', component: TerminacionContratoComponent
    }

];