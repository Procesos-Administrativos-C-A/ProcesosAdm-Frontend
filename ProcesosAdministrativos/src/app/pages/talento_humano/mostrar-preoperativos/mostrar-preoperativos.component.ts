import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Preoperativo } from '../../../core/models/preoperativo.model';
import { EmpleadosPreoperativo } from '../../../core/models/empleados_preoperativo.model';
import { BackendService } from '../../../core/services/backend.service';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";

@Component({
    selector: 'app-preoperativos',  // Define el selector para este componente
    standalone: true,  // Especifica que este componente es independiente
    templateUrl: './mostrar-preoperativos.component.html',  // Ruta de la plantilla HTML
    styleUrls: ['./mostrar-preoperativos.component.css'],  // Rutas de las hojas de estilo CSS
    imports: [CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule, NavbarComponent]  // Módulos importados
})
export class MostrarPreoperativosComponent implements OnInit {
  preoperativos: Preoperativo[] = [];  // Arreglo para almacenar preoperativos

  rol = Number(localStorage.getItem('rol'))  // Obtiene el rol desde el almacenamiento local

  empleadosPreoperativo: EmpleadosPreoperativo[] = [];  // Arreglo para almacenar empleados preoperativos

  preoperativoSeleccionado: Preoperativo | null = null;  // Variable para almacenar el preoperativo seleccionado
  preoperativoForm: FormGroup;  // FormGroup para el formulario de preoperativos
  fechaBusqueda: string = '';  // Variable para la fecha de búsqueda
  private fechaBusquedaAnterior: string = '';  // Variable para almacenar la fecha de búsqueda anterior
  modalVisible = false;  // Variable para controlar la visibilidad del modal

  constructor(private fb: FormBuilder, private backendService: BackendService) {
    // Inicializa el formulario vacío
    this.preoperativoForm = this.fb.group({});
    // Obtiene la fecha actual y la asigna a la fecha de búsqueda
    const fechaActual = new Date().toISOString().split('T')[0];
    this.fechaBusqueda = fechaActual;
  }

  // Estaciones ordenadas
  estacionesOrdenadas = [
    'Fundadores',
    'Betania',
    'Cambulos',
    'Villamaria + S.A.V',
    'Villamaria + S.U.V',
    'Mantenimiento'
  ];

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    console.log('Componente inicializado');
    this.obtenerPreoperativosPorFecha(this.fechaBusqueda);
  }

  // Obtiene los preoperativos por fecha y los asigna a la propiedad preoperativos
  obtenerPreoperativosPorFecha(fecha: string) {
    this.backendService.getPreoperativosPorFecha(fecha)
      .subscribe({
        next: (preoperativos: Preoperativo[]) => {
          this.preoperativos = preoperativos.map((preoperativo) => ({
            id: preoperativo.id,
            fecha: preoperativo.fecha,
            encargado: preoperativo.encargado,
            turno: preoperativo.turno,
            lugar: preoperativo.lugar,
            festivo: Boolean(preoperativo.festivo),  // Conversión de festivo a booleano
            empleados_preoperativos: preoperativo.empleados_preoperativos?.map((empleado: EmpleadosPreoperativo) => ({
              id: empleado.id,
              id_preoperativo: empleado.id_preoperativo,
              cedula: empleado.cedula.toString(),
              nombre: empleado.nombre,
              apellidos: empleado.apellidos,
              horas_diarias: empleado.horas_diarias,
              horas_adicionales: empleado.horas_adicionales,
              estacion: empleado.estacion
            }))
          }));
        },
        error: (error) => {
          console.error('Error al obtener los preoperativos:', error);
        }
      });
  }

  // Procesa los datos recibidos del backend y actualiza la lista de preoperativos
  procesarDatosBackend(data: any) {
    const preoperativo: Preoperativo = {
      fecha: data.preoperativo.fecha,
      encargado: data.preoperativo.encargado,
      turno: data.preoperativo.turno,
      lugar: data.preoperativo.lugar,
      festivo: data.preoperativo.festivo === 1,  // Conversión de festivo a booleano
      empleados_preoperativos: data.empleados_preoperativos.map((empleado: any) => ({
        cedula: empleado.cedula.toString(),
        nombre: empleado.nombre,
        horas_diarias: empleado.horas_diarias,
        horas_adicionales: empleado.horas_adicionales,
        estacion: empleado.estacion
      }))
    };
    this.preoperativos.push(preoperativo);
  }

  // Filtra los preoperativos por la fecha de búsqueda
  filtrarPreoperativos(): Preoperativo[] {
    if (!this.fechaBusqueda) {
      this.preoperativoSeleccionado = null;
      return this.preoperativos.slice(0, 9);  // Devuelve los primeros 9 preoperativos
    }

    // Si la fecha de búsqueda cambió, restablece el preoperativoSeleccionado
    if (this.fechaBusqueda !== this.fechaBusquedaAnterior) {
      this.preoperativoSeleccionado = null;
      this.obtenerPreoperativosPorFecha(this.fechaBusqueda);
    }
    this.fechaBusquedaAnterior = this.fechaBusqueda;

    // Filtra los preoperativos por la fecha de búsqueda
    const preoperativosFiltrados = this.preoperativos.filter(preoperativo => preoperativo.fecha === this.fechaBusqueda);
    return preoperativosFiltrados.slice(0, 9);  // Devuelve los primeros 9 preoperativos filtrados
  }

  // Agrupa empleados de un preoperativo por estación
  agruparEmpleadosPorEstacion(preoperativo: Preoperativo): { [estacion: string]: EmpleadosPreoperativo[] } {
    if (!preoperativo.empleados_preoperativos) {
      return {};
    }

    // Reduce los empleados a un objeto donde las claves son estaciones y los valores son arrays de empleados
    return preoperativo.empleados_preoperativos.reduce((grupos, empleado) => {
      const estacion = empleado.estacion;
      if (!grupos[estacion]) {
        grupos[estacion] = [];
      }
      grupos[estacion].push(empleado);
      return grupos;
    }, {} as { [estacion: string]: EmpleadosPreoperativo[] });
  }

  empleadosAgrupadosPorEstacion: { [estacion: string]: EmpleadosPreoperativo[] } = {};  // Almacena los empleados agrupados por estación

  // Método para ver detalles de un preoperativo seleccionado
  verDetalles(preoperativo: Preoperativo) {
    this.preoperativoSeleccionado = preoperativo;
    this.empleadosAgrupadosPorEstacion = this.agruparEmpleadosPorEstacion(preoperativo);
    this.modalVisible = true;
  }

  // Método para generar un PDF de preoperativos
  generarPDF() {
    if (this.fechaBusqueda) {
      this.backendService.generarPDFPreoperativosPorFecha(this.fechaBusqueda)
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
    } else {
      console.error('No se ha seleccionado una fecha');
    }
  }
}
