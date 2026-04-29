import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { RouterLink, RouterModule, Router } from "@angular/router";
import { registroRespuesta } from './../../../arquitectura/interface/registroRespuesta.interface';
import { registroSolicitud } from '../../../arquitectura/interface/registroSolicitud.interface';
import { AutenticadorService } from './../../../arquitectura/servicio/autenticacion/autenticador.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';



@Component({
  selector: 'app-registro',
  imports: [MatIconModule, RouterLink, RouterModule, FormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  usuario: string = '';  // almacena el usuario del formulario
  nombre: string = '';   // almacena el nombre del formulario
  clave: string = '';    // almacena la clave del formulario
  confirmarclave: string = ''; // almacena la confirmación de clave del formulario
  mensaje: string = '';  // mensaje para mostrar en pantalla (exitoso o error)
  mostrarClave: boolean = false; // variable para controlar la visibilidad de la contraseña
  mostrarClaveConfirmacion: boolean = false; // variable para controlar la visibilidad de la contraseña



  constructor(
    private autenticadorService: AutenticadorService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private router: Router
  ) { }


  // ---------------------------------------------------------
  // MÉTODO PARA REGISTRAR USUARIO
  // ---------------------------------------------------------

  registrar() {

    // --- Validación de campos obligatorios ---
    if (!this.usuario || this.usuario.trim() === '') {
      this.notificacionSnackbarService.error(
        'El usuario es obligatorio',
        'El nombre de usuario no puede estar vacío'
      );
      return;
    }

    // --- Validación de campos obligatorios ---
    if (!this.nombre || this.nombre.trim() === '') {
      this.notificacionSnackbarService.error(
        'El nombre es obligatorio',
        'El nombre no puede estar vacío'
      );
      return;
    }


    // VALIDAR QUE LAS CONTRASEÑAS COINCIDAN
    if (this.clave !== this.confirmarclave) {
      this.notificacionSnackbarService.error(
        'Las contraseñas no coinciden',
        'Verifica que ambos campos tengan la misma contraseña'
      );
      return;
    }

    // VALIDAR QUE LA CONTRASEÑA NO ESTÉ VACÍA
    if (!this.clave || this.clave.trim() === '') {
      this.notificacionSnackbarService.error(
        'La contraseña es obligatoria',
        'La contraseña no puede estar vacía'
      );
      return;
    }


    const data: registroSolicitud = {
      usuario: this.usuario,
      nombre: this.nombre,
      clave: this.clave
    };


    // Llamamos al servicio autenticadorService.registro() {
    // Este devuelve un Observable, así que usamos subscribe() para recibir la respuesta
    this.autenticadorService.registro(data).subscribe({

      // Si el backend responde correctamente (200 OK)
      next: (respuesta: registroRespuesta) => {

        // Verificamos si el registro fue exitoso (por el mensaje)
        if (respuesta.mensaje === 'Usuario Registrado Correctamente') {
          // Notificación de éxito con el mensaje del backend
          this.notificacionSnackbarService.success(
            '¡Registro exitoso!',
            respuesta.mensaje  // "Usuario Registrado Correctamente"
          );

          // Guardar datos (ajusta según lo que necesites)
          localStorage.setItem('usuario', JSON.stringify({
            usuario: respuesta.usuario,
            nombre: respuesta.nombre,
            rol: respuesta.rol
          }));

          // Redirigir al login después de 1 segundo (opcional)
          setTimeout(() => {
            this.router.navigate(['/autenticacion/acceso']);
          }, 1500);

        } else {
          // Cualquier otro mensaje (ej: "El Usuario Ya Existe", "El Rol No Existe", etc.)
          this.notificacionSnackbarService.error(
            'Error en el registro',
            respuesta.mensaje   // muestra el mensaje exacto del backend
          );
        }
      },
      error: (err) => {
        // Error de conexión o del servidor (HTTP 500, etc.)
        this.notificacionSnackbarService.error(
          'Error del servidor',
          'No se pudo completar el registro. Intenta más tarde.'
        );
        console.error(err);
      }
    });
  }


  // ---------------------------------------------------------
  // MÉTODOS PARA MOSTRAR/OCULTAR CONTRASEÑA
  // ---------------------------------------------------------

  toggleMostrarClave() {
    this.mostrarClave = !this.mostrarClave;
  }

  toggleMostrarClaveConfirmacion() {
    this.mostrarClaveConfirmacion = !this.mostrarClaveConfirmacion;
  }

}