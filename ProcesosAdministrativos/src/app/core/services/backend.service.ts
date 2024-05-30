import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Empleado } from '../models/empleados.model';
import { Preoperativo } from '../models/preoperativo.model';
import { EmpleadosPreoperativo } from '../models/empleados_preoperativo.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:8000'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para crear un nuevo preoperativo junto con sus empleados preoperativos
  crearPreoperativo(preoperativo: Preoperativo, empleadosPreoperativos: Array<EmpleadosPreoperativo>): Observable<any> {
    const url = `${this.apiUrl}/preoperativos/preoperativos/`;
    const body = {
      preoperativo,
      empleados_preoperativos: empleadosPreoperativos
    };

    return this.http.post<any>(url, body);
  }

  // Método para ingresar al sistema
  ingresar(username: string, password: string): Observable<{}> {
    const url = `${this.apiUrl}/login/ingresar/`;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post<{}>(url, formData);
  }

  // Método para obtener información del usuario autenticado
  getInformacion(): Observable<any> {
    const url = `${this.apiUrl}/login/user/me`;
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers });
  }


  // Método para obtener un registro de preoperativo por su ID junto con sus empleados preoperativos
  getPreoperativoPorId(id: number): Observable<any> {
    const url = `${this.apiUrl}/preoperativos/preoperativos_por_id/${id}`;
    return this.http.get<any>(url);
  }

  // Método para actualizar un registro de preoperativo por su ID junto con sus empleados preoperativos
  actualizarPreoperativo(id: number, preoperativo: Preoperativo, empleadosPreoperativos: Array<EmpleadosPreoperativo>): Observable<Preoperativo> {
    const url = `${this.apiUrl}/preoperativos/putPreoperativos/${id}`;
    const body = {
      preoperativo,
      empleados_preoperativos: empleadosPreoperativos
    };
    return this.http.put<Preoperativo>(url, body);
  }

  // Método para obtener la lista de empleados
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

  // Método para obtener los nombres de empleados por cargo
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

  // Método para obtener preoperativos por fecha
  getPreoperativosPorFecha(fecha: string): Observable<any[]> {
    const url = `${this.apiUrl}/preoperativos/preoperativos_por_fecha/?fecha=${fecha}`;
    return this.http.get<any[]>(url);
  }
  

  getPreoperativosConsolidado(fecha_inicio: string , fecha_fin: string): Observable<any[]> {
    const url = `${this.apiUrl}/horas_empleados/consolidado_horas/?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`; 
    return this.http.get<any[]>(url);
  }

  getEmpleadoHoras(fecha_inicio: string , fecha_fin: string, cedulas: number[]): Observable<any[]> {
    const url = `${this.apiUrl}/horas_empleados/asistencia_horas/?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&lista_cedulas=${cedulas}`; 
    return this.http.get<any[]>(url);
  }
  
// Método para generar un PDF de preoperativos por fecha
  generarPDFPreoperativosPorFecha(fecha: string): Observable<{ blob: Blob, fileName: string }> {
    const url = `${this.apiUrl}/preoperativos/generar_pdf_preoperativos_fecha/?fecha=${fecha}`;
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => {
          // Aquí puedes determinar el nombre del archivo según tus necesidades
          const fileName = `preoperativos_${fecha}.pdf`;
          return { blob, fileName };
        })
      );
  }

  generarPDFConsolidado(fecha_incio: string, fecha_fin: string): Observable<{ blob: Blob, fileName: string }> {
    const url = `${this.apiUrl}/horas_empleados/generar_pdf_consolidado_horas/?fecha_inicio=${fecha_incio}&fecha_fin=${fecha_fin}`;
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => {
          // Aquí puedes determinar el nombre del archivo según tus necesidades
          const fileName = `Consolidado_Horas_${fecha_incio} - ${fecha_fin}.pdf`;
          return { blob, fileName };
        })
      );
  }

  generarEXELConsolidado(fecha_incio: string, fecha_fin: string): Observable<{ blob: Blob, fileName: string }> {
    const url = `${this.apiUrl}/horas_empleados/generar_pdf_consolidado_horas/?fecha_inicio=${fecha_incio}&fecha_fin=${fecha_fin}`;
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => {
          // Aquí puedes determinar el nombre del archivo según tus necesidades
          const fileName = `Consolidado_Horas_${fecha_incio} - ${fecha_fin}.xlsx`;
          return { blob, fileName };
        })
      );
  }
  
  // Cambiar
  getEmpleadosContratoVencido(): Observable<Empleado[]> {
    const url = `${this.apiUrl}/empleados/contrato-vencido`;
    return this.http.get<Empleado[]>(url);
  }
  //Cambiar
  generarPdfEmpleado(cedula: string): Observable<{ blob: Blob, fileName: string }> {
    const url = `${this.apiUrl}/empleados/generar-pdf/${cedula}`;
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => {
          const fileName = `empleado_${cedula}.pdf`;
          return { blob, fileName };
        })
      );
  }

}

