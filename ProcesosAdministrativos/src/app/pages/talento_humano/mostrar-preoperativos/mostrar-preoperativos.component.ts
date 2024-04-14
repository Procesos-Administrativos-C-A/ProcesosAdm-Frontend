import { Component, signal, OnInit } from '@angular/core';
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
export class MostrarPreoperativosComponent implements OnInit {
  preoperativos: Preoperativo[] = [];

  empleadosPreoperativo: EmpleadosPreoperativo[] = [];

  preoperativoSeleccionado: Preoperativo | null = null;
  preoperativoForm: FormGroup;
  fechaBusqueda: string = '';
  private fechaBusquedaAnterior: string = '';

  constructor(private fb: FormBuilder) {
    this.preoperativoForm = this.fb.group({
      // Agrega los controles necesarios para los detalles del preoperativo
    });
    const fechaActual = new Date().toISOString().split('T')[0];
    this.fechaBusqueda = fechaActual;
  }

  ngOnInit() {
    console.log('Componente inicializado');
    this.simularDatosBackend();
  }

  simularDatosBackend() {
    const datosSimulados: any[] = [
      {
        "preoperativo": {
          "fecha": "2024-04-11", 
          "encargado": "Alejandro Posada",
          "turno": "Turno 1",
          "lugar": "Estación A",
          "festivo": 1
        },
        "empleados_preoperativos": [
          {
            "cedula": 75066500,
            "horas_diarias": 8,
            "horas_adicionales": 2,
            "estacion": "Estación A"
          },
          {
            "cedula": 1053783963,
            "horas_diarias": 7,
            "horas_adicionales": 1,
            "estacion": "Estación B"
          }
        ]
      },
      {
        "preoperativo": {
          "fecha": "2024-04-10", 
          "encargado": "Jhonatan Garcia",
          "turno": "Turno 1",
          "lugar": "Estación A",
          "festivo": 1
        },
        "empleados_preoperativos": [
          {
            "cedula": 75066500,
            "horas_diarias": 8,
            "horas_adicionales": 2,
            "estacion": "Estación A"
          },
          {
            "cedula": 1053783963,
            "horas_diarias": 7,
            "horas_adicionales": 1,
            "estacion": "Estación B"
          }
        ]
      },
      {
        "preoperativo": {
          "fecha": "2024-04-11", 
          "encargado": "Alejandro Posada",
          "turno": "Turno 2",
          "lugar": "Estación A",
          "festivo": 0
        },
        "empleados_preoperativos": [
          {
            "cedula": 75066500,
            "horas_diarias": 8,
            "horas_adicionales": 2,
            "estacion": "Estación A"
          },
          {
            "cedula": 1053783963,
            "horas_diarias": 7,
            "horas_adicionales": 1,
            "estacion": "Estación B"
          }
        ]
      },
      {
        "preoperativo": {
          "fecha": "2024-04-10", 
          "encargado": "Jhonatan Garcia",
          "turno": "Turno 3",
          "lugar": "Estación A",
          "festivo": 0
        },
        "empleados_preoperativos": [
          {
            "cedula": 75066500,
            "horas_diarias": 8,
            "horas_adicionales": 2,
            "estacion": "Estación A"
          },
          {
            "cedula": 1053783963,
            "horas_diarias": 7,
            "horas_adicionales": 1,
            "estacion": "Estación B"
          }
        ]
      }
    ];
    console.log('Datos simulados:', datosSimulados);
    datosSimulados.forEach(data => {
      this.procesarDatosBackend(data);
    });
  }

  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  dropdown_solicitudes = signal(false);

  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos());
  }

  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites());
  }

  dropDownSoli(): void {
    this.dropdown_solicitudes.set(!this.dropdown_solicitudes());
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
    console.log('Preoperativos actualizados:', this.preoperativos);
  }

  filtrarPreoperativos(): Preoperativo[] {
    console.log('Fecha de búsqueda:', this.fechaBusqueda);
    if (!this.fechaBusqueda) {
      console.log('No hay fecha de búsqueda, mostrando los primeros 9 preoperativos');
      this.preoperativoSeleccionado = null;
      return this.preoperativos.slice(0, 9);
    }
  
    // Si la fecha de búsqueda cambió, restablece el preoperativoSeleccionado
    if (this.fechaBusqueda !== this.fechaBusquedaAnterior) {
      this.preoperativoSeleccionado = null;
    }
    this.fechaBusquedaAnterior = this.fechaBusqueda;
  
    const preoperativosFiltrados = this.preoperativos.filter(preoperativo => preoperativo.fecha === this.fechaBusqueda);
    console.log('Preoperativos filtrados:', preoperativosFiltrados);
    return preoperativosFiltrados.slice(0, 9);
  }
  
  verDetalles(preoperativo: Preoperativo) {
    this.preoperativoSeleccionado = preoperativo;
    console.log('Preoperativo seleccionado:', preoperativo);
  }
}