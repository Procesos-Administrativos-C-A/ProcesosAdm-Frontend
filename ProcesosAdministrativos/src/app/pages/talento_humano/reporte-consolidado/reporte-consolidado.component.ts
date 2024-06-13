// Importación de módulos y dependencias necesarias
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUser, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { BackendService } from '../../../core/services/backend.service';
import Swal from 'sweetalert2';
import { Chart } from 'chart.js/auto';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";

// Decorador del componente
@Component({
  selector: 'app-reporte-consolidado',
  standalone: true,
  templateUrl: './reporte-consolidado.component.html',
  styleUrl: './reporte-consolidado.component.css',
  imports: [CommonModule, FontAwesomeModule, NavbarComponent] // Módulos importados
})
export class ReporteConsolidadoComponent {

  // Declaración de propiedades del componente
  empleados: Array<any> = [];
  stackedBarChart: any;
  pieChart: any;
  hoy = new Date();
  año = this.hoy.getFullYear();
  mesActual = String(this.hoy.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11, por eso se suma 1
  mesAnterior = this.hoy.getMonth() - 2;
  fecha_inicio: string = '2024-05-19';
  fecha_fin: string = '2024-06-20';
  rol = Number(localStorage.getItem('rol')); // Rol obtenido del almacenamiento local

  // Constructor que inyecta el servicio backend
  constructor(private backendService: BackendService) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.obtenerConsolidado(`${this.año}-${this.mesAnterior}-${19}`, `${this.año}-${this.mesActual}-${21}`); // Obtiene el reporte consolidado inicial
  }

  // Método para obtener el consolidado de empleados entre fechas específicas
  obtenerConsolidado(fecha_inicio: string, fecha_fin: string) {
    this.backendService.getPreoperativosConsolidado(fecha_inicio, fecha_fin)
      .subscribe({
        next: (consolidado) => {
          this.empleados = consolidado;
          console.log(this.empleados);
          this.crearGrafico(); // Crea los gráficos con los datos obtenidos

          // Muestra una alerta si no hay registros
          if (consolidado.length == 0) {
            Swal.fire({
              title: 'El mes elegido no tiene registros!',
              text: 'No se encontraron registros para el mes seleccionado, verifique e intente nuevamente.',
              icon: 'error',
              confirmButtonColor: '#002252',
              confirmButtonText: 'Aceptar'
            });
          }
        },
        error: (error) => {
          console.error('Error al obtener los nombres de empleados:', error);
          Swal.fire({
            title: 'El mes elegido no tiene registros!',
            text: 'No se encontraron registros para el mes seleccionado, verifique e intente nuevamente.',
            icon: 'error',
            confirmButtonColor: '#002252',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  }

  // Método para crear los gráficos de barras y pastel
  crearGrafico(): void {
    // Destruye los gráficos existentes si ya fueron creados
    if (this.stackedBarChart) {
      this.stackedBarChart.destroy();
      this.pieChart.destroy();
    }

    // Declaración de arrays para los datos de los gráficos
    let nombres: String[] = [];
    let horas_diurnas: Number[] = [];
    let horas_diurnas_festivo: Number[] = [];
    let horas_nocturnas: Number[] = [];
    let horas_nocturnas_festivo: Number[] = [];
    let total_horas: Number[] = [];

    let grafico_torta: Number[] = [0, 0, 0, 0];

    // Procesamiento de datos para los gráficos
    this.empleados.forEach(element => {
      nombres.push(element.nombre + ' ' + element.apellidos);
      horas_diurnas.push(element.horas_diurnas_ord);
      grafico_torta[0] += element.horas_diurnas_ord;
      horas_diurnas_festivo.push(element.horas_diurnas_fest);
      grafico_torta[1] += element.horas_diurnas_fest;
      horas_nocturnas.push(element.horas_nocturnas);
      grafico_torta[2] += element.horas_nocturnas;
      horas_nocturnas_festivo.push(element.horas_nocturnas_fest);
      grafico_torta[3] += element.horas_nocturnas_fest;
      total_horas.push(element.total_horas);
    });

    // Creación del gráfico de barras apiladas
    this.stackedBarChart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: nombres,
        datasets: [
          {
            label: 'Horas totales',
            data: total_horas,
            backgroundColor: 'rgba(46, 174, 243, 0.8)'
          }
        ]
      },
      options: {
        indexAxis: 'y', // Muestra los nombres en el eje Y
        elements: {
          bar: {
            borderWidth: 1 // Ancho del borde de las barras
          }
        },
        responsive: true, // Habilita la responsividad
        plugins: {
          legend: {
            position: 'top' // Posición de la leyenda
          },
          title: {
            display: false,
            text: 'Stacked Bar Chart with Names on Y-axis' // Título del gráfico
          }
        }
      }
    });

    // Creación del gráfico de pastel
    this.pieChart = new Chart('canvasPie', {
      type: 'pie',
      data: {
        labels: ['Diurnas', 'Diurnas Festivas', 'Nocturnas', 'Nocturnas Festivas'],
        datasets: [{
          label: 'Horas totales',
          data: grafico_torta,
          backgroundColor: [
            'rgba(207, 243, 117)',
            'rgba(243, 243, 46, 0.8)',
            'rgba(46, 174, 243, 0.8)',
            'rgba(96, 70, 247, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  // Propiedad para obtener la fecha actual
  fecha = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;

  // Array de ejemplo para empleados
  empleades: Array<any> = [
    {
      "nombre": "Castro Aguirre Stiven",
      "cedula": 10538765942,
      "horas_totales": 15,
      "horas_diurnas_ord": 16,
      "horas_diurnas_fest": 0,
      "horas_nocturnas": 0,
      "horas_nocturnas_fest": 0,
      "horas_extra": 4
    },
    {
      "nombre": "Castro Henao Heosve",
      "cedula": 10538767425,
      "horas_totales": 15,
      "horas_diurnas_ord": 19,
      "horas_diurnas_fest": 0,
      "horas_nocturnas": 8,
      "horas_nocturnas_fest": 0,
      "horas_extra": 4
    },
    {
      "nombre": "Giraldo Pava Alber",
      "cedula": 10538768625,
      "horas_totales": 15,
      "horas_diurnas_ord": 8,
      "horas_diurnas_fest": 1,
      "horas_nocturnas": 2,
      "horas_nocturnas_fest": 0,
      "horas_extra": 0
    }
  ];

  // Método para consultar el reporte basado en el evento de cambio de fecha
  consultarReporte(event: Event) {
    const elementInput = event.target as HTMLInputElement;
    this.fecha_fin = elementInput.value + '-21';
    let fecha = new Date(elementInput.value + '-20');

    // Restar un mes a la fecha
    fecha.setMonth(fecha.getMonth() - 1);

    // Obtener el año, mes y día de la fecha resultante
    let año = fecha.getFullYear();
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses son indexados desde 0

    // Construir la cadena de fecha resultante en el formato deseado
    this.fecha_inicio = `${año}-${mes}-${19}`;

    console.log(this.fecha_inicio);
    console.log(this.fecha_fin);

    // Obtiene el consolidado con las nuevas fechas
    this.obtenerConsolidado(this.fecha_inicio, this.fecha_fin);
  }

  // Método para generar y descargar el PDF del reporte consolidado
  generarPDF() {
    this.backendService.generarPDFConsolidado(this.fecha_inicio, this.fecha_fin)
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
  }

  // Método para generar y descargar el EXCEL del reporte consolidado
  generarEXEL() {
    this.backendService.generarEXELConsolidado(this.fecha_inicio, this.fecha_fin)
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
  }
}
