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
import moment from 'moment';

@Component({
  selector: 'app-reporte-asistencia',
  standalone: true,
  templateUrl: './reporte-asistencia.component.html',
  styleUrls: ['./reporte-asistencia.component.css'],
  imports: [CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule, NavbarComponent]
})
export class ReporteAsistenciaComponent {

  empleadosForm: FormGroup = new FormGroup({
    fechaInicio: new FormControl('', [Validators.required, Validators.nullValidator]),
    fechaFin: new FormControl('', [Validators.required, Validators.nullValidator]),
    empleados: new FormArray([
      new FormGroup({
        cargo: new FormControl('OPERADOR', [Validators.required, Validators.nullValidator]),
        nombre: new FormControl('', [Validators.required, Validators.nullValidator]),
        cedula: new FormControl(0, [Validators.required, Validators.nullValidator]),
      }),
      new FormGroup({
        cargo: new FormControl('OPERADOR', [Validators.required, Validators.nullValidator]),
        nombre: new FormControl('', [Validators.required, Validators.nullValidator]),
        cedula: new FormControl(0, [Validators.required, Validators.nullValidator]),
      })
    ])
  }, [CustomValidators.fechaFinalMenorQueInicial]);


  empleados: any = {};

  stackedBarChart: any;


  horas: Array<any> = [];

  dias_semana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor(private backendService: BackendService) {

  }

  ngOnInit(): void {
    this.obtenerNombresEmpleados('OPERADOR')
  }

  obtenerHoras(fecha_inicio: string, fecha_fin: string, cedulas: number[]) {
    this.backendService.getEmpleadoHoras(fecha_inicio, fecha_fin, cedulas)
      .subscribe({
        next: (horas) => {
          console.log(horas)
          this.horas = horas;
          this.crearGrafico();
          if (horas.length == 0) {

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
    if (cargo in this.empleados) {
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

  asignarCargoEmpleado(j: number, event: Event) {
    const elementInput = event.target as HTMLInputElement;
    this.obtenerNombresEmpleados(elementInput.value);
    const empleado = (this.empleadosArray as unknown as FormArray).at(j)
    empleado.get('cargo')?.setValue(elementInput.value);
    empleado.get('nombre')?.setValue("");
    empleado.get('cedula')?.setValue(0);
  }

  asignarNombreEmpleado(cargo: string, j: number, event: Event) {
    const elementInput = event.target as HTMLInputElement;
    const empleado = (this.empleadosArray as unknown as FormArray).at(j);
    const cedula: string = this.empleados[cargo].find((objeto: { nombre: any; }) => objeto.nombre === elementInput.value)['cedula'];
    empleado.get('nombre')?.setValue(elementInput.value);
    empleado.get('cedula')?.setValue(cedula);
  }

  eliminarEmpleado(j: number) {
    (this.empleadosArray as unknown as FormArray).removeAt(j);
  }

  agregarEmpleado() {
    const empleadoFormGroup = new FormGroup({
      cargo: new FormControl('OPERADOR', [Validators.required, Validators.nullValidator]),
      nombre: new FormControl('', [Validators.required, Validators.nullValidator]),
      cedula: new FormControl(0, [Validators.required, Validators.nullValidator]),
    });
    (this.empleadosArray as unknown as FormArray).push(empleadoFormGroup);
  }

  asignarCedula(empleado: { nombre: string, cedula: number }, cedula: number | undefined) {
    if (cedula !== undefined) {
      empleado.cedula = cedula;
    }
  }



  generarReporte(): void {
    const cedulas: number[] = []
    this.empleadosArray.controls.forEach(element => {
      cedulas.push(element.get('cedula')?.value)
    });

    this.obtenerHoras(this.empleadosForm.get('fechaInicio')?.value, this.empleadosForm.get('fechaFin')?.value, cedulas)

  }

  crearGrafico(): void {
    if (this.stackedBarChart) {
      this.stackedBarChart.destroy();
    }

    const { nombres, fechas, datos } = this.prepararDatos();

    if (nombres.length === 1) {
      this.crearGraficoIndividual(nombres[0], fechas, datos);
    } else {
      this.crearGraficoMultiple(nombres, datos, fechas);
    }
  }

  prepararDatos(): { nombres: string[], fechas: string[], datos: any[] } {
    const nombres: string[] = [];
    const fechas: string[] = [];
    const datos: any[] = [];
    const totalHorasEmpleado: { [nombre: string]: number } = {};

    this.horas.forEach(persona => {
      const nombreCompleto = persona.nombre + ' ' + persona.apellidos;
      nombres.push(nombreCompleto);

      let totalHoras = 0;
      const datosPersona: any = {
        horas_diurnas: [],
        horas_diurnas_festivo: [],
        horas_nocturnas: [],
        horas_nocturnas_festivo: [],
        horas_extras: []
      };

      persona.horas.forEach((registro: any) => {
        fechas.push(this.dias_semana[new Date(registro.fecha).getDay()] + ' - ' + registro.fecha);
        datosPersona.horas_diurnas.push(registro.horas_diurnas_ord);
        datosPersona.horas_diurnas_festivo.push(registro.horas_diurnas_fest);
        datosPersona.horas_nocturnas.push(registro.horas_nocturnas);
        datosPersona.horas_nocturnas_festivo.push(registro.horas_nocturnas_fest);
        datosPersona.horas_extras.push(registro.horas_extras);
        totalHoras += registro.total_horas;
      });

      datos.push(datosPersona);
      totalHorasEmpleado[nombreCompleto] = totalHoras;
    });

    return { nombres, fechas, datos };
  }

  crearGraficoIndividual(nombre: string, fechas: string[], datos: any[]) {
    this.stackedBarChart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: fechas,
        datasets: [
          {
            label: 'Diurnas',
            data: datos[0].horas_diurnas,
            backgroundColor: 'rgba(207, 243, 117)'
          },
          {
            label: 'Diurnas Festivas',
            data: datos[0].horas_diurnas_festivo,
            backgroundColor: 'rgba(243, 243, 46, 0.8)'
          },
          {
            label: 'Nocturnas',
            data: datos[0].horas_nocturnas,
            backgroundColor: 'rgba(46, 174, 243, 0.8)'
          },
          {
            label: 'Nocturnas Festivas',
            data: datos[0].horas_nocturnas_festivo,
            backgroundColor: 'rgba(96, 70, 247, 0.8)'
          },
          {
            label: 'Extra',
            data: datos[0].horas_extras,
            backgroundColor: 'rgba(96, 70, 217, 0.8)'
          }
        ]
      },
      options: {
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 1
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: false,
            text: `Stacked Bar Chart with Name ${nombre}`
          }
        }
      }
    });
  }


  crearGraficoMultiple(nombres: string[], datos: any[], fechas: string[]) {
    console.log(fechas);
    console.log(datos);
    const datasets: ChartDataset<'bar', number[]>[] = [];

    // Calcular la diferencia de días entre fechaInicio y fechaFin
    const fechaInicio = moment(this.empleadosForm.get('fechaInicio')?.value);
    const fechaFin = moment(this.empleadosForm.get('fechaFin')?.value);
    const diferenciaDias = fechaFin.diff(fechaInicio, 'days') + 1; 

    // Iterar sobre los nombres de los empleados
    nombres.forEach((nombre, index) => {
      let horasTotales = 0;

      if (datos[index]) {
        horasTotales =
          (datos[index].horas_diurnas || []).reduce((acc: number, val: number) => acc + val, 0) +
          (datos[index].horas_diurnas_festivo || []).reduce((acc: number, val: number) => acc + val, 0) +
          (datos[index].horas_nocturnas || []).reduce((acc: number, val: number) => acc + val, 0) +
          (datos[index].horas_nocturnas_festivo || []).reduce((acc: number, val: number) => acc + val, 0) +
          (datos[index].horas_extras || []).reduce((acc: number, val: number) => acc + val, 0);
      }

      // Agregar conjunto de datos solo si hay horas registradas
      if (horasTotales > 0) {
        datasets.push({
          label: nombre,
          data: [horasTotales],
          backgroundColor: this.obtenerColorAleatorio(),
          borderColor: 'rgba(0, 0, 0, 0.5)',
          borderWidth: 1
        });
      }
    });

    this.stackedBarChart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: [`${diferenciaDias} días`], // Usamos la diferencia de días como etiqueta en el eje Y
        datasets: datasets
      },
      options: {
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 1
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: false,
            text: 'Total Hours per Employee'
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Horas'
            },
            ticks: {
              precision: 0,
              callback: function (value: any) {
                return Number.isInteger(value) ? value : '';
              }
            }
          }
        }
      }
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