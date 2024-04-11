import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Preoperativo } from '../../../core/models/preoperativo.model';
import { BackendService } from '../../../core/services/backend.service';
import { Empleado } from '../../../core/models/empleados.model';
import { EmpleadosPreoperativo } from '../../../core/models/empleados_preoperativo.model';

@Component({
  selector: 'app-editar-preoperativo',
  standalone: true,
  imports: [CommonModule, FormsModule,FontAwesomeModule,ReactiveFormsModule],
  templateUrl: './editar-preoperativo.component.html',
  styleUrl: './editar-preoperativo.component.css'
})
export class EditarPreoperativoComponent implements OnInit {

  preoperativo: Preoperativo | null = null;
  preoperativoForm!: FormGroup;
  fecha_hoy = '';
  empleados: any =  {

  };

  constructor(private fb: FormBuilder , private backendService: BackendService) { }

  ngOnInit(): void {
    const preoperativoX: Preoperativo = {
      fecha: "2024-04-12",
      encargado: "Juan Pérez",
      turno: "Noche",
      lugar: "Mantenimiento",
      festivo: true
    };

    const empleadosXpreop: Array<EmpleadosPreoperativo> = [
      {
        cedula: "123456874",
        horas_diarias: 8,
        horas_adicionales: 0,
        estacion: "Mantenimiento"
      },
      {
        cedula: "123565525",
        horas_diarias: 8,
        horas_adicionales: 1,
        estacion: "Mantenimiento"
      }
    ]
    
    this.preoperativoForm = new FormGroup({
      lugar: new FormControl(preoperativoX.lugar,[Validators.required, Validators.nullValidator]) ,
      fecha: new FormControl(preoperativoX.fecha, [Validators.required]),
      turno: new FormControl(preoperativoX.turno,[Validators.required, Validators.nullValidator]),
      festivo: new FormControl(preoperativoX.festivo),
      extra: new FormControl(false),
      estaciones: new FormArray([
        
      ])
    });

    this.obtenerNombresEmpleados('Operador')
    
    this.fecha_hoy = new Date().toISOString().substring(0, 10);
  }
  

  get estacionesesArray() {
    return this.preoperativoForm.get('estaciones') as FormArray;
  }
  empleadosArray(estacion : number): FormArray {
    return this.estacionesesArray.at(estacion).get('empleados') as FormArray ;
    
  }

  selectRequiredValidator(control: FormControl): { [key: string]: any } | null {
    console.log(control.value)
    if (control.value === '' || control.value === null ) {
      return { 'requiredSelect': true }; // Custom error key
    }
    return null;
  }


  obtenerNombresEmpleados(cargo: string) {
    this.backendService.getObtenerNombresEmpleadosCargo(cargo)
      .subscribe({
        next: (empleados) => {

          this.empleados[cargo] = empleados;
          
        },
        error: (error) => {
          console.error('Error al obtener los nombres de empleados:', error);
        }
      });
  }

  /*
  onSubmit() {
    if (this.preoperativoForm.valid) {
      const preoperativo: Preoperativo = this.preoperativoForm.get('preoperativo')?.value;
      const empleadosPreoperativos: EmpleadoPreoperativo[] = this.getEmpleadosPreoperativos();

      this.backendService.crearPreoperativo(preoperativo, empleadosPreoperativos)
        .subscribe(
          (preoperativoInsertado) => {
            console.log('Registro preoperativo insertado:', preoperativoInsertado);
            // Realiza cualquier otra acción necesaria
          },
          (error) => {
            console.error('Error al insertar registro preoperativo:', error);
            // Maneja el error según sea necesario
          }
        );
    }
  }

  ngOnInit(): void {
    // Obtener un registro de preoperativo por su ID
    const idPreoperativo = 1; // Reemplaza con el ID deseado
    this.backendService.getPreoperativoPorId(idPreoperativo).subscribe(
      (preoperativo) => {
        this.preoperativo = preoperativo;
        this.empleadosPreoperativos = preoperativo.empleados_preoperativos;
      },
      (error) => {
        console.error('Error al obtener el registro de preoperativo:', error);
      }
    );
  }

  actualizarPreoperativo(): void {
    if (this.preoperativo) {
      const idPreoperativo = this.preoperativo.id;
      this.backendService.actualizarPreoperativo(idPreoperativo, this.preoperativo, this.empleadosPreoperativos).subscribe(
        (preoperativoActualizado) => {
          console.log('Registro de preoperativo actualizado:', preoperativoActualizado);
          // Realiza cualquier otra acción necesaria después de actualizar el registro
        },
        (error) => {
          console.error('Error al actualizar el registro de preoperativo:', error);
        }
      );
    }
  }
  
*/
  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  

  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos()) ;
  }

  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites()) ;
  }




  actualizarLinea(event: Event){
    const elementInput = event.target as HTMLInputElement;
    let lineas: any[] = [];

    switch (elementInput.value) {
      case 'Linea1':
        lineas = ['Cambulos','Betania','Fundadores'];
        break;
      case 'Linea2':
        lineas = ['Villamaria + S.A.V','Villamaria + S.U.V'];
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
            hora_extra: new FormControl('0',[Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
            cargo: new FormControl('Operador',[Validators.required, Validators.nullValidator]),
            nombre: new FormControl ('',[Validators.required, Validators.nullValidator]),
          }),
          new FormGroup({
            hora_extra: new FormControl('0',[Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
            cargo: new FormControl('Operador',[Validators.required, Validators.nullValidator]),
            nombre: new FormControl ('',[Validators.required, Validators.nullValidator]),
          }),
          new FormGroup({
            hora_extra: new FormControl('0',[Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
            cargo: new FormControl('Operador',[Validators.required, Validators.nullValidator]),
            nombre: new FormControl ('',[Validators.required, Validators.nullValidator]),
          })
        ]) 
      })

      estacion.push(insertable)

    });
      
  }

  asignarCargoEmpleado(i : number, j: number, event : Event){
    const elementInput = event.target as HTMLInputElement;
    this.obtenerNombresEmpleados(elementInput.value);
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('hora_extra')?.setValue("0") ;
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('nombre')?.setValue("");
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('cargo')?.setValue(elementInput.value);
    
  }

  asignarNombreEmpleado(i : number, j: number,event: Event){
    const elementInput = event.target as HTMLInputElement;
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('nombre')?.setValue(elementInput.value);
  }

  asignarHorasEmpleado(i : number, j: number,event: Event){
    const elementInput = event.target as HTMLInputElement;
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('hora_extra')?.setValue(elementInput.value) ;
  }
  
  agregarEmpleado(estacion : string) {
    const empleadoFormGroup = new FormGroup({
      hora_extra: new FormControl ('0',[Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
      cargo: new FormControl ('',[Validators.required, Validators.nullValidator]),
      nombre: new FormControl (['',Validators.required, Validators.nullValidator]),
      cedula: new FormControl (['']),
    });
    const empleado = this.preoperativoForm.get('estaciones') as FormArray;
    for (const empleados of empleado.controls) {
      console.log(empleados.get('nombre')?.value[0]);
      if (empleados.get('nombre')?.value[0] === estacion) {
        const evn = empleados.get('empleados') as FormArray;
        evn.push(empleadoFormGroup);
        console.log('ingerido');
      }
    }
    
  }

  eliminarEmpleado(i : number, j: number) {
    (this.estacionesesArray.at(i).get('empleados') as FormArray).removeAt(j);
  }

  mostrarInfon(){
    console.log(this.preoperativoForm.valid)
    console.log(this.preoperativoForm.value)
  }
  

}
