import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BackendService } from '../../services/backend.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthInicioSesionGuard implements CanActivate {
  constructor(private authService: BackendService, private router: Router) {}

  canActivate(route: any, state: any): Observable<boolean> {
    return this.authService.getInformacion().pipe(
      map((credenciales) => {
        // Si la autenticación es exitosa y se intenta acceder al login, redirige a Home
        if (state.url === '/') {
          this.router.navigateByUrl('Home');
          return false;
        }
        return true; // Permitir acceso a otras rutas
      }),
      catchError((error) => {
        if (state.url === '/') {
          return of(true);
        }
        this.router.navigateByUrl('/');
        return of(false);
      })
    );
  }
}