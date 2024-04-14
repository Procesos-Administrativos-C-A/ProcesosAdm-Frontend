import { Routes } from "@angular/router"; 
import {PreoperativosComponent} from "./crear_preoperativo/preoperativos.component";
import { EditarPreoperativoComponent } from './editar-preoperativo/editar-preoperativo.component';

export const OMRoutes: Routes =[

    {
        path: '', component: PreoperativosComponent
    },
    {
        path: 'Editar', component: EditarPreoperativoComponent
    }

];