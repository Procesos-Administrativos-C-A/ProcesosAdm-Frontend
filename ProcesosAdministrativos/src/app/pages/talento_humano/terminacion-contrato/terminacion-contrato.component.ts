// Importación de módulos y componentes necesarios
import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

// Definición de la interfaz para el objeto Empleado
interface Empleado {
  nombre: string;
  apellidos: string;
  cedula: string;
  correoElectronico: string;
  fechaFinContrato: Date;
}

@Component({
  // Selector del componente
  selector: 'app-terminacion-contrato',
  // Indicador de componente independiente
  standalone: true,
  // Plantilla HTML del componente
  templateUrl: './terminacion-contrato.component.html',
  // Estilos CSS del componente
  styleUrls: ['./terminacion-contrato.component.css'],
  // Importación de módulos y componentes
  imports: [CommonModule, DatePipe, NavbarComponent]
})
export class TerminacionContratoComponent implements OnInit {
  // Arreglo que almacenará los empleados cuyo contrato está próximo a vencer
  empleadosContratoVencido: Empleado[] = [];

  // Propiedad para almacenar el rol del usuario obtenido del almacenamiento local
  rol = Number(localStorage.getItem('rol'))

  constructor() { }

  ngOnInit() {
    // Datos de prueba para empleados
    const empleadosDePrueba: Empleado[] = [
      {
        nombre: 'Juan',
        apellidos: 'Pérez Gómez',
        cedula: '1234567890',
        fechaFinContrato: new Date(2024, 6, 15),
        correoElectronico: 'juan.perez@example.com'
      },
      // Otros empleados de prueba...
    ];

    // Método para obtener los empleados cuyo contrato está próximo a vencer
    this.obtenerEmpleadosContratoVencido(empleadosDePrueba);
  }

  // Método para filtrar empleados cuyo contrato está próximo a vencer
  obtenerEmpleadosContratoVencido(empleados: Empleado[]) {
    const fechaActual = new Date();
    this.empleadosContratoVencido = empleados.filter(empleado => {
      const fechaFinContrato = new Date(empleado.fechaFinContrato);
      const diferenciaEnMeses = (fechaFinContrato.getFullYear() - fechaActual.getFullYear()) * 12 + (fechaFinContrato.getMonth() - fechaActual.getMonth());
      return diferenciaEnMeses <= 2;
    });
  }

  // Define señales para manejar dropdowns
  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  dropdown_solicitudes = signal(false);

  // Método para mostrar/ocultar dropdown de preoperativos
  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos());
  }

  // Método para mostrar/ocultar dropdown de tramites
  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites());
  }

  // Método para mostrar/ocultar dropdown de solicitudes
  dropDownSoli(): void {
    this.dropdown_solicitudes.set(!this.dropdown_solicitudes());
  }
}
