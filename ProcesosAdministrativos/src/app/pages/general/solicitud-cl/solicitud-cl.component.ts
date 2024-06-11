import { Component, signal } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { BackendService } from '../../../core/services/backend.service';

@Component({
  selector: 'app-solicitud-cl',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './solicitud-cl.component.html',
  styleUrl: './solicitud-cl.component.css'
})
export class SolicitudCLComponent {

  // Obtiene el rol del usuario desde el local storage y lo convierte a número
  rol = Number(localStorage.getItem('rol'))
  
  /**
   * Constructor de la clase
   * @param backendService - Servicio inyectado para realizar llamadas al backend
   */
  constructor(private backendService: BackendService) {}

  /**
   * Genera un PDF del certificado del usuario y lo descarga automáticamente
   */
  generarPDF() {
    this.backendService.generarPDFCertificado(localStorage.getItem('cedula')!)
      .subscribe({
        next: ({ blob, fileName }) => {
          // Descargar el archivo directamente
          const anclaDescarga = document.createElement('a');
          anclaDescarga.href = window.URL.createObjectURL(blob);
          anclaDescarga.download = fileName;
          anclaDescarga.click();
        },
        error: (error) => {
          console.error('Error al generar el PDF:', error);
        }
      });
  }

}