import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Preoperativo } from '../../../core/models/preoperativo.model';
import { EmpleadosPreoperativo } from '../../../core/models/empleados_preoperativo.model';
import { BackendService } from '../../../core/services/backend.service';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";


@Component({
    selector: 'app-preoperativos',
    standalone: true,
    templateUrl: './mostrar-preoperativos.component.html',
    styleUrls: ['./mostrar-preoperativos.component.css'],
    imports: [CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule, NavbarComponent]
})
export class MostrarPreoperativosComponent implements OnInit {
  preoperativos: Preoperativo[] = [];

  empleadosPreoperativo: EmpleadosPreoperativo[] = [];

  preoperativoSeleccionado: Preoperativo | null = null;
  preoperativoForm: FormGroup;
  fechaBusqueda: string = '';
  private fechaBusquedaAnterior: string = '';
  modalVisible = false;

  constructor(private fb: FormBuilder, private backendService: BackendService) {
    this.preoperativoForm = this.fb.group({});
    const fechaActual = new Date().toISOString().split('T')[0];
    this.fechaBusqueda = fechaActual;
  }

  ngOnInit() {
    console.log('Componente inicializado');
    this.obtenerPreoperativosPorFecha(this.fechaBusqueda);
  }

  // Mapea y asigna los preoperativos obtenidos a la propiedad preoperativos
  obtenerPreoperativosPorFecha(fecha: string) {
    this.backendService.getPreoperativosPorFecha(fecha)
      .subscribe({
        next: (preoperativos: Preoperativo[]) => {
          this.preoperativos = preoperativos.map((preoperativo) => ({
            id: preoperativo.id,
            fecha: preoperativo.fecha,
            encargado: preoperativo.encargado,
            turno: preoperativo.turno,
            lugar: preoperativo.lugar,
            festivo: Boolean(preoperativo.festivo), // Cambiar esta línea
            empleados_preoperativos: preoperativo.empleados_preoperativos?.map((empleado: EmpleadosPreoperativo) => ({
              id: empleado.id,
              id_preoperativo: empleado.id_preoperativo,
              cedula: empleado.cedula.toString(),
              nombre: empleado.nombre ,
              apellidos : empleado.apellidos,
              horas_diarias: empleado.horas_diarias,
              horas_adicionales: empleado.horas_adicionales,
              estacion: empleado.estacion
            }))
          }));
        },
        error: (error) => {
          console.error('Error al obtener los preoperativos:', error);
        }
      });
  }


  // Define métodos para manejar dropdowns
  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  dropdown_solicitudes = signal(false);

  // Método para dropdown de preoperativos
  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos());
  }

  // Método para dropdown de tramites
  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites());
  }

  // Método para dropdown de solicitudes
  dropDownSoli(): void {
    this.dropdown_solicitudes.set(!this.dropdown_solicitudes());
  }

  // Define métodos para procesar datos recibidos del backend
  procesarDatosBackend(data: any) {
    // Procesa los datos recibidos del backend y actualiza la lista de preoperativos
    const preoperativo: Preoperativo = {
      fecha: data.preoperativo.fecha,
      encargado: data.preoperativo.encargado,
      turno: data.preoperativo.turno,
      lugar: data.preoperativo.lugar,
      festivo: data.preoperativo.festivo === 1,
      empleados_preoperativos: data.empleados_preoperativos.map((empleado: any) => ({
        cedula: empleado.cedula.toString(),
        nombre: empleado.nombre,
        horas_diarias: empleado.horas_diarias,
        horas_adicionales: empleado.horas_adicionales,
        estacion: empleado.estacion
      }))
    };
    this.preoperativos.push(preoperativo);
  }

  // Define métodos para filtrar preoperativos y agrupar empleados
  filtrarPreoperativos(): Preoperativo[] {
    if (!this.fechaBusqueda) {
      this.preoperativoSeleccionado = null;
      return this.preoperativos.slice(0, 9);
    }

    // Si la fecha de búsqueda cambió, restablece el preoperativoSeleccionado
    if (this.fechaBusqueda !== this.fechaBusquedaAnterior) {
      this.preoperativoSeleccionado = null;
      this.obtenerPreoperativosPorFecha(this.fechaBusqueda);
    }
    this.fechaBusquedaAnterior = this.fechaBusqueda;

    const preoperativosFiltrados = this.preoperativos.filter(preoperativo => preoperativo.fecha === this.fechaBusqueda);
    return preoperativosFiltrados.slice(0, 9);
  }

  // Agrupa empleados de un preoperativo por estación
  agruparEmpleadosPorEstacion(preoperativo: Preoperativo): { [estacion: string]: EmpleadosPreoperativo[] } {
    if (!preoperativo.empleados_preoperativos) {
      return {};
    }

    return preoperativo.empleados_preoperativos.reduce((grupos, empleado) => {
      const estacion = empleado.estacion;
      if (!grupos[estacion]) {
        grupos[estacion] = [];
      }
      grupos[estacion].push(empleado);
      return grupos;
    }, {} as { [estacion: string]: EmpleadosPreoperativo[] });
  }

  empleadosAgrupadosPorEstacion: { [estacion: string]: EmpleadosPreoperativo[] } = {};

  // Método para ver detalles de un preoperativo seleccionado
  verDetalles(preoperativo: Preoperativo) {
    this.preoperativoSeleccionado = preoperativo;
    this.empleadosAgrupadosPorEstacion = this.agruparEmpleadosPorEstacion(preoperativo);
    this.modalVisible = true;
  }

  // Método para generar un PDF de preoperativos
  generarPDF() {
    if (this.fechaBusqueda) {
      this.backendService.generarPDFPreoperativosPorFecha(this.fechaBusqueda)
        .subscribe({
          next: ({ blob, fileName }) => {
            // Descargar el archivo directamente
            const anclaDescarga = document.createElement('a');
            anclaDescarga.href = window.URL.createObjectURL(blob);
            anclaDescarga.download = fileName;
            anclaDescarga.click();
          },
          error: (error) => {
            console.error('Error al generar el PDF:', error);
          }
        });
    } else {
      console.error('No se ha seleccionado una fecha');
    }
  }
}