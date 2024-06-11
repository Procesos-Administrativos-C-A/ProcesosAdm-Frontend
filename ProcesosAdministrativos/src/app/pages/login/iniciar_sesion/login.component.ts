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

  //Declaracion de iconos
  faUser = faAddressCard;
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  faSpinner = faSpinner;

  //Declaracion de señales para el control de elementos visuales
  menu_recuperacion = signal(false);
  ver_contrasena = signal(false);
  icono_carga = signal(false);
  mensaje_error = signal(false);

  //Formulario del usuario para el inicio de sesion
  usuarioForm = new FormGroup({
    cedula: new FormControl("",[Validators.required,Validators.nullValidator,Validators.minLength(6),Validators.maxLength(13)]),
    contrasena: new FormControl("",[Validators.required,Validators.nullValidator])
  });

  //Formulario del usuario para la recuperacion de la contraseña
  cedulaRecForm = new FormControl("",[Validators.required,Validators.nullValidator,Validators.minLength(6),Validators.maxLength(13)]);

  // Constructor para inyectar el servicio BackendService
  constructor(private router: Router , private backendService: BackendService) { }

  /**
    * Alterna el estado del menú de recuperación.
    * Si el menú está actualmente visible, lo oculta, y viceversa.
    */
  cambiarMenu(): void {
    this.menu_recuperacion.set(!this.menu_recuperacion()) ;
  }

  /**
    * Alterna la visibilidad del menu de recuperar contraseña.
    * Si la contraseña está oculta, la muestra, y viceversa.
    */
  verContrasena(): void {
    this.ver_contrasena.set(!this.ver_contrasena()) ;
  }
  
  /**
   * Inicia sesión con la cedula de usuario y la contraseña proporcionados.
   * @param cedula - La cedula del usuario.
   * @param contrasena - La contraseña del usuario.
   */
  iniciarSesion(cedula : string , contrasena : string) {
    this.backendService.ingresar(cedula,contrasena)
      .subscribe({
        next: (credenciales : any) => {
          localStorage.setItem('token',credenciales.access_token)
          this.obtenerInformacion();
        },
        error: (error) => {
          this.icono_carga.set(false);
          this.mensaje_error.set(true);
        }
      });
  }

  /**
   * Obtiene la información del usuario después de iniciar sesión.
   * La información se obtiene desde el backend y se almacena en el local storage.
   */
  obtenerInformacion() {
    this.backendService.getInformacion()
      .subscribe({
        next: (credenciales) => {
          localStorage.setItem('nombre',credenciales.nombre)
          localStorage.setItem('apellidos',credenciales.apellidos)
          localStorage.setItem('cedula',credenciales.cedula)
          localStorage.setItem('rol',credenciales.rol)
          this.router.navigate(['/Home']);
          this.icono_carga.set(false);
        },
        error: (error) => {
          this.icono_carga.set(false);
          this.mensaje_error.set(true);
        }
      });
  }

  /**
   * Envía la solicitud de inicio de sesión.
   * Activa el icono de carga y oculta el mensaje de error, luego inicia la sesión con los valores del formulario.
   */
  enviarInicioSesion(): void {
    this.icono_carga.set(true);
    this.mensaje_error.set(false);
    this.iniciarSesion(this.usuarioForm.value.cedula!.toString(),this.usuarioForm.value.contrasena!)
    
  }
}
