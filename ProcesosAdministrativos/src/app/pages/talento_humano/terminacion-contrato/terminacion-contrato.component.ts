import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common'; 

interface Empleado {
  nombre: string;
  apellidos: string;
  cedula: string;
  correoElectronico: string;
  fechaFinContrato: Date;
}

@Component({
  selector: 'app-terminacion-contrato',
  standalone: true,
  templateUrl: './terminacion-contrato.component.html',
  styleUrls: ['./terminacion-contrato.component.css'],
  imports: [CommonModule, DatePipe,NavbarComponent]
})
export class TerminacionContratoComponent implements OnInit {
  empleadosContratoVencido: Empleado[] = [];

  rol = Number(localStorage.getItem('rol'))

  constructor() { }

  ngOnInit() {
    // Datos de prueba
    const empleadosDePrueba: Empleado[] = [
      {
        nombre: 'Juan',
        apellidos: 'Pérez Gómez',
        cedula: '1234567890',
        fechaFinContrato: new Date(2024, 6, 15),
        correoElectronico: 'juan.perez@example.com'
      },
      {
        nombre: 'María',
        apellidos: 'González Rodríguez',
        cedula: '0987654321',
        fechaFinContrato: new Date(2024, 6, 1),
        correoElectronico: 'maria.gonzalez@example.com'
      },
      {
        nombre: 'Carlos',
        apellidos: 'Torres Martínez',
        cedula: '5678901234',
        fechaFinContrato: new Date(2024, 6, 30),
        correoElectronico: 'carlos.torres@example.com'
      }
    ];

    this.obtenerEmpleadosContratoVencido(empleadosDePrueba);
  }

  obtenerEmpleadosContratoVencido(empleados: Empleado[]) {
    const fechaActual = new Date();
    this.empleadosContratoVencido = empleados.filter(empleado => {
      const fechaFinContrato = new Date(empleado.fechaFinContrato);
      const diferenciaEnMeses = (fechaFinContrato.getFullYear() - fechaActual.getFullYear()) * 12 + (fechaFinContrato.getMonth() - fechaActual.getMonth());
      return diferenciaEnMeses <= 2;
    });
  }

  // Define métodos para manejar dropdowns
  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  dropdown_solicitudes = signal(false);

  // Método para dropdown de preoperativos
  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos());
  }

  // Método para dropdown de tramites
  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites());
  }

  // Método para dropdown de solicitudes
  dropDownSoli(): void {
    this.dropdown_solicitudes.set(!this.dropdown_solicitudes());
  }
}