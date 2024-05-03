import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { BackendService } from '../../../core/services/backend.service';
import { Empleado } from '../../../core/models/empleados.model';
import { Chart, ChartDataset } from 'chart.js/auto';
import { CustomValidators } from '../../../core/validators/custom_validators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-asistencia',
  standalone: true,
  templateUrl: './reporte-asistencia.component.html',
  styleUrls: ['./reporte-asistencia.component.css'],
  imports: [CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule, NavbarComponent]
})
export class ReporteAsistenciaComponent {

  empleadosForm: FormGroup = new FormGroup({
    fechaInicio : new FormControl('', [Validators.required,Validators.nullValidator]),
    fechaFin :  new FormControl('', [Validators.required,Validators.nullValidator]),
    empleados: new FormArray([
      new FormGroup({
        cargo: new FormControl('OPERADOR',[Validators.required, Validators.nullValidator]),
        nombre: new FormControl ('',[Validators.required, Validators.nullValidator]),
        cedula: new FormControl ( 0 ,[Validators.required, Validators.nullValidator]),
      }),
      new FormGroup({
        cargo: new FormControl('OPERADOR',[Validators.required, Validators.nullValidator]),
        nombre: new FormControl ('',[Validators.required, Validators.nullValidator]),
        cedula: new FormControl ( 0 ,[Validators.required, Validators.nullValidator]),
      })
    ])
  }, [CustomValidators.fechaFinalMenorQueInicial]);

  
  empleados: any =  {};

  stackedBarChart: any;
  pieChart: any;

  horas: Array<any> =[];

  dias_semana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
 
  constructor(private backendService: BackendService) {
    
  }
 
  ngOnInit(): void {
    this.obtenerNombresEmpleados('OPERADOR')
  }

