import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUser, faCircleXmark  } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { BackendService } from '../../../core/services/backend.service';
import Swal from 'sweetalert2';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-reporte-consolidado',
  standalone: true,
  imports: [CommonModule ,FontAwesomeModule],
  templateUrl: './reporte-consolidado.component.html',
  styleUrl: './reporte-consolidado.component.css'
})
export class ReporteConsolidadoComponent {

  empleados : Array<any> =[];
  stackedBarChart: any;
  pieChart: any;
  fecha_inicio: string = '2024-03-19';
  fecha_fin: string = '2024-04-20';

  constructor( private backendService: BackendService) {}

  ngOnInit(): void {
    
    this.obtenerConsolidado('2024-03-19', '2024-04-20')

  }

  obtenerConsolidado(fecha_inicio : string, fecha_fin : string){
    this.backendService.getPreoperativosConsolidado(fecha_inicio,fecha_fin)
      .subscribe({
        next: (consolidado) => {
          this.empleados = consolidado
          console.log(this.empleados)
          this.crearGrafico();
          if(consolidado.length == 0 ){
            Swal.fire({
              title: 'El mes elegido no tiene registros!',
              text: 'No se encontraron registros para el mes seleccionado, verifique e intente nuevamente.',
              icon: 'error',
              confirmButtonColor: '#002252',
              confirmButtonText: 'Aceptar'
            })
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
          })
        }
      });
  }

  crearGrafico(): void{
    if (this.stackedBarChart) {
      this.stackedBarChart.destroy();
      this.pieChart.destroy();
    }
    let nombres: String[] =[]
    let horas_diurnas: Number[] =[]
    let horas_diurnas_festivo: Number[] =[]
    let horas_nocturnas: Number[] =[]
    let horas_nocturnas_festivo: Number[] =[]

    let grafico_torta: Number[] =[0,0,0,0]

    this.empleados.forEach(element => {
      nombres.push(element.nombre)
      horas_diurnas.push(element.horas_diurnas_ord)
      grafico_torta[0] += element.horas_diurnas_ord;
      horas_diurnas_festivo.push(element.horas_diurnas_fest)
      grafico_torta[1] += element.horas_diurnas_fest;
      horas_nocturnas.push(element.horas_nocturnas)
      grafico_torta[2] += element.horas_nocturnas;
      horas_nocturnas_festivo.push(element.horas_nocturnas_fest)
      grafico_torta[3] += element.horas_nocturnas_fest;

    });
   //width="400" height="400"

    this.stackedBarChart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: nombres,
        datasets: [
          {
            label: 'Diurnas',
            data: horas_diurnas,
            backgroundColor: 'rgba(207, 243, 117)'
          },
          {
            label: 'Diurnas Festivas',
            data: horas_diurnas_festivo,
            backgroundColor: 'rgba(243, 243, 46, 0.8)'
          },
          {
            label: 'Nocturnas',
            data: horas_nocturnas,
            backgroundColor: 'rgba(46, 174, 243, 0.8)'
          },
          {
            label: 'Nocturnas Festivas',
            data: horas_nocturnas_festivo,
            backgroundColor: 'rgba(96, 70, 247, 0.8)'
          }
        ]
      },
      options: {
        indexAxis: 'y', // Swap axes to display names on Y-axis
        elements: {
          bar: {
            borderWidth: 1 // Set bar border width
          }
        },
        responsive: true, // Enable responsiveness
        plugins: {
          legend: {
            position: 'top' // Place legend on the right
          },
          title: {
            display: false,
            text: 'Stacked Bar Chart with Names on Y-axis' // Title for the chart
          }
        }
      }
    });


    //-------------------------------------------------------------

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

  faCircleXmark = faCircleXmark;
  faCircleUser = faCircleUser;
  faBars = faBars;


  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  dropdown_menu = signal(false);
  dropdown_solicitudes = signal(false);
  

  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos()) ;
  }

  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites()) ;
  }

  dropDownMenu(): void {
    this.dropdown_menu.set(!this.dropdown_menu()) ;
  }

  dropDownSolicitudes(): void {
    this.dropdown_solicitudes.set(!this.dropdown_solicitudes()) ;
    console.log(this.fecha)
  }

  fecha = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
  empleades: Array<any> = [

    {
      "nombre": "Castro Aguirre Stiven",
      "cedula": 10538765942,
      "horas_totales":15,
      "horas_diurnas_ord": 16,
      "horas_diurnas_fest": 0,
      "horas_nocturnas": 0,
      "horas_nocturnas_fest":0 ,
      "horas_extra": 4
    },
    {
      "nombre": "Castro Henao Heosve",
      "cedula": 10538767425,
      "horas_totales":15,
      "horas_diurnas_ord": 19,
      "horas_diurnas_fest": 0,
      "horas_nocturnas": 8,
      "horas_nocturnas_fest":0 ,
      "horas_extra": 4
    },
    {
      "nombre": "Giraldo Pava Alber",
      "cedula": 10538768625,
      "horas_totales":15,
      "horas_diurnas_ord": 8,
      "horas_diurnas_fest": 1,
      "horas_nocturnas": 2,
      "horas_nocturnas_fest":0 ,
      "horas_extra": 0
    }
  ]


  consultarReporte(event : Event){
    const elementInput = event.target as HTMLInputElement;

    this.fecha_fin = elementInput.value + '-21'

    let fecha = new Date(elementInput.value + '-20');

    // Restar un mes a la fecha
    fecha.setMonth(fecha.getMonth() - 1);

    // Obtener el año, mes y día de la fecha resultante
    let año = fecha.getFullYear();
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses son indexados desde 0

    // Construir la cadena de fecha resultante en el formato deseado
    this.fecha_inicio = `${año}-${mes}-${19}`;

    console.log(this.fecha_inicio); 
    console.log(this.fecha_fin)

    this.obtenerConsolidado(this.fecha_inicio,this.fecha_fin)

  }

  generarPDF() {
   
    this.backendService.generarPDFConsolidado(this.fecha_inicio,this.fecha_fin)
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
