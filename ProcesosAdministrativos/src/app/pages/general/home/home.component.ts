import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { ImageSliderComponent } from "../../../shared/components/image-slider/image-slider.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, ImageSliderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Obtiene el rol del usuario desde el local storage y lo convierte a número
  rol = Number(localStorage.getItem('rol'))
 }
