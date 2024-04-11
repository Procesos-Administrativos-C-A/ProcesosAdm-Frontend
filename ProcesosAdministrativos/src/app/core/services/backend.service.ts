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

  crearPreoperativo(preoperativo: Preoperativo, empleadosPreoperativos: Array<EmpleadosPreoperativo>): Observable<Preoperativo> {
    const url = `${this.apiUrl}/preoperativos/preoperativos/`;
    const body = {
      preoperativo,
      empleados_preoperativos: empleadosPreoperativos
    };

    return this.http.post<Preoperativo>(url, body);
  }

  // Método para obtener un registro de preoperativo por su ID junto con sus empleados preoperativos
  getPreoperativoPorId(id: number): Observable<Preoperativo> {
    const url = `${this.apiUrl}/preoperativos/idPreoperativos/${id}`;
    return this.http.get<Preoperativo>(url);
  }

  // Método para actualizar un registro de preoperativo por su ID junto con sus empleados preoperativos
  actualizarPreoperativo(id: number, preoperativo: Preoperativo, empleadosPreoperativos: EmpleadosPreoperativo[]): Observable<Preoperativo> {
    const url = `${this.apiUrl}/preoperativos/putPreoperativos/${id}`;
    const body = {
      preoperativo,
      empleados_preoperativos: empleadosPreoperativos
    };
    return this.http.put<Preoperativo>(url, body);
  }

  getEmpleados(): Observable<any[]> {
    const url = `${this.apiUrl}/empleados/getEmpleados`;
    return this.http.get<any[]>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al obtener los empleados:', error);
          return throwError(() => error);
        })
      );
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