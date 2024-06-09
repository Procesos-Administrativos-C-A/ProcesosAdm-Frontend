import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendService } from '../../../core/services/backend.service';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEyeSlash, faAddressCard, faEye  } from '@fortawesome/free-regular-svg-icons';
import { faL, faSpinner  } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  faUser = faAddressCard;
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  faSpinner = faSpinner;

  credenciales: any =  {};

  menu_recuperacion = signal(false);
  ver_contrasena = signal(false);
  icono_carga = signal(false);
  mensaje_error = signal(false);


  constructor(private router: Router , private backendService: BackendService) { }

  
  iniciarSesion(username : string , password : string) {
    this.backendService.ingresar(username,password)
      .subscribe({
        next: (credenciales) => {
          this.credenciales = credenciales
          localStorage.setItem('token',this.credenciales.access_token)
          this.obtenerInformacion();
        },
        error: (error) => {
          console.error('Error al obtener los nombres de empleados:', error);
          this.icono_carga.set(false);
          this.mensaje_error.set(true);
        }
      });
  }

  obtenerInformacion() {
    this.backendService.getInformacion()
      .subscribe({
        next: (credenciales) => {
          localStorage.setItem('nombre',credenciales.nombre)
          localStorage.setItem('apellidos',credenciales.apellidos)
          localStorage.setItem('cedula',credenciales.cedula)
          localStorage.setItem('rol',credenciales.rol)
          console.log(localStorage)
          
          this.router.navigate(['/Home']);
          
          this.icono_carga.set(false);
        },
        error: (error) => {
          this.icono_carga.set(false);
          this.mensaje_error.set(true);
          console.error('Error al obtener los nombres de empleados:', error);
          
        }
      });
  }


  usuarioForm = new FormGroup({
    cedula: new FormControl("",[Validators.required,Validators.nullValidator,Validators.minLength(6),
      Validators.maxLength(13)]),
    contrasena: new FormControl("",[Validators.required,Validators.nullValidator])
    // , Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[a-z]).{10,}$')
  });

  cedulaRecForm = new FormControl("",[Validators.required,Validators.nullValidator,Validators.minLength(6),
    Validators.maxLength(13)]);

  
  /*
  constructor(){
    this.usuarioForm = new FormGroup({
      cedula: new FormControl("",[Validators.required,Validators.nullValidator,Validators.minLength(6),
        Validators.maxLength(13)]),
      contrasena: new FormControl("",[Validators.required,Validators.nullValidator,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[a-z]).{10,}$')])
    })
    this.cedulaRecForm = new FormControl("",[Validators.required,Validators.nullValidator,Validators.minLength(6),
      Validators.maxLength(13)])
  }
  */

  cambiarMenu(): void {
    this.menu_recuperacion.set(!this.menu_recuperacion()) ;
    console.log(this.menu_recuperacion());
  }
  verContrasena(): void {
    this.ver_contrasena.set(!this.ver_contrasena()) ;
  }

  enviarInicioSesion(): void {
    this.icono_carga.set(true);
    this.mensaje_error.set(false);
    console.log(this.usuarioForm.value);
    this.iniciarSesion(this.usuarioForm.value.cedula!.toString(),this.usuarioForm.value.contrasena!)
    
  }
}
