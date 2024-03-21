import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { PreoperativosComponent } from './pages/preoperativos/preoperativos.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'Preoperativos',
        component: PreoperativosComponent 
    }   

];