  obtenerHoras(fecha_inicio : string, fecha_fin : string, cedulas : number[]){
    this.backendService.getEmpleadoHoras(fecha_inicio,fecha_fin,cedulas)
      .subscribe({
        next: (horas) => {
          console.log(horas)
          this.horas= horas;
          this.crearGrafico();
          if(horas.length == 0 ){
            
            Swal.fire({
              title: 'Empleado/s sin registros!',
              text: 'No se encontraron registros en el rango de fechas seleccionado, verifique e intente nuevamente.',
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
            text: 'No se encontraron registros en el rango de fechas seleccionado, verifique e intente nuevamente.',
            icon: 'error',
            confirmButtonColor: '#002252',
            confirmButtonText: 'Aceptar'
          })
        }
      });
  }

  obtenerNombresEmpleados(cargo: string) {
    if(cargo in this.empleados){
      return
    }
    this.backendService.getObtenerNombresEmpleadosCargo(cargo)
      .subscribe({
        next: (empleados) => {
          
          this.empleados[cargo] = empleados;
          console.log(this.empleados)
        },
        error: (error) => {
          console.error('Error al obtener los nombres de empleados:', error);
        }
      });
  }

  get empleadosArray(): FormArray {
    return this.empleadosForm.get('empleados') as FormArray;
    
  }

  asignarCargoEmpleado(j: number, event : Event){
    const elementInput = event.target as HTMLInputElement;
    this.obtenerNombresEmpleados(elementInput.value);
    const empleado = (this.empleadosArray as unknown as FormArray).at(j)
    empleado.get('cargo')?.setValue(elementInput.value);
    empleado.get('nombre')?.setValue("");
    empleado.get('cedula')?.setValue(0);
  }

  asignarNombreEmpleado(cargo : string , j: number,event: Event){
    const elementInput = event.target as HTMLInputElement;
    const empleado = (this.empleadosArray as unknown as FormArray).at(j);
    const cedula: string = this.empleados[cargo].find((objeto: { nombre: any; }) => objeto.nombre === elementInput.value)['cedula'];
    empleado.get('nombre')?.setValue(elementInput.value);
    empleado.get('cedula')?.setValue(cedula);
  }

  eliminarEmpleado( j: number) {
    (this.empleadosArray as unknown as FormArray).removeAt(j);
  }

  agregarEmpleado() {
    const empleadoFormGroup = new FormGroup({
      cargo: new FormControl('OPERADOR',[Validators.required, Validators.nullValidator]),
      nombre: new FormControl ('',[Validators.required, Validators.nullValidator]),
      cedula: new FormControl ( 0 ,[Validators.required, Validators.nullValidator]),
    });
    (this.empleadosArray as unknown as FormArray).push(empleadoFormGroup);
  }

  asignarCedula(empleado: { nombre: string, cedula: number }, cedula: number | undefined) {
    if (cedula !== undefined) {
      empleado.cedula = cedula;
    }
  }

  
 
  generarReporte(): void {
    console.log(this.empleadosForm)
    const cedulas : number[] =[]
    this.empleadosArray.controls.forEach(element => {
      cedulas.push(element.get('cedula')?.value)
    });

    this.obtenerHoras(this.empleadosForm.get('fechaInicio')?.value,this.empleadosForm.get('fechaFin')?.value,cedulas)
    
  }

  crearGrafico(): void{
    if (this.stackedBarChart) {
      this.stackedBarChart.destroy();
      this.pieChart.destroy();
    }
    let nombres: string[] =[]
    let fechas: string[] =[]
    let horas_diurnas: number[] =[]
    let horas_diurnas_festivo: number[] =[]
    let horas_nocturnas: number[] =[]
    let horas_nocturnas_festivo: number[] =[]
    let horas_extras: number[] =[]
    let total_horas: any ={

    }

    let grafico_torta: number[] =[0,0,0,0,0]

    let torta_grupal: number[] = []

    this.horas.forEach(persona => {
      
      nombres.push(persona.nombre + ' '+ persona.apellidos)
      total_horas.
      persona.horas.forEach( (registro: any) => {
        console.log(registro)
        console.log(registro.horas_diurnas_ord)
        fechas.push(this.dias_semana[new Date(registro.fecha).getDay()] + ' - ' +registro.fecha)
        horas_diurnas.push(registro.horas_diurnas_ord)
        grafico_torta[0] += registro.horas_diurnas_ord;
        horas_diurnas_festivo.push(registro.horas_diurnas_fest)
        grafico_torta[1] += registro.horas_diurnas_fest;
        horas_nocturnas.push(registro.horas_nocturnas)
        grafico_torta[2] += registro.horas_nocturnas;
        horas_nocturnas_festivo.push(registro.horas_nocturnas_fest)
        grafico_torta[3] += registro.horas_nocturnas_fest;
        horas_nocturnas_festivo.push(registro.horas_extras)
        grafico_torta[4] += registro.horas_extras;
        total_horas.push(registro.total_horas)
        torta_grupal.push(registro.total_horas)
      });
      

    });
   //width="400" height="400"

    if(nombres.length == 1){
      this.stackedBarChart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: fechas,
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
            },
            {
              label: 'Extra',
              data: horas_extras,
              backgroundColor: 'rgba(96, 70, 217, 0.8)'
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
    }else{
      let datasets2: ChartDataset<'bar', number[]>[] = [];
      for (let i = 0; i < nombres.length; i++) {
        datasets2.push({
          label: nombres[i],
          data: total_horas,
          backgroundColor: this.obtenerColorAleatorio(),
          borderColor: 'rgba(0, 0, 0, 0.5)',
          borderWidth: 1
        });
      }
    
    this.stackedBarChart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: fechas,
        datasets: datasets2
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
  }
    

    //-------------------------------------------------------------

    this.pieChart = new Chart('canvasPie', {
      type: 'pie',
      data: {
        labels: ['Diurnas', 'Diurnas Festivas', 'Nocturnas', 'Nocturnas Festivas','Extra'],
        datasets: [{
          label: 'Horas totales',
          data: grafico_torta,
          backgroundColor: [
            'rgba(207, 243, 117)',
            'rgba(243, 243, 46, 0.8)',
            'rgba(46, 174, 243, 0.8)',
            'rgba(96, 70, 247, 0.8)',
            'rgba(96, 70, 217, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true
      }
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