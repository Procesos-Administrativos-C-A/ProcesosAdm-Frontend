import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUser, faCircleXmark ,faPenToSquare, faFileLines  } from '@fortawesome/free-regular-svg-icons';
import { faBars, faAngleUp, faAngleDown, faHouse, faBoxArchive, faUsers} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule ,FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
// Entrada del componente para recibir el rol del usuario
@Input() rol: number | undefined;

// Declaración de iconos de FontAwesome
faCircleXmark = faCircleXmark;
faCircleUser = faCircleUser;
faBars = faBars;
faAngleDown = faAngleDown;
faAngleUp = faAngleUp;
faHouse = faHouse;
faPenToSquare = faPenToSquare;
faFileLines = faFileLines;
faBoxArchive = faBoxArchive;
faUsers = faUsers;

// Señales (signals) para gestionar el estado de los menús desplegables
dropdown_preoperativos = signal(false);
dropdown_preop_desplegado = signal(false);
dropdown_tramites = signal(false);
dropdown_tram_desplegado = signal(false);
dropdown_solicitudes = signal(false);
dropdown_solic_desplegado = signal(false);
dropdown_menu = signal(false);
dropdown_user = signal(false);
dropdown_user_desplegado = signal(false);
dropdown_usuarios = signal(false);
dropdown_usuarios_desplegado = signal(false);

/**
 * Método para gestionar el despliegue del menú de Preoperativos
 * @param desplegado - Indica si el menú debe estar desplegado (true) o no (false)
 */
dropDownPre(desplegado: boolean = false): void {
  this.dropdown_tramites.set(false);
  this.dropdown_tram_desplegado.set(false);
  this.dropdown_solicitudes.set(false);
  this.dropdown_solic_desplegado.set(false);
  this.dropdown_user.set(false);
  this.dropdown_user_desplegado.set(false);
  this.dropdown_usuarios.set(false);
  this.dropdown_usuarios_desplegado.set(false);

  this.dropdown_preop_desplegado.set(desplegado);
  if (this.dropdown_preoperativos()) {
    if (desplegado) {
      return;
    }
    setTimeout(() => {
      if (!this.dropdown_preop_desplegado()) {
        this.dropdown_preoperativos.set(false);
      }
    }, 100);
  } else {
    this.dropdown_preoperativos.set(true);
  }
}

/**
 * Método para gestionar el despliegue del menú de Trámites
 * @param desplegado - Indica si el menú debe estar desplegado (true) o no (false)
 */
dropDownTram(desplegado: boolean = false): void {
  this.dropdown_preoperativos.set(false);
  this.dropdown_preop_desplegado.set(false);
  this.dropdown_solicitudes.set(false);
  this.dropdown_solic_desplegado.set(false);
  this.dropdown_user.set(false);
  this.dropdown_user_desplegado.set(false);
  this.dropdown_usuarios.set(false);
  this.dropdown_usuarios_desplegado.set(false);

  this.dropdown_tram_desplegado.set(desplegado);
  if (this.dropdown_tramites()) {
    if (desplegado) {
      return;
    }
    setTimeout(() => {
      if (!this.dropdown_tram_desplegado()) {
        this.dropdown_tramites.set(false);
      }
    }, 100);
  } else {
    this.dropdown_tramites.set(true);
  }
}

/**
 * Método para gestionar el despliegue del menú de Solicitudes
 * @param desplegado - Indica si el menú debe estar desplegado (true) o no (false)
 */
dropDownSolic(desplegado: boolean = false): void {
  this.dropdown_preoperativos.set(false);
  this.dropdown_preop_desplegado.set(false);
  this.dropdown_tramites.set(false);
  this.dropdown_tram_desplegado.set(false);
  this.dropdown_user.set(false);
  this.dropdown_user_desplegado.set(false);
  this.dropdown_usuarios.set(false);
  this.dropdown_usuarios_desplegado.set(false);

  this.dropdown_solic_desplegado.set(desplegado);
  if (this.dropdown_solicitudes()) {
    if (desplegado) {
      return;
    }
    setTimeout(() => {
      if (!this.dropdown_solic_desplegado()) {
        this.dropdown_solicitudes.set(false);
      }
    }, 100);
  } else {
    this.dropdown_solicitudes.set(true);
  }
}

/**
 * Método para alternar el estado del menú principal
 */
dropDownMenu(): void {
  this.dropdown_preoperativos.set(false);
  this.dropdown_preop_desplegado.set(false);
  this.dropdown_tramites.set(false);
  this.dropdown_tram_desplegado.set(false);
  this.dropdown_solicitudes.set(false);
  this.dropdown_solic_desplegado.set(false);
  this.dropdown_user.set(false);
  this.dropdown_user_desplegado.set(false);
  this.dropdown_usuarios.set(false);
  this.dropdown_usuarios_desplegado.set(false);

  this.dropdown_menu.set(!this.dropdown_menu());
}


dropDownMenus(): void {
  this.dropDownMenu()
  this.dropDownUser()
}

/**
 * Método para gestionar el despliegue del menú de usuario
 * @param desplegado - Indica si el menú debe estar desplegado (true) o no (false)
 */
dropDownUser(desplegado: boolean = false): void {
  this.dropdown_preoperativos.set(false);
  this.dropdown_preop_desplegado.set(false);
  this.dropdown_tramites.set(false);
  this.dropdown_tram_desplegado.set(false);
  this.dropdown_solicitudes.set(false);
  this.dropdown_solic_desplegado.set(false);
  this.dropdown_menu.set(false);
  this.dropdown_usuarios.set(false);
  this.dropdown_usuarios_desplegado.set(false);

  this.dropdown_user_desplegado.set(desplegado);
  if (this.dropdown_user()) {
    if (desplegado) {
      return;
    }
    setTimeout(() => {
      if (!this.dropdown_user_desplegado()) {
        this.dropdown_user.set(false);
      }
    }, 100);
  } else {
    this.dropdown_user.set(true);
  }
}

/**
 * Método para gestionar el despliegue del menú de Usuarios
 * @param desplegado - Indica si el menú debe estar desplegado (true) o no (false)
 */
dropDownUsuarios(desplegado: boolean = false): void {
  this.dropdown_preoperativos.set(false);
  this.dropdown_preop_desplegado.set(false);
  this.dropdown_tramites.set(false);
  this.dropdown_tram_desplegado.set(false);
  this.dropdown_solicitudes.set(false);
  this.dropdown_solic_desplegado.set(false);
  this.dropdown_user.set(false);
  this.dropdown_user_desplegado.set(false);

  this.dropdown_usuarios_desplegado.set(desplegado);
  if (this.dropdown_usuarios()) {
    if (desplegado) {
      return;
    }
    setTimeout(() => {
      if (!this.dropdown_usuarios_desplegado()) {
        this.dropdown_usuarios.set(false);
      }
    }, 100);
  } else {
    this.dropdown_usuarios.set(true);
  }
}

/**
 * Método para cerrar la sesión del usuario, limpiando el almacenamiento local
 */
cerrarSesion(): void {
  localStorage.clear();
  window.location.reload();
}

}


