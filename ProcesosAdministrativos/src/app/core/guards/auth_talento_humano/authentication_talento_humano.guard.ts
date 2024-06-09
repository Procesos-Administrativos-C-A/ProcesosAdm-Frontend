import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BackendService } from '../../services/backend.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthenticationTalentoHumanoGuard implements CanActivate {
  constructor(private authService: BackendService, private router: Router) {}

  canActivate(route: any, state: any): Observable<boolean> {
    return this.authService.getInformacion().pipe(
      map((credenciales) => {
        if(credenciales.rol > 2){
          this.router.navigateByUrl('Home');
        }
        return credenciales.rol < 3;
      }),
      catchError((error) => {
        console.error('Error al recuperar credenciales:', error);
        this.router.navigateByUrl('');
        return of(false); // Devolver false en caso de error
      })
    );
  }
}