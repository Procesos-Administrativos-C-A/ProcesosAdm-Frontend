import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BackendService } from '../../../core/services/backend.service';
import { FormArray, FormBuilder, FormsModule } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, NavbarComponent],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})
export class CrearUsuarioComponent implements OnInit {

  ususarioForm: FormGroup = new FormGroup({
    cedula: new FormControl("",[Validators.required,Validators.nullValidator,Validators.minLength(6),Validators.maxLength(13)]),
    nombre: new FormControl("",[Validators.required,Validators.nullValidator]),
    apellido: new FormControl("",[Validators.required,Validators.nullValidator]),
    rol: new FormControl("",[Validators.required,Validators.nullValidator]),
    rolEsp: new FormControl("",[Validators.minLength(3),Validators.maxLength(30)]),
    cargo: new FormControl("",[Validators.required,Validators.nullValidator]),
    email: new FormControl("",[Validators.required,Validators.nullValidator]),
    contrasena: new FormControl("",[Validators.required,Validators.nullValidator]),
  });

  rol = Number(localStorage.getItem('rol'))

  otro_cargo = signal(false);

  constructor( private backendService: BackendService) {}
  
  ngOnInit(): void {
    
    
 
  }
  
  guardarUsuario( empleado : Usuario){
    this.backendService.crearEmpleado(empleado)
    .subscribe({
      next: (empleados) => {
        Swal.fire({
          title: '¡Guardado!',
          text: 'Los datos del usuario se han registrado con exito',
          icon: 'success',
          confirmButtonColor: '#002252',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          
          window.location.reload();
        });
      },
      error: (error) => {
        Swal.fire({
          title: '¡Error!',
          text: 'No se pudieron registrar el usuario, inténtelo nuevamenete.',
          icon: 'error',
          confirmButtonColor: '#002252',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al obtener los nombres de empleados:', error);
      }
    });
  }
  

  actualizarCargo(event: Event){
    const elementInput = event.target as HTMLInputElement;
     
    if(elementInput.value == 'Otro'){
      this.otro_cargo.set(true)
    }else{
      this.otro_cargo.set(false)
    }
  }


  crearUsuario(){
     
     
    const empleado: Usuario ={
      cedula: this.ususarioForm.get("cedula")?.value,
      nombre: this.ususarioForm.get("nombre")?.value.toUpperCase(),
      apellidos: this.ususarioForm.get("apellido")?.value.toUpperCase(),
      rol: Number(this.ususarioForm.get("rol")?.value),
      cargo: this.otro_cargo() ?  this.ususarioForm.get("rolEsp")?.value :this.ususarioForm.get("cargo")?.value,
      email: this.ususarioForm.get("email")?.value,
      contraseña:this.ususarioForm.get("contrasena")?.value,
    }

    this.guardarUsuario(empleado)
    
    console.log(this.ususarioForm.value)
    console.log(empleado)
  }

}
