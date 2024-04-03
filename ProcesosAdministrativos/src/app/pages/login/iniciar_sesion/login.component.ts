import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

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
    console.log(this.usuarioForm.value)
  }
}
