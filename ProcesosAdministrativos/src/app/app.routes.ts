import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/login/login.routes').then(m => m.LoginRoutes)
    },
    {
        path: 'Preoperativos',
        loadChildren: () => import('./pages/operador_y_mantenimiento/operador_y_mantenimeinto.routes').then(m => m.OMRoutes)
    },
    {
        path: 'Reportes',
        loadChildren: () => import('./pages/talento_humano/talento_humano.routes').then(m => m.OMRoutes)
    } 

];
