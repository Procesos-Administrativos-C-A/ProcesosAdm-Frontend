import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Empleado } from '../models/empleados.model';
import { Preoperativo } from '../models/preoperativo.model';
import { EmpleadosPreoperativo } from '../models/empleados_preoperativo.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://127.0.0.1:8000'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  crearPreoperativo(preoperativo: Preoperativo, empleadosPreoperativos: EmpleadosPreoperativo[]): Observable<Preoperativo> {
    const url = `${this.apiUrl}/preoperativos/preoperativos/`;
    const body = {
      preoperativo,
      empleados_preoperativos: empleadosPreoperativos
    };

    return this.http.post<Preoperativo>(url, body);
  }

  getObtenerNombresEmpleadosCargo(cargo: string): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}/empleados/getEmpleados/${cargo}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            console.error('Cargo inválido:', error.error.detail);
          } else {
            console.error('Error al obtener los nombres de empleados:', error);
          }
          return throwError(() => error);
        })
      );
  }
}