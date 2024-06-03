import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUser, faCircleXmark ,faPenToSquare, faFileLines  } from '@fortawesome/free-regular-svg-icons';
import { faBars, faAngleUp, faAngleDown, faHouse, faBoxArchive} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule ,FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() rol: number | undefined;

  faCircleXmark = faCircleXmark;
  faCircleUser = faCircleUser;
  faBars = faBars;


  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  faHouse = faHouse;
  faPenToSquare = faPenToSquare;
  faFileLines = faFileLines;
  faBoxArchive = faBoxArchive;

  dropdown_preoperativos = signal(false);
  dropdown_preop_desplegado = signal(false);
  dropdown_tramites = signal(false);
  dropdown_tram_desplegado = signal(false);
  dropdown_solicitudes = signal(false);
  dropdown_solic_desplegado= signal(false);
  dropdown_menu = signal(false);
  dropdown_user= signal(false);
  dropdown_user_desplegado= signal(false);
  

  dropDownPre(desplegado: boolean = false): void {
    this.dropdown_preop_desplegado.set(desplegado);
    if (this.dropdown_preoperativos()){
      if(desplegado){
        return
      }
      setTimeout(() => {
        if(!this.dropdown_preop_desplegado()){
          this.dropdown_preoperativos.set(false);
        } 
        return
      }, 100);
    }else{
      this.dropdown_preoperativos.set(true);
    }
    
  }

  dropDownTram(desplegado: boolean = false): void {
    this.dropdown_tram_desplegado.set(desplegado);
    if (this.dropdown_tramites()){
      if(desplegado){
        return
      }
      setTimeout(() => {
        if(!this.dropdown_tram_desplegado()){
          this.dropdown_tramites.set(false);
        } 
      }, 100);
    }else{
      this.dropdown_tramites.set(true);
    }
  }



  dropDownSolic(desplegado: boolean = false): void {
    this.dropdown_solic_desplegado.set(desplegado);
    if (this.dropdown_solicitudes()){
      if(desplegado){
        return
      }
      setTimeout(() => {
        if(!this.dropdown_solic_desplegado()){
          this.dropdown_solicitudes.set(false);
        } 
      }, 100);
    }else{
      this.dropdown_solicitudes.set(true);
    }
  }

  dropDownMenu(): void {
    this.dropdown_menu.set(!this.dropdown_menu()) ;
  }

  dropDownUser(desplegado : boolean = false): void {
    this.dropdown_user_desplegado.set(desplegado);
    if (this.dropdown_user()){
      if(desplegado){
        return
      }
      setTimeout(() => {
        if(!this.dropdown_user_desplegado()){
          this.dropdown_user.set(false);
        } 
      }, 100);
    }else{
      this.dropdown_user.set(true);
    }
  }


  cerrarSesion():void {
    localStorage.clear()
  }

}


