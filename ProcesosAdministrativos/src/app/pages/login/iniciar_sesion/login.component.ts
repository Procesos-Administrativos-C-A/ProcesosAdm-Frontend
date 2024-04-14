import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendService } from '../../../core/services/backend.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credenciales: any =  {};
  constructor(private router: Router , private backendService: BackendService) { }
  
  iniciarSesion(username : string , password : string) {
    this.backendService.ingresar(username,password)
      .subscribe({
        next: (credenciales) => {
          this.credenciales = credenciales
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
          environment.nombre = credenciales.nombre
          environment.cedula = credenciales.cedula
          environment.rol = credenciales.rol
          console.log(environment)
          this.router.navigate(['/Preoperativos']);
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
