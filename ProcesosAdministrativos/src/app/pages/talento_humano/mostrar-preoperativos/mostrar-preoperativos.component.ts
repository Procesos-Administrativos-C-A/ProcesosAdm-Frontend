import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Preoperativo } from '../../../core/models/preoperativo.model';
import { EmpleadosPreoperativo } from '../../../core/models/empleados_preoperativo.model';

@Component({
  selector: 'app-preoperativos',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './mostrar-preoperativos.component.html',
  styleUrls: ['./mostrar-preoperativos.component.css']
})
export class MostrarPreoperativosComponent {
  preoperativos: Preoperativo[] = [];

  empleadosPreoperativo: EmpleadosPreoperativo[] = [];

  preoperativoSeleccionado: any;
  preoperativoForm: FormGroup;
  fechaBusqueda: string = '';
  //Fecha actual

  constructor(private fb: FormBuilder) {
    this.preoperativoForm = this.fb.group({
      // Agrega los controles necesarios para los detalles del preoperativo
    });
    const fechaActual = new Date().toISOString().split('T')[0];
    this.fechaBusqueda = fechaActual;
  }

  verDetalles(preoperativo: any) {
    this.preoperativoSeleccionado = preoperativo;
    this.empleadosPreoperativo = preoperativo.empleados_preoperativos;
    // Puedes cargar los datos del preoperativo en el formulario reactivo aquí
  }

  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);

  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos());
  }

  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites());
  }

  procesarDatosBackend(data: any) {
    const preoperativo: Preoperativo = {
      fecha: data.preoperativo.fecha,
      encargado: data.preoperativo.encargado,
      turno: data.preoperativo.turno,
      lugar: data.preoperativo.lugar,
      festivo: data.preoperativo.festivo === 1,
      empleados_preoperativos: data.empleados_preoperativos.map((empleado: any) => ({
        cedula: empleado.cedula.toString(),
        horas_diarias: empleado.horas_diarias,
        horas_adicionales: empleado.horas_adicionales,
        estacion: empleado.estacion
      }))
    };

    this.preoperativos.push(preoperativo);
  }

  filtrarPreoperativos(): Preoperativo[] {
    if (!this.fechaBusqueda) {
      return this.preoperativos.slice(0, 9);
    }
  
    return this.preoperativos.filter(preoperativo =>
      preoperativo.fecha === this.fechaBusqueda
    ).slice(0, 9);
  }
}