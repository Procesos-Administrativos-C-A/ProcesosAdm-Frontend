import { CommonModule } from '@angular/common';
import { Component, OnInit, numberAttribute, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Preoperativo } from '../../../core/models/preoperativo.model';
import { BackendService } from '../../../core/services/backend.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus, faTrashCan, faCalendarDays  } from '@fortawesome/free-solid-svg-icons';
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

  // Definición del formulario reactivo 'preoperativoForm' con sus controles y validadores
  preoperativoForm: FormGroup = new FormGroup({
    lugar: new FormControl("",[Validators.required, Validators.nullValidator]) ,
    fecha: new FormControl("", [Validators.required]),
    turno: new FormControl("",[Validators.required, Validators.nullValidator]),
    festivo: new FormControl(false),
    extra: new FormControl(false),
    estaciones: new FormArray([])
  });

  // Obtiene el rol del usuario desde el local storage y lo convierte a número
  rol = Number(localStorage.getItem('rol'))

  // Objeto para almacenar los empleados
  empleados: any =  {};

  // Objeto para almacenar el preoperativo desde la base de datos
  preoperativoBd: any = {};

  // Declaracion de iconos para usar en la interfaz
  faCirclePlus = faCirclePlus;
  faTrashCan = faTrashCan;
  faCalendarDays = faCalendarDays;

  /**
   * Constructor de la clase
   * @param fb - FormBuilder para la creación de formularios
   * @param backendService - Servicio inyectado para realizar llamadas al backend
   */
  constructor(private fb: FormBuilder , private backendService: BackendService) {}

  /**
   * Método ngOnInit para inicializar el componente y cargar el ultimo preoperativo que la persona registro
   */
  ngOnInit(): void {
    // Obtiene la cédula del usuario desde el local storage
    const cedula = localStorage.getItem("cedula") || '0'
    // Llama al servicio para obtener el último preoperativo
    this.backendService.getUltimoPreoperativo( parseInt(cedula) )
      .subscribe({
      next: (preoperativo) => {
        this.preoperativoBd['preoperativo'] = preoperativo;
        this.asignarPreoperativo();
        this.asignarEmpleados();
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

  /**
   * Getter para obtener el FormArray 'estaciones' del formulario
   */
  get estacionesesArray() {
    return this.preoperativoForm.get('estaciones') as FormArray;
  }

  /**
   * Obtiene el FormArray 'empleados' de una estación específica
   * @param estacion - Índice de la estación
   * @returns FormArray de empleados
   */
  empleadosArray(estacion : number): FormArray {
    return this.estacionesesArray.at(estacion).get('empleados') as FormArray ;
  }

  /**
   * Asigna los valores del preoperativo obtenido de la base de datos al formulario
   */
  asignarPreoperativo(){
    
    if(this.preoperativoBd){
      this.preoperativoForm = new FormGroup({
        lugar: new FormControl(this.preoperativoBd.preoperativo.lugar,[Validators.required, Validators.nullValidator]) ,
        fecha: new FormControl({value: this.preoperativoBd.preoperativo.fecha,disabled: true},[Validators.required]),
        turno: new FormControl(this.preoperativoBd.preoperativo.turno,[Validators.required, Validators.nullValidator]),
        festivo: new FormControl(Boolean(this.preoperativoBd.preoperativo.festivo)),
        extra: new FormControl(Boolean(this.preoperativoBd.preoperativo.horas_extra)),
        estaciones: new FormArray([
          
        ])
      });
    }
  }

  /**
   * Asigna los empleados del preoperativo obtenido de la base de datos al formulario
   */
  asignarEmpleados(){
    if(this.preoperativoBd){
      let lineas: any[] = [];
      switch (this.preoperativoBd.preoperativo.lugar) {
        case 'Linea1':
          lineas = ['Fundadores','Betania','Cambulos'];
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

  /**
   * Obtiene los nombres de los empleados de un cargo específico desde el backend
   * @param cargo - El cargo para el que se desean obtener los empleados
   */
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
          Swal.fire({
            title: '¡Error!',
            text: 'No se pudieron cargar las personas con el cargo '+cargo +', por favor inténtelo nuevamenete.',
            icon: 'error',
            confirmButtonColor: '#002252',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  }

  /**
   * Guarda un registro preoperativo en el backend
   * @param preoperativo - Objeto de tipo Preoperativo que contiene los datos del preoperativo
   * @param empleados_preoperativo - Arreglo de objetos EmpleadosPreoperativo con los datos de los empleados
   */
  guardarRegistroPreoperativo(preoperativo : Preoperativo , empleados_preoperativo: Array<EmpleadosPreoperativo>) {
    const numero_registro = parseInt(localStorage.getItem('ultimo_registro') ?? '-1')
    this.backendService.actualizarPreoperativo(numero_registro, preoperativo, empleados_preoperativo)
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
            text: 'No se pudieron registrar los cambios en el preoperatorio, inténtelo nuevamenete.',
            icon: 'error',
            confirmButtonColor: '#002252',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    
  }

  /**
   * Actualiza las estaciones basadas en el valor seleccionado en el formulario
   * @param event - Evento de cambio del input
   */
  actualizarLinea(event: Event){
    const elementInput = event.target as HTMLInputElement;
    let lineas: any[] = [];

    switch (elementInput.value) {
      case 'Linea1':
        lineas = ['Fundadores','Betania','Cambulos'];
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

  /**
   * Asigna el cargo de un empleado y actualiza el formulario con los datos correspondientes
   * @param i - Índice de la estación
   * @param j - Índice del empleado
   * @param event - Evento de cambio del input
   */
  asignarCargoEmpleado(i : number, j: number, event : Event){
    const elementInput = event.target as HTMLInputElement;
    this.obtenerNombresEmpleados(elementInput.value);
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('hora_extra')?.setValue("0") ;
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('nombre')?.setValue("");
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('cargo')?.setValue(elementInput.value);
    
  }

  /**
   * Asigna el nombre de un empleado y actualiza el formulario con los datos correspondientes
   * @param cargo - Cargo del empleado
   * @param i - Índice de la estación
   * @param j - Índice del empleado
   * @param event - Evento de cambio del input
   */
  asignarNombreEmpleado(cargo : string ,i : number, j: number,event: Event){
    const elementInput = event.target as HTMLInputElement;
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('nombre')?.setValue(elementInput.value);
    const cedula: string = this.empleados[cargo].find((objeto: { nombre: any; }) => objeto.nombre === elementInput.value)['cedula'];
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('cedula')?.setValue(cedula);
  }

  /**
   * Asigna las horas extras de un empleado y actualiza el formulario
   * @param i - Índice de la estación
   * @param j - Índice del empleado
   * @param event - Evento de cambio del input
   */
  asignarHorasEmpleado(i : number, j: number,event: Event){
    const elementInput = event.target as HTMLInputElement;
    (this.estacionesesArray.at(i).get('empleados') as FormArray).at(j).get('hora_extra')?.setValue(elementInput.value) ;
  }
  
  /**
   * Agrega un nuevo empleado al formulario de una estación específica
   * @param estacionEmp - Nombre de la estación a la que se va a agregar el empleado
   */
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

  /**
   * Elimina un empleado del formulario
   * @param i - Índice de la estación
   * @param j - Índice del empleado
   */
  eliminarEmpleado(i : number, j: number) {
    (this.estacionesesArray.at(i).get('empleados') as FormArray).removeAt(j);
  }

  /**
   * Guarda la información del preoperativo y los empleados en el backend
   */
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

    this.guardarRegistroPreoperativo(preoperativo  , empleados_preoperativo)

  }
  

}
