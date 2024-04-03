import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Preoperativo} from '../../../core/models/preoperativo.model';
import {EmpleadosPreoperativo} from '../../../core/models/empleados_preoperativo.model';
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-preoperativos',
  standalone: true,
  imports: [CommonModule, FormsModule,FontAwesomeModule],
  templateUrl: './preoperativos.component.html',
  styleUrl: './preoperativos.component.css'
})
export class PreoperativosComponent implements OnInit {

  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  horas_extra = signal(true);
  
  fecha_hoy = '';
  

  lugares = signal<EmpleadosPreoperativo[]>([
    {
      lugar: 'Cambulos',
      empleados: ['','','']
    },
    {
      lugar: 'Betania',
      empleados: ['','','']
    },
    {
      lugar: 'Fundadores',
      empleados: ['','','','']
    }
  ]);

  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos()) ;
  }

  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites()) ;
  }


  ngOnInit(): void {
    this.fecha_hoy = new Date().toISOString().substring(0, 10);
  }
  agregarPersona(index : number){
    this.lugares.update((lugares) => {
      return lugares.map((lugar, position) => {
        if (position == index){
          return{
            ...lugar,
            empleados : [...lugar.empleados, '']
          }
        }
        return lugar;
      })
    })
  }
  quitarPersona(index: number, lugarIndex: number){
    this.lugares.update((lugares) => {
      return lugares.map((lugar, position) => {
        if (position == lugarIndex){
          return{
            ...lugar,
            empleados: lugar.empleados.filter((empleado, i) => i !== index), 
          }
        }
        return lugar;
      })
    })
  }

  actualizarPersona(index: number, lugarIndex: number, event: Event){
    const elementInput = event.target as HTMLInputElement;

    this.lugares.update((lugares) => {
      return lugares.map((lugar, position) => {
        if (position == lugarIndex){
          return{
            ...lugar,
            empleados: lugar.empleados.map((empleado, i) => {
              if (i === index) {
                return  elementInput.value; // Actualizar nombre
              }
              return empleado;
            }),
          }
        }
        return lugar;
      })
    })
  }

  cambioLinea(event: Event){
    const elementInput = event.target as HTMLInputElement;
    
    switch (elementInput.value) {
      case 'Linea1':
        this.lugares.set([
          {
            lugar: 'Cambulos',
            empleados: ['','','']
          },
          {
            lugar: 'Betania',
            empleados: ['','','']
          },
          {
            lugar: 'Fundadores',
            empleados: ['','','','']
          }
        ]);
        return ;
      case 'Linea2':
        this.lugares.set([
          {
            lugar: 'Villamaria + S.A.V',
            empleados: ['','','']
          },
          {
            lugar: 'Villamaria + S.U.V',
            empleados: ['','','']
          }
        ]);
        return ;
      case 'Mantenimiento':
        this.lugares.set([
          {
            lugar: 'Mantenimiento',
            empleados: ['','','']
          }
        ]);
        return ;
      default:
        this.lugares.set([]);
        return ;
    }
  }
}
