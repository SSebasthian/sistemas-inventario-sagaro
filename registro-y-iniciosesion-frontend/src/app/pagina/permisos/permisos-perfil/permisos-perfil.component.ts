import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { PerfilService } from '../../../arquitectura/servicio/autenticacion/perfil.service';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';





@Component({
  selector: 'app-permisos-perfil',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule, CommonModule],
  templateUrl: './permisos-perfil.component.html',
  styleUrl: './permisos-perfil.component.css'
})
export class PermisosPerfilComponent {

  constructor(
    private perfilService: PerfilService,
    private dialog: MatDialogRef<PermisosPerfilComponent>,
    private notificacionSnackbarService: NotificacionSnackbarService
  ) { }

  editando: boolean = false;
  modoPassword: boolean = false;
  verPasswordActual = false;
  verPasswordNueva = false;
  claveActual: string = '';
  claveNueva: string = '';
  claveConfirmar: string = '';
  mensajeclave: string = '';

  usuario: any;

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.perfilService.getPerfil().subscribe({
      next: (datos) => {
        this.usuario = datos;
        console.log('Se Cargó el Usuario:', datos.usuario);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  editarPerfil() {
    this.editando = true;
  }

  guardarPerfil() {
  const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');

  this.perfilService.actualizarPerfil(usuarioGuardado.usuario, this.usuario).subscribe({
    next: (res: any) => {
      // Notificación de éxito
      this.notificacionSnackbarService.success(
        'Perfil actualizado',
        `Nombre cambiado a: ${res.nombre}`
      );
      
      this.usuario = res;
      this.editando = false;
      this.perfilService.notificarPerfilActualizado();
    },
    error: (err) => {
      this.notificacionSnackbarService.error(
        'Error al actualizar',
        'No se pudo modificar el nombre. Intenta de nuevo.'
      );
      console.error(err);
    }
  });
}


  abrirPassword() {
    this.modoPassword = true;
  }

  guardarPassword() {
  const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');

  // Validaciones con snackbar
  if (!this.claveActual || !this.claveNueva || !this.claveConfirmar) {
    this.notificacionSnackbarService.error('Campos incompletos', 'Todos los campos son obligatorios');
    return;
  }

  if (this.claveNueva !== this.claveConfirmar) {
    this.notificacionSnackbarService.error('Las contraseñas no coinciden', 'Verifica la nueva contraseña');
    return;
  }

  this.perfilService.cambiarClave(usuarioGuardado.usuario, this.claveActual, this.claveNueva).subscribe({
    next: (res: any) => {
      if (res.mensaje && res.mensaje.includes('correctamente')) {
        // Éxito
        this.notificacionSnackbarService.success('Contraseña actualizada', res.mensaje);
        
        // Limpiar campos y cerrar modal
        this.claveActual = '';
        this.claveNueva = '';
        this.claveConfirmar = '';
        this.modoPassword = false;
      } else {
        // Error controlado por backend (ej. contraseña actual incorrecta)
        this.notificacionSnackbarService.error('Error', res.mensaje || 'No se pudo cambiar la contraseña');
      }
    },
    error: (err) => {
      this.notificacionSnackbarService.error('Error del servidor', 'Intenta más tarde');
      console.error(err);
    }
  });
}


  accionCancelar() {
    // MODO NORMAL → cerrar dialog
    if (!this.editando && !this.modoPassword) {
      this.dialog.close();
      return;
    }

    // MODO EDICIÓN O PASSWORD → resetear
    this.editando = false;
    this.modoPassword = false;
    //console.log('Cancelado / vuelto atrás');
  }

}
