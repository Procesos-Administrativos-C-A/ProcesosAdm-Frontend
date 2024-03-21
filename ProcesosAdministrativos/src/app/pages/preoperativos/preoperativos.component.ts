import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-preoperativos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preoperativos.component.html',
  styleUrl: './preoperativos.component.css'
})
export class PreoperativosComponent {

  lugares = signal([
    'Cambulos',
    'Betania',
    'Fundadores'
  ]);
  lugares2 = signal([
    {
      lugar: 'Cambulos',
      Trabajadores: ['','','']
    },
    {
      lugar: 'Betania',
      Trabajadores: ['','','']
    },
    {
      lugar: 'Fundadores',
      Trabajadores: ['','','','']
    }
  ]);

  cambioLinea(event: Event){
    const elementInput = event.target as HTMLInputElement;
    
    switch (elementInput.value) {
      case 'Linea1':
        this.lugares.set(['Cambulos', 'Betania', 'Fundadores']);
        return ;
      case 'Linea2':
        this.lugares.set(['Villamaria + S.A.V', 'Villamaria + S.U.V']);
        return ;
      case 'Mantenimiento':
        this.lugares.set(['Mantenimiento']);
        return ;
      default:
        this.lugares.set([]);
        return ;
    }
  }
}
