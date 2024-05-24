import { Routes } from '@angular/router';
import { MostrarPreoperativosComponent } from './pages/talento_humano/mostrar-preoperativos/mostrar-preoperativos.component';
import { AuthenticationTalentoHumanoGuard } from './core/guards/auth_talento_humano/authentication_talento_humano.guard';
import { AuthenticationOperYMantGuard } from './core/guards/auth_operador_y_mantenimiento/authentication-oper-y-mant.guard';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/login/login.routes').then(m => m.LoginRoutes)
    },
    {
        path: 'Preoperativos',
        canActivate: [
            //AuthenticationOperYMantGuard
        ],
        loadChildren: () => import('./pages/operador_y_mantenimiento/operador_y_mantenimeinto.routes').then(m => m.OMRoutes)
        
    },
    {
        path: 'Reportes',
        canActivate: [
           //AuthenticationTalentoHumanoGuard
        ],
        loadChildren: () => import('./pages/talento_humano/talento_humano.routes').then(m => m.OMRoutes)
        
    },
    {
        path: 'Solicitudes',
        canActivate: [
           // AuthenticationTalentoHumanoGuard
        ],
        loadChildren: () => import('./pages/general/general.routes').then(m => m.OMRoutes)
        
    },
    {
        path: 'Admin',
        canActivate: [
           // AuthenticationTalentoHumanoGuard
        ],
        loadChildren: () => import('./pages/administrador/administrador.routes').then(m => m.OMRoutes)
        
    },
    {
        path: '**',
        component: NavbarComponent
    }

];
