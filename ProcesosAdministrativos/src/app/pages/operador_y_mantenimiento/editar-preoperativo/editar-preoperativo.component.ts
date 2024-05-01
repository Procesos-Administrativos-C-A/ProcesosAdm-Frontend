import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Preoperativo } from '../../../core/models/preoperativo.model';
import { BackendService } from '../../../core/services/backend.service';
import { Empleado } from '../../../core/models/empleados.model';
import { environment } from '../../../../environments/environment';
import { EmpleadosPreoperativo } from '../../../core/models/empleados_preoperativo.model';
import Swal from 'sweetalert2';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";

@Component({
    selector: 'app-editar-preoperativo',
    standalone: true,
    templateUrl: './editar-preoperativo.component.html',
    styleUrl: './editar-preoperativo.component.css',
    imports: [CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule, NavbarComponent]
})
export class EditarPreoperativoComponent implements OnInit {

  preoperativoForm: FormGroup = new FormGroup({
    lugar: new FormControl("",[Validators.required, Validators.nullValidator]) ,
    fecha: new FormControl("", [Validators.required]),
    turno: new FormControl("",[Validators.required, Validators.nullValidator]),
    festivo: new FormControl(false),
    extra: new FormControl(false),
    estaciones: new FormArray([])
  });

  empleados: any =  {};

  preoperativoBd: any = {};
  

  constructor(private fb: FormBuilder , private backendService: BackendService) {}

  ngOnInit(): void {
    const numero_registro = parseInt(localStorage.getItem('ultimo_registro') ?? '-1')
    console.log(numero_registro)
    this.backendService.getPreoperativoPorId(numero_registro)
      .subscribe({
        next: (preoperativo) => {
          const preoperative : Preoperativo = {
            fecha: preoperativo.fecha,
            encargado: preoperativo.encargado,
            turno: preoperativo.turno,
            lugar: preoperativo.lugar,
            festivo: preoperativo.festivo,
          }
          this.preoperativoBd['preoperativo'] = preoperativo;
          this.asignarPreoperativo();
          this.asignarEmpleados();
        },
        error: (error) => {
          console.error('Error al obtener los nombres de empleados:', error);
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
  empleadosArray(estacion : number): FormArray {
    return this.estacionesesArray.at(estacion).get('empleados') as FormArray ;
    
  }

 
  asignarPreoperativo(){
    
    if(this.preoperativoBd){
      this.preoperativoForm = new FormGroup({
        lugar: new FormControl(this.preoperativoBd.preoperativo.lugar,[Validators.required, Validators.nullValidator]) ,
        fecha: new FormControl(this.preoperativoBd.preoperativo.fecha, [Validators.required]),
        turno: new FormControl(this.preoperativoBd.preoperativo.turno,[Validators.required, Validators.nullValidator]),
        festivo: new FormControl(Boolean(this.preoperativoBd.preoperativo.festivo)),
        extra: new FormControl(Boolean(this.preoperativoBd.preoperativo.horas_extra)),
        estaciones: new FormArray([
          
        ])
      });
    }

  }

  asignarEmpleados(){
    if(this.preoperativoBd){
      let lineas: any[] = [];
      switch (this.preoperativoBd.preoperativo.lugar) {
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
      const empleados: FormArray<any>  = new FormArray<any>  ([]);
      this.preoperativoBd.preoperativo.empleados_preoperativos.forEach((element2:any) => {
         if(element2.estacion == element){
          this.obtenerNombresEmpleados(element2.cargo)
          empleados.push(
            new FormGroup({
              hora_extra: new FormControl(element2.horas_adicionales.toString(),[Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
              cargo: new FormControl(element2.cargo,[Validators.required, Validators.nullValidator]),
              nombre: new FormControl (element2.nombre + ' '+ element2.apellidos,[Validators.required, Validators.nullValidator]),
              cedula: new FormControl (element2.cedula,[Validators.required, Validators.nullValidator]),
            })
          )
         }
      });
      
      const insertable = new FormGroup({
        nombre: new FormControl([element, [Validators.required]]),
        empleados: empleados
      })
      estacion.push(insertable)

    });
    }
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
    const numero_registro = parseInt(localStorage.getItem('ultimo_registro') ?? '-1')
    console.log(preoperativo)
    console.log(empleados_preoperativo)
    this.backendService.actualizarPreoperativo(numero_registro, preoperativo, empleados_preoperativo)
      .subscribe(
        (preoperativoInsertado) => {
          console.log('Registro preoperativo insertado:', preoperativoInsertado);
          Swal.fire({
            title: '¡Guardado!',
            text: 'Los cambios hechos al preoperativo se ha almacenado correctamente.',
            icon: 'success',
            confirmButtonColor: '#002252',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            
            window.location.reload();
          });
          
        },
        (error) => {
          console.error('Error al insertar registro preoperativo:', error);
          Swal.fire({
            title: '¡Error!',
            text: 'No se pudieron registrar los cambios al preoperativo, intente nuevamenete.',
            icon: 'error',
            confirmButtonColor: '#002252',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    
  }
  
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
            cargo: new FormControl('OPERADOR',[Validators.required, Validators.nullValidator]),
            nombre: new FormControl ('',[Validators.required, Validators.nullValidator]),
            cedula: new FormControl ('',[Validators.required, Validators.nullValidator]),
          }),
          new FormGroup({
            hora_extra: new FormControl('0',[Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
            cargo: new FormControl('OPERADOR',[Validators.required, Validators.nullValidator]),
            nombre: new FormControl ('',[Validators.required, Validators.nullValidator]),
            cedula: new FormControl ('',[Validators.required, Validators.nullValidator]),
          }),
          new FormGroup({
            hora_extra: new FormControl('0',[Validators.pattern(/^[0-9]$/),Validators.maxLength(1)]),
            cargo: new FormControl('OPERADOR',[Validators.required, Validators.nullValidator]),
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

  asignarNombreEmpleado(cargo : string ,i : number, j: number,event: Event){
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
      cargo: new FormControl ('OPERADOR',[Validators.required, Validators.nullValidator]),
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
      encargado: this.preoperativoBd.preoperativo.encargado,
      turno: this.preoperativoForm.get("turno")?.value,
      lugar: this.preoperativoForm.get("lugar")?.value,
      festivo: this.preoperativoForm.get("festivo")?.value,
      horas_extra: this.preoperativoForm.get("extra")?.value,
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
