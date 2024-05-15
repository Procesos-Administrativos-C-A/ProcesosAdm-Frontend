import { Component, signal } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-solicitud-cl',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './solicitud-cl.component.html',
  styleUrl: './solicitud-cl.component.css'
})
export class SolicitudCLComponent {
  

  // Función para validar que la cédula no sea negativa
  validarCedulaNoNegativa(control: FormControl): ValidationErrors | null {
    const cedula = control.value;
    return cedula < 0 ? { cedulaNegativa: true } : null;
  }

  // Función para validar que el nombre y la cédula no contengan símbolos
  validarSinSimbolos(control: FormControl): ValidationErrors | null {
    const valor = control.value;
    const regex = /^[a-zA-Z0-9\s]+$/;
    return !regex.test(valor) ? { contieneSimbolos: true } : null;
  }

  // Función para validar que la fecha de ingreso sea menor a la fecha actual
  validarFechaIngresoAnterior(control: FormControl): ValidationErrors | null {
    const fechaIngreso = control.value;
    const fechaActual = new Date();
    return fechaIngreso > fechaActual ? { fechaIngresoInvalida: true } : null;
  }

  // Formulario actualizado con validaciones adicionales
  solicitudForm = signal(new FormGroup({
    nombre: new FormControl('', [Validators.required, this.validarSinSimbolos]),
    cedula: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/), this.validarCedulaNoNegativa, this.validarSinSimbolos]),
    cargo: new FormControl('', Validators.required),
    fechaIngreso: new FormControl('', [Validators.required, this.validarFechaIngresoAnterior])
  }));
}