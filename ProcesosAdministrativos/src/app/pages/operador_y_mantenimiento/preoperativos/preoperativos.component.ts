import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Preoperativo} from '../../../core/models/preoperativo.model';
import {EmpleadosPreoperativo} from '../../../core/models/empleados_preoperativo.model';
import { FormArray, FormBuilder, FormsModule } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Empleado } from '../../../core/models/empleados.model';
import { BackendService } from '../../../core/services/backend.service';



@Component({
  selector: 'app-preoperativos',
  standalone: true,
  imports: [CommonModule, FormsModule,FontAwesomeModule,ReactiveFormsModule],
  templateUrl: './preoperativos.component.html',
  styleUrl: './preoperativos.component.css'
})
export class PreoperativosComponent implements OnInit {
  preoperativo: Preoperativo | null = null;
  empleadosPreoperativos: EmpleadosPreoperativo[] = [];
  empleados: Empleado[] = [];


  preoperativoForm!: FormGroup;
  fecha_hoy = '';
  constructor(private fb: FormBuilder , private backendService: BackendService) { }

  ngOnInit(): void {

    this.preoperativoForm = new FormGroup({
      lugar: new FormControl([[Validators.required, Validators.minLength(6), Validators.maxLength(13)]]) ,
      fecha: new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
      turno: new FormControl(["", [Validators.required]]),
      festivo: new FormControl(false),
      extra: new FormControl(false),
      estaciones: new FormArray([
        
      ])
    });
    
    this.fecha_hoy = new Date().toISOString().substring(0, 10);
  }
  

  get estacionesesArray() {
    return this.preoperativoForm.get('estaciones') as FormArray;
  }
  empleadosArray(estacion : number): FormArray {
    return this.estacionesesArray.at(estacion).get('empleados') as FormArray ;
    
  }

/*
  obtenerNombresEmpleados(cargo: string) {
    this.backendService.getObtenerNombresEmpleadosCargo(cargo)
      .subscribe({
        next: (empleados) => {
          this.empleados = empleados;
        },
        error: (error) => {
          console.error('Error al obtener los nombres de empleados:', error);
        }
      });
  }
  
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
  
  


  
  eliminarEmpleado(index: number) {
    //(this.preoperativoForm.get('empleados') as FormArray).removeAt(index);
  }


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
            hora_extra: new FormControl(['0', Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
            puesto: new FormControl(['', Validators.required, Validators.nullValidator]),
            nombre: new FormControl (['', Validators.required, Validators.nullValidator]),
          }),
          new FormGroup({
            hora_extra: new FormControl(['0', Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
            puesto: new FormControl(['', Validators.required, Validators.nullValidator]),
            nombre: new FormControl (['', Validators.required, Validators.nullValidator]),
          }),
          new FormGroup({
            hora_extra: new FormControl(['0', Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
            puesto: new FormControl(['', Validators.required, Validators.nullValidator]),
            nombre: new FormControl (['', Validators.required, Validators.nullValidator]),
          })
        ]) 
      })

      estacion.push(insertable)

    });
      
  }


  
  agregarEmpleado() {
    const empleadoFormGroup = new FormGroup({
      hora_extra: new FormControl (['0', Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
      puesto: new FormControl (['', Validators.required, Validators.nullValidator]),
      nombre: new FormControl (['', Validators.required, Validators.nullValidator]),
      cedula: new FormControl (['']),
    });
    const empleado = this.preoperativoForm.get('estaciones') as FormArray;
    for (const empleados of empleado.controls) {
      console.log(empleados.get('nombre')?.value[0]);
      if (empleados.get('nombre')?.value[0] === "Cambulos") {
        const evn = empleados.get('empleados') as FormArray;
        evn.push(empleadoFormGroup);
        console.log('ingerido');
      }
    }
    
    console.log(empleado)
    //console.log(this.preoperativoForm.get('estaciones') as FormArray)
    /*
    const estacionesArray = this.preoperativoForm.get('estaciones') as FormArray;
    const mantenimientoArray = estacionesArray.at(estacionesIndex).get('mantenimiento') as FormArray;
    mantenimientoArray.push(empleadoFormGroup);

    (this.preoperativoForm.get('empleados') as FormArray).push(empleadoFormGroup); */
  }


  mostrarInfon(){
    console.log(this.preoperativoForm.value)
  }

}
