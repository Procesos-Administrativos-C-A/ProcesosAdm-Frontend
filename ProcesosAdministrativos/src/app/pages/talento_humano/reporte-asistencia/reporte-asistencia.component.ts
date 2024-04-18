import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-reporte-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './reporte-asistencia.component.html',
  styleUrls: ['./reporte-asistencia.component.css']
})
export class ReporteAsistenciaComponent {
  // Signals para controlar los dropdown
  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  dropdown_solicitudes = signal(false);

  // Métodos para abrir/cerrar los dropdown
  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos());
  }

  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites());
  }

  dropDownSoli(): void {
    this.dropdown_solicitudes.set(!this.dropdown_solicitudes());
  }

  // Datos quemados para cargos y empleados
  cargos = ['Desarrollador', 'Analista', 'Diseñador', 'Gerente'];
  empleados = [
    { nombre: 'Juan Pérez', cargo: 'Desarrollador' },
    { nombre: 'María García', cargo: 'Analista' },
    { nombre: 'Pedro Rodríguez', cargo: 'Diseñador' },
    { nombre: 'Ana Martínez', cargo: 'Gerente' }
  ];

  // Datos quemados para horas trabajadas
  horasTrabajadas = [
    { empleado: 'Juan Pérez', mes: 'Enero', horas: 160 },
    { empleado: 'Juan Pérez', mes: 'Febrero', horas: 180 },
    { empleado: 'María García', mes: 'Enero', horas: 170 },
    { empleado: 'María García', mes: 'Febrero', horas: 165 },
    { empleado: 'Pedro Rodríguez', mes: 'Enero', horas: 150 },
    { empleado: 'Pedro Rodríguez', mes: 'Febrero', horas: 175 },
    { empleado: 'Ana Martínez', mes: 'Enero', horas: 180 },
    { empleado: 'Ana Martínez', mes: 'Febrero', horas: 190 }
  ];
  // Array para almacenar los empleados seleccionados
  empleadosSeleccionados = [{ nombre: '' }];

  // Método para agregar un nuevo empleado vacío
  agregarEmpleado() {
    this.empleadosSeleccionados.push({ nombre: '' });
  }
  // Método para eliminar un empleado
  eliminarEmpleado(index: number) {
    this.empleadosSeleccionados.splice(index, 1);
  }
}