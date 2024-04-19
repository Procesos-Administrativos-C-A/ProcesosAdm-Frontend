import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Preoperativo} from '../../../core/models/preoperativo.model';
import {EmpleadosPreoperativo} from '../../../core/models/empleados_preoperativo.model';
import { FormArray, FormBuilder, FormsModule } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendService } from '../../../core/services/backend.service';
import { environment } from '../../../../environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUser, faCircleXmark  } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-preoperativos',
  standalone: true,
  imports: [CommonModule, FormsModule,FontAwesomeModule,ReactiveFormsModule],
  templateUrl: './preoperativos.component.html',
  styleUrl: './preoperativos.component.css'
})
export class PreoperativosComponent implements OnInit {
  
  faCircleXmark = faCircleXmark;
  faCircleUser = faCircleUser;
  faBars = faBars;

  preoperativoForm: FormGroup = new FormGroup({
    lugar: new FormControl("",[Validators.required, Validators.nullValidator]) ,
    fecha: new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
    turno: new FormControl("",[Validators.required, Validators.nullValidator]),
    festivo: new FormControl(false),
    extra: new FormControl(false),
    estaciones: new FormArray([])
  });

  fecha_hoy = '';

  empleados: any =  {};

  constructor(private fb: FormBuilder , private backendService: BackendService) {}

  ngOnInit(): void {

    this.obtenerNombresEmpleados('Operador')
    
    this.fecha_hoy = new Date().toISOString().substring(0, 10);
  }
  

  get estacionesesArray() {
    return this.preoperativoForm.get('estaciones') as FormArray;
  }
  nombre = environment.nombre
  empleadosArray(estacion : number): FormArray {
    return this.estacionesesArray.at(estacion).get('empleados') as FormArray ;
    
  }

  obtenerNombresEmpleados(cargo: string) {
    if(cargo in this.empleados){
      return
    }
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

  guardarRegistroPreoperativo(preoperativo : Preoperativo , empleados_preoperativo: Array<EmpleadosPreoperativo>) {
    this.backendService.crearPreoperativo(preoperativo, empleados_preoperativo)
      .subscribe(
        (preoperativoInsertado) => {
          console.log('Registro preoperativo insertado:', preoperativoInsertado.id);
          Swal.fire({
            title: '¡Guardado!',
            text: 'El preoperativo se ha almacenado correctamente.',
            icon: 'success',
            confirmButtonColor: '#002252',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            environment.preoperativoId= preoperativoInsertado.id
            window.location.reload();
          });
          
        },
        (error) => {
          console.error('Error al insertar registro preoperativo:', error);
          Swal.fire({
            title: '¡Error!',
            text: 'No se pudo registrar el preoperativo, intente nuevamenete.',
            icon: 'error',
            confirmButtonColor: '#002252',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    
  }

  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  dropdown_menu = signal(false);
  

  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos()) ;
  }

  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites()) ;
  }

  dropDownMenu(): void {
    this.dropdown_menu.set(!this.dropdown_menu()) ;
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
            cedula: new FormControl ('',[Validators.required, Validators.nullValidator]),
          }),
          new FormGroup({
            hora_extra: new FormControl('0',[Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
            cargo: new FormControl('Operador',[Validators.required, Validators.nullValidator]),
            nombre: new FormControl ('',[Validators.required, Validators.nullValidator]),
            cedula: new FormControl ('',[Validators.required, Validators.nullValidator]),
          }),
          new FormGroup({
            hora_extra: new FormControl('0',[Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
            cargo: new FormControl('Operador',[Validators.required, Validators.nullValidator]),
            nombre: new FormControl ('',[Validators.required, Validators.nullValidator]),
            cedula: new FormControl ('',[Validators.required, Validators.nullValidator]),
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

  asignarNombreEmpleado(cargo : string , i : number, j: number,event: Event){
    const elementInput = event.target as HTMLInputElement;
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('nombre')?.setValue(elementInput.value);
    const cedula: string = this.empleados[cargo].find((objeto: { nombre: any; }) => objeto.nombre === elementInput.value)['cedula'];
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('cedula')?.setValue(cedula);
  }

  asignarHorasEmpleado(i : number, j: number,event: Event){
    const elementInput = event.target as HTMLInputElement;
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('hora_extra')?.setValue(elementInput.value) ;
  }
  
  agregarEmpleado(estacionEmp : string) {
    const empleadoFormGroup = new FormGroup({
      hora_extra: new FormControl ('0',[Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
      cargo: new FormControl ('Operador',[Validators.required, Validators.nullValidator]),
      nombre: new FormControl ('',[Validators.required, Validators.nullValidator]),
      cedula: new FormControl ('',[Validators.required, Validators.nullValidator]),
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

  eliminarEmpleado(i : number, j: number) {
    (this.estacionesesArray.at(i).get('empleados') as FormArray).removeAt(j);
  }

  guardarInformacion(){
    const preoperativo: Preoperativo ={
      fecha: this.preoperativoForm.get("fecha")?.value,
      encargado: environment.nombre + " - " + environment.cedula,
      turno: this.preoperativoForm.get("turno")?.value,
      lugar: this.preoperativoForm.get("lugar")?.value,
      festivo: this.preoperativoForm.get("festivo")?.value
    }
    
    const empleados_preoperativo : Array<EmpleadosPreoperativo> = [

    ]

    this.estacionesesArray.controls.forEach((element: any) => {
      const lugar = element.get('nombre')?.value[0];

      (element.get('empleados') as FormArray).controls.forEach((element2: any) => {
        
        const cedula = element2.get('cedula').value
        const hora_extra = !this.preoperativoForm.get("extra")?.value ? 0 : element2.get('hora_extra').value ;
        
        const emp : EmpleadosPreoperativo = {
          cedula: cedula,
          horas_diarias: 8,
          horas_adicionales:parseInt(hora_extra),
          estacion: lugar
        }
        empleados_preoperativo.push(emp);
      })
      
    });

    console.log(preoperativo)
    console.log(empleados_preoperativo)
    console.log(this.preoperativoForm.valid)
    console.log(this.preoperativoForm.value)

    this.guardarRegistroPreoperativo(preoperativo  , empleados_preoperativo)

  }

}
