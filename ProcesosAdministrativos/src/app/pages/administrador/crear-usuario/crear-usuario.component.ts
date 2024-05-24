import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BackendService } from '../../../core/services/backend.service';
import { FormArray, FormBuilder, FormsModule } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
    cargo: new FormControl("",[Validators.required,Validators.nullValidator]),
    email: new FormControl("",[Validators.required,Validators.nullValidator]),
    contrasena: new FormControl("",[Validators.required,Validators.nullValidator]),
  });
  

  constructor( private backendService: BackendService) {}
  
  ngOnInit(): void {
    
    
 
  }


  crearUsuario(){

  }

}
