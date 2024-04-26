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
    this.preoperativoForm = this.fb.group({
      // Agrega los controles necesarios para los detalles del preoperativo
    });
    const fechaActual = new Date().toISOString().split('T')[0];
    this.fechaBusqueda = fechaActual;
  }

  ngOnInit() {
    console.log('Componente inicializado');
    // this.simularDatosBackend(); // Puedes comentar o eliminar esta línea
    this.obtenerPreoperativosPorFecha(this.fechaBusqueda);
  }

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



  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  dropdown_solicitudes = signal(false);

  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos());
  }

  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites());
  }

  dropDownSoli(): void {
    this.dropdown_solicitudes.set(!this.dropdown_solicitudes());
  }

  procesarDatosBackend(data: any) {
    const preoperativo: Preoperativo = {
      fecha: data.preoperativo.fecha,
      encargado: data.preoperativo.encargado,
      turno: data.preoperativo.turno,
      lugar: data.preoperativo.lugar,
      festivo: data.preoperativo.festivo === 1,
      empleados_preoperativos: data.empleados_preoperativos.map((empleado: any) => ({
        cedula: empleado.cedula.toString(),
        horas_diarias: empleado.horas_diarias,
        horas_adicionales: empleado.horas_adicionales,
        estacion: empleado.estacion
      }))
    };
    this.preoperativos.push(preoperativo);
    console.log('Preoperativos actualizados:', this.preoperativos);
  }

  filtrarPreoperativos(): Preoperativo[] {
    console.log('Fecha de búsqueda:', this.fechaBusqueda);
    if (!this.fechaBusqueda) {
      console.log('No hay fecha de búsqueda, mostrando los primeros 9 preoperativos');
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
    console.log('Preoperativos filtrados:', preoperativosFiltrados);
    return preoperativosFiltrados.slice(0, 9);
  }

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

  verDetalles(preoperativo: Preoperativo) {
    this.preoperativoSeleccionado = preoperativo;
    this.empleadosAgrupadosPorEstacion = this.agruparEmpleadosPorEstacion(preoperativo);
    console.log('Preoperativo seleccionado:', preoperativo);
    this.modalVisible = true;
  }

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