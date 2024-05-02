import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { BackendService } from '../../../core/services/backend.service';
import { Empleado } from '../../../core/models/empleados.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reporte-asistencia',
  standalone: true,
  templateUrl: './reporte-asistencia.component.html',
  styleUrls: ['./reporte-asistencia.component.css'],
  imports: [CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule, NavbarComponent]
})
export class ReporteAsistenciaComponent {
  empleadosObtenidos: Empleado[] = [];
  cargoSeleccionado: string = '';
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  barChart!: Chart;
  fechaInicio!: string;
  fechaFin!: string;

  constructor(private backendService: BackendService) {
    this.empleadosSeleccionados.push({ nombre: '', cedula: 0 });
  }
  // Signals para controlar los dropdown
  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  dropdown_solicitudes = signal(false);

  // Métodos para abrir/cerrar los dropdown
  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos());
  }

  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites());
  }

  dropDownSoli(): void {
    this.dropdown_solicitudes.set(!this.dropdown_solicitudes());
  }

  // Array para almacenar los empleados seleccionados
  empleadosSeleccionados: { nombre: string, cedula: number }[] = [];

  // Método para agregar un nuevo empleado vacío
  agregarEmpleado() {
    this.empleadosSeleccionados.push({ nombre: '', cedula: 0 });
  }

  // Método para eliminar un empleado
  eliminarEmpleado(index: number) {
    this.empleadosSeleccionados.splice(index, 1);
  }

  asignarCedula(empleado: { nombre: string, cedula: number }, cedula: number | undefined) {
    if (cedula !== undefined) {
      empleado.cedula = cedula;
    }
  }

  obtenerEmpleadosPorCargo() {
    this.backendService.getObtenerNombresEmpleadosCargo(this.cargoSeleccionado)
      .subscribe(
        (empleados: Empleado[]) => {
          this.empleadosObtenidos = empleados;
          console.log('Empleados obtenidos:', this.empleadosObtenidos);
        },
        (error) => {
          console.error('Error al obtener los empleados:', error);
        }
      );
  }
  /*
    generarReporte(): void {
      const datosMockeados = {
        empleados: [
          { nombre: 'Juan Pérez', datos: [{ fecha: '2023-05-01', horas: 8 }, { fecha: '2023-05-02', horas: 6 }] },
          { nombre: 'María Rodríguez', datos: [{ fecha: '2023-05-01', horas: 7 }, { fecha: '2023-05-02', horas: 9 }] }
        ]
      };
  
      this.crearGrafico(datosMockeados);
    }
    */
  generarReporte(): void {
    // Obtener las cédulas de los empleados seleccionados
    const cedulas = this.empleadosSeleccionados.map(empleado => empleado.cedula);

    // Obtener los valores de las fechas de inicio y fin
    const fechaInicio = this.fechaInicio;
    const fechaFin = this.fechaFin;

    this.backendService.getReporteAsistencia(cedulas, fechaInicio, fechaFin).subscribe(
      (data) => {
        this.crearGrafico(data);
      },
      (error) => {
        console.error('Error al obtener el reporte de asistencia:', error);
      }
    );
  }

  crearGrafico(data: any): void {
    const labels = this.obtenerEtiquetas(data);
    const datasets = this.obtenerDatosGrafico(data);

    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets,
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true,
          },
        },
      },
    });
  }

  obtenerEtiquetas(data: any): string[] {
    if (data.empleados.length === 1) {
      // Si solo hay un empleado, las etiquetas son las fechas
      return data.empleados[0].datos.map((dato: any) => dato.fecha);
    } else {
      // Si hay múltiples empleados, las etiquetas son los nombres
      return data.empleados.map((empleado: any) => empleado.nombre);
    }
  }

  obtenerDatosGrafico(data: any): any[] {
    return data.empleados.map((empleado: any) => {
      return {
        label: empleado.nombre,
        data: empleado.datos.map((dato: any) => dato.horas),
        backgroundColor: this.obtenerColorAleatorio(), // Puedes generar un color aleatorio para cada conjunto de datos
      };
    });
  }
  obtenerColorAleatorio(): string {
    // Función para generar un color aleatorio en formato hexadecimal
    const generarColorAleatorio = (): string => {
      const letras = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    return generarColorAleatorio();
  }
}