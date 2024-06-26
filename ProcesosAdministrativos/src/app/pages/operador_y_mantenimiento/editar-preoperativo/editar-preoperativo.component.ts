import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Preoperativo } from '../../../core/models/preoperativo.model';
import { BackendService } from '../../../core/services/backend.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus, faTrashCan, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { EmpleadosPreoperativo } from '../../../core/models/empleados_preoperativo.model';
import Swal from 'sweetalert2';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-editar-preoperativo',
  standalone: true,
  templateUrl: './editar-preoperativo.component.html',
  styleUrls: ['./editar-preoperativo.component.css'],
  imports: [CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule, NavbarComponent]
})
export class EditarPreoperativoComponent implements OnInit {

  preoperativoForm: FormGroup = new FormGroup({
    lugar: new FormControl("", [Validators.required, Validators.nullValidator]),
    fecha: new FormControl("", [Validators.required]),
    turno: new FormControl("", [Validators.required, Validators.nullValidator]),
    festivo: new FormControl(false),
    extra: new FormControl(false),
    estaciones: new FormArray([])
  });

  rol = Number(localStorage.getItem('rol'));
  empleados: any = {};
  preoperativoBd: any = {};
  faCirclePlus = faCirclePlus;
  faTrashCan = faTrashCan;
  faCalendarDays = faCalendarDays;

  constructor(private fb: FormBuilder, private backendService: BackendService) {}

  ngOnInit(): void {
    const cedula = localStorage.getItem("cedula") || '0';
    this.backendService.getUltimoPreoperativo(parseInt(cedula))
      .subscribe({
        next: (preoperativo) => {
          this.preoperativoBd['preoperativo'] = preoperativo;
          this.asignarPreoperativo();
          this.asignarEmpleados().then(() => {
            console.log('Empleados asignados y procesados');
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'No se encontraron registros!',
            text: 'No se encontraron registros de preoperativos recientes, verifique e intente nuevamente.',
            icon: 'error',
            confirmButtonColor: '#002252',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            window.history.back();
          });
        }
      });
  }

  get estacionesesArray() {
    return this.preoperativoForm.get('estaciones') as FormArray;
  }

  empleadosArray(estacion: number): FormArray {
    return this.estacionesesArray.at(estacion).get('empleados') as FormArray;
  }

  asignarPreoperativo() {
    if (this.preoperativoBd) {
      this.preoperativoForm = new FormGroup({
        lugar: new FormControl(this.preoperativoBd.preoperativo.lugar, [Validators.required, Validators.nullValidator]),
        fecha: new FormControl({ value: this.preoperativoBd.preoperativo.fecha, disabled: true }, [Validators.required]),
        turno: new FormControl(this.preoperativoBd.preoperativo.turno, [Validators.required, Validators.nullValidator]),
        festivo: new FormControl(Boolean(this.preoperativoBd.preoperativo.festivo)),
        extra: new FormControl(Boolean(this.preoperativoBd.preoperativo.horas_extra)),
        estaciones: new FormArray([])
      });
    }
  }

  async asignarEmpleados() {
    if (this.preoperativoBd) {
      let lineas: any[] = [];
      switch (this.preoperativoBd.preoperativo.lugar) {
        case 'Linea1':
          lineas = ['Fundadores', 'Betania', 'Cambulos'];
          break;
        case 'Linea2':
          lineas = ['Villamaria + S.A.V', 'Villamaria + S.U.V'];
          break;
        case 'Mantenimiento':
          lineas = ['Mantenimiento'];
          break;
        default:
          break;
      }

      const estacion = this.preoperativoForm.get('estaciones') as FormArray;
      estacion.clear();

      for (const element of lineas) {
        const empleados: FormArray<any> = new FormArray<any>([]);
        for (const element2 of this.preoperativoBd.preoperativo.empleados_preoperativos) {
          if (element2.estacion === element) {
            await this.obtenerNombresEmpleados(element2.cargo); // Esperar a que la consulta se complete
            empleados.push(
              new FormGroup({
                hora_extra: new FormControl(element2.horas_adicionales.toString(), [Validators.pattern(/^[0-9]$/), Validators.maxLength(1)]),
                cargo: new FormControl(element2.cargo, [Validators.required, Validators.nullValidator]),
                nombre: new FormControl(element2.nombre + ' ' + element2.apellidos, [Validators.required, Validators.nullValidator]),
                cedula: new FormControl(element2.cedula, [Validators.required, Validators.nullValidator]),
              })
            );
            await this.delay(1000); // Esperar 1 segundo entre cada consulta
          }
        }

        const insertable = new FormGroup({
          nombre: new FormControl([element, [Validators.required]]),
          empleados: empleados
        });
        estacion.push(insertable);
      }
    }
  }

  async obtenerNombresEmpleados(cargo: string) {
    if (cargo in this.empleados) {
      return;
    }
    return new Promise<void>((resolve, reject) => {
      this.backendService.getObtenerNombresEmpleadosCargo(cargo)
        .subscribe({
          next: (empleados) => {
            this.empleados[cargo] = empleados;
            resolve();
          },
          error: (error) => {
            Swal.fire({
              title: '¡Error!',
              text: 'No se pudieron cargar las personas con el cargo ' + cargo + ', por favor inténtelo nuevamente.',
              icon: 'error',
              confirmButtonColor: '#002252',
              confirmButtonText: 'Aceptar'
            });
            reject(error);
          }
        });
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  guardarRegistroPreoperativo(preoperativo: Preoperativo, empleados_preoperativo: Array<EmpleadosPreoperativo>) {
    const numero_registro = parseInt(localStorage.getItem('ultimo_registro') ?? '-1');
    this.backendService.actualizarPreoperativo(this.preoperativoBd.preoperativo.id, preoperativo, empleados_preoperativo)
      .subscribe(
        (preoperativoInsertado) => {
          Swal.fire({
            title: '¡Guardado!',
            text: 'Los cambios hechos al preoperativo se han almacenado correctamente.',
            icon: 'success',
            confirmButtonColor: '#002252',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            window.location.reload();
          });
        },
        (error) => {
          Swal.fire({
            title: '¡Error!',
            text: 'No se pudieron registrar los cambios en el preoperatorio, inténtelo nuevamente.',
            icon: 'error',
            confirmButtonColor: '#002252',
            confirmButtonText: 'Aceptar'
          });
        }
      );
  }

  actualizarLinea(event: Event) {
    const elementInput = event.target as HTMLInputElement;
    let lineas: any[] = [];

    switch (elementInput.value) {
      case 'Linea1':
        lineas = ['Fundadores', 'Betania', 'Cambulos'];
        break;
      case 'Linea2':
        lineas = ['Villamaria + S.A.V', 'Villamaria + S.U.V'];
        break;
      case 'Mantenimiento':
        lineas = ['Mantenimiento'];
        break;
      default:
        break;
    }

    const estacion = this.preoperativoForm.get('estaciones') as FormArray;
    estacion.clear();
    lineas.forEach(element => {
      const insertable = new FormGroup({
        nombre: new FormControl([element, [Validators.required]]),
        empleados: new FormArray([
          new FormGroup({
            hora_extra: new FormControl('0', [Validators.pattern(/^[0-9]$/), Validators.maxLength(1)]),
            cargo: new FormControl('OPERADOR', [Validators.required, Validators.nullValidator]),
            nombre: new FormControl('', [Validators.required, Validators.nullValidator]),
            cedula: new FormControl('', [Validators.required, Validators.nullValidator]),
          }),
          new FormGroup({
            hora_extra: new FormControl('0', [Validators.pattern(/^[0-9]$/), Validators.maxLength(1)]),
            cargo: new FormControl('OPERADOR', [Validators.required, Validators.nullValidator]),
            nombre: new FormControl('', [Validators.required, Validators.nullValidator]),
            cedula: new FormControl('', [Validators.required, Validators.nullValidator]),
          }),
          new FormGroup({
            hora_extra: new FormControl('0', [Validators.pattern(/^[0-9]$/), Validators.maxLength(1)]),
            cargo: new FormControl('OPERADOR', [Validators.required, Validators.nullValidator]),
            nombre: new FormControl('', [Validators.required, Validators.nullValidator]),
            cedula: new FormControl('', [Validators.required, Validators.nullValidator]),
          })
        ])
      });
      estacion.push(insertable);
    });
  }

  asignarCargoEmpleado(i: number, j: number, event: Event) {
    const elementInput = event.target as HTMLInputElement;
    this.obtenerNombresEmpleados(elementInput.value);
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('hora_extra')?.setValue("0");
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('nombre')?.setValue("");
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('cargo')?.setValue(elementInput.value);
  }

  asignarNombreEmpleado(cargo: string, i: number, j: number, event: Event) {
    const elementInput = event.target as HTMLInputElement;
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('nombre')?.setValue(elementInput.value);
    const cedula: string = this.empleados[cargo].find((objeto: { nombre: any; }) => objeto.nombre === elementInput.value)['cedula'];
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('cedula')?.setValue(cedula);
  }

  asignarHorasEmpleado(i: number, j: number, event: Event) {
    const elementInput = event.target as HTMLInputElement;
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('hora_extra')?.setValue(elementInput.value);
  }

  agregarEmpleado(estacionEmp: string) {
    const empleadoFormGroup = new FormGroup({
      hora_extra: new FormControl('0', [Validators.pattern(/^[0-9]$/), Validators.maxLength(1)]),
      cargo: new FormControl('OPERADOR', [Validators.required, Validators.nullValidator]),
      nombre: new FormControl('', [Validators.required, Validators.nullValidator]),
      cedula: new FormControl('', [Validators.required, Validators.nullValidator]),
    });
    const estaciones = this.preoperativoForm.get('estaciones') as FormArray;
    for (const estacion of estaciones.controls) {
      if (estacion.get('nombre')?.value[0] === estacionEmp) {
        const empleados = estacion.get('empleados') as FormArray;
        empleados.push(empleadoFormGroup);
        break;
      }
    }
  }

  eliminarEmpleado(i: number, j: number) {
    (this.estacionesesArray.at(i).get('empleados') as FormArray).removeAt(j);
  }

  async guardarInformacion() {
    const preoperativo: Preoperativo = {
      fecha: this.preoperativoForm.get("fecha")?.value,
      encargado: this.preoperativoBd.preoperativo.encargado,
      turno: this.preoperativoForm.get("turno")?.value,
      lugar: this.preoperativoForm.get("lugar")?.value,
      festivo: this.preoperativoForm.get("festivo")?.value,
      horas_extra: this.preoperativoForm.get("extra")?.value,
    };

    const empleados_preoperativo: Array<EmpleadosPreoperativo> = [];

    this.estacionesesArray.controls.forEach((element: any) => {
      const lugar = element.get('nombre')?.value[0];

      (element.get('empleados') as FormArray).controls.forEach((element2: any) => {
        const cedula = element2.get('cedula').value;
        const hora_extra = !this.preoperativoForm.get("extra")?.value ? 0 : element2.get('hora_extra').value;

        const emp: EmpleadosPreoperativo = {
          cedula: cedula,
          horas_diarias: 8,
          horas_adicionales: parseInt(hora_extra),
          estacion: lugar
        };
        empleados_preoperativo.push(emp);
      });
    });

    await this.guardarRegistroPreoperativo(preoperativo, empleados_preoperativo);
  }
}
