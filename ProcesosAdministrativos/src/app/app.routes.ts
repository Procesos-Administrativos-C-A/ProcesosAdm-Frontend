import { Routes } from '@angular/router';
import { AuthenticationTalentoHumanoGuard } from './core/guards/auth_talento_humano/authentication_talento_humano.guard';
import { AuthenticationAdminGuard } from './core/guards/authentication-admin/authentication-admin.guard';
import { AuthenticationOperYMantGuard } from './core/guards/auth_operador_y_mantenimiento/authentication-oper-y-mant.guard';
import { AuthInicioSesionGuard } from './core/guards/auth_sesion/auth-inicio-sesion.guard';
import { HomeComponent } from './pages/general/home/home.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [
            AuthInicioSesionGuard
        ],
        loadChildren: () => import('./pages/login/login.routes').then(m => m.LoginRoutes)
    },
    {

        path: 'Home',
        canActivate: [
            AuthInicioSesionGuard
        ],
        component: HomeComponent


    },
    {
        path: 'Preoperativos',
        canActivate: [
            AuthenticationOperYMantGuard
        ],
        loadChildren: () => import('./pages/operador_y_mantenimiento/operador_y_mantenimeinto.routes').then(m => m.OMRoutes)

    },
    {
        path: 'Reportes',
        canActivate: [
            AuthenticationTalentoHumanoGuard
        ],
        loadChildren: () => import('./pages/talento_humano/talento_humano.routes').then(m => m.OMRoutes)

    },
    {
        path: 'Solicitudes',
        canActivate: [
            AuthInicioSesionGuard
        ],
        loadChildren: () => import('./pages/general/general.routes').then(m => m.OMRoutes)

    },
    {
        path: 'Admin',
        canActivate: [
            AuthenticationAdminGuard
        ],
        loadChildren: () => import('./pages/administrador/administrador.routes').then(m => m.OMRoutes)

    },
    {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full'
    }

];
