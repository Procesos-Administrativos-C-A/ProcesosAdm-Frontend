import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendService } from '../../../core/services/backend.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEyeSlash, faAddressCard,  } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  faUser = faAddressCard;
  faLock = faEyeSlash;
  credenciales: any =  {};
  constructor(private router: Router , private backendService: BackendService) { }
  
  iniciarSesion(username : string , password : string) {
    this.backendService.ingresar(username,password)
      .subscribe({
        next: (credenciales) => {
          this.credenciales = credenciales
          localStorage.setItem('token',this.credenciales.access_token)
          environment.token = this.credenciales.access_token
          this.obtenerInformacion();
        },
        error: (error) => {
          console.error('Error al obtener los nombres de empleados:', error);
        }
      });
  }

  obtenerInformacion() {
    this.backendService.getInformacion()
      .subscribe({
        next: (credenciales) => {
          localStorage.setItem('nombre',credenciales.nombre)
          localStorage.setItem('cedula',credenciales.cedula)
          localStorage.setItem('rol',credenciales.rol)
          environment.nombre = credenciales.nombre
          environment.cedula = credenciales.cedula
          environment.rol = credenciales.rol
          console.log(localStorage)
          if(credenciales.rol === 2){
            this.router.navigate(['/Reportes']);
          }else{
            this.router.navigate(['/Preoperativos']);
          }
          
        },
        error: (error) => {
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

  menuRecuperacion = signal(false);

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
    this.menuRecuperacion.set(!this.menuRecuperacion()) ;
    console.log(this.menuRecuperacion());
  }

  enviarInicioSesion(): void {
    console.log(this.usuarioForm.value);
    this.iniciarSesion(this.usuarioForm.value.cedula!.toString(),this.usuarioForm.value.contrasena!)
  }
}
