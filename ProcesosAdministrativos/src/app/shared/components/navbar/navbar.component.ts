import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUser, faCircleXmark  } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule ,FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() rol: string | undefined;

  

  faCircleXmark = faCircleXmark;
  faCircleUser = faCircleUser;
  faBars = faBars;


  dropdown_preoperativos = signal(false);
  dropdown_tramites = signal(false);
  dropdown_menu = signal(false);
  dropdown_solicitudes = signal(false);
  

  dropDownPre(): void {
    this.dropdown_preoperativos.set(!this.dropdown_preoperativos()) ;
  }

  dropDownTram(): void {
    this.dropdown_tramites.set(!this.dropdown_tramites()) ;
  }

  dropDownMenu(): void {
    this.dropdown_menu.set(!this.dropdown_menu()) ;
  }

  dropDownSolicitudes(): void {
    this.dropdown_solicitudes.set(!this.dropdown_solicitudes()) ;
  }
}
