import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Preoperativo} from '../../../core/models/preoperativo.model';
import {EmpleadosPreoperativo} from '../../../core/models/empleados_preoperativo.model';
import { FormArray, FormBuilder, FormsModule } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-preoperativos',
  standalone: true,
  imports: [CommonModule, FormsModule,FontAwesomeModule,ReactiveFormsModule],
  templateUrl: './preoperativos.component.html',
  styleUrl: './preoperativos.component.css'
})
export class PreoperativosComponent implements OnInit {

  preoperativoForm!: FormGroup;
  fecha_hoy = '';
  constructor(private fb: FormBuilder) { }

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
