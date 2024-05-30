import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Empleado } from '../../../core/models/empleados.model';
import { BackendService } from '../../../core/services/backend.service';


@Component({
  selector: 'app-terminacion-contrato',
  standalone: true,
  templateUrl: './terminacion-contrato.component.html',
  styleUrls: ['./terminacion-contrato.component.css'],
  imports: [CommonModule, DatePipe, NavbarComponent]
})
export class TerminacionContratoComponent implements OnInit {
  empleadosContratoVencido: Empleado[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.obtenerEmpleadosContratoVencido();
  }

  obtenerEmpleadosContratoVencido() {
    this.backendService.getEmpleadosContratoVencido().subscribe(
      empleados => {
        this.empleadosContratoVencido = empleados;
      },
      error => {
        console.error('Error al obtener los empleados:', error);
      }
    );
  }

  generarPdf(cedula: string) {
    this.backendService.generarPdfEmpleado(cedula).subscribe(
      pdfData => {
        const url = window.URL.createObjectURL(pdfData.blob);
        window.open(url);
      },
      error => {
        console.error('Error al generar el PDF:', error);
      }
    );
  }
}