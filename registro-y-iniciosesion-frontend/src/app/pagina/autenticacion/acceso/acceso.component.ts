import { FormsModule } from '@angular/forms';
import { AutenticadorService } from '../../../arquitectura/servicio/autenticacion/autenticador.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon'
import { Router } from '@angular/router';
import { RouterLink, RouterModule } from "@angular/router";
import { inicioSesionSolicitud } from './../../../arquitectura/interface/inicioSesionSolicitud.interface';
import { inicioSesionRespuesta } from './../../../arquitectura/interface/inicioSesionRespuesta.interface';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';



@Component({
  selector: 'app-acceso',
  imports: [MatIconModule, RouterLink, RouterModule, FormsModule, CommonModule],
  templateUrl: './acceso.component.html',
  styleUrl: './acceso.component.css'
})
export class AccesoComponent {

  usuario: string = '';  // almacena el usuario del formulario
  clave: string = '';    // almacena la clave del formulario
  mostrarClave: boolean = false; // variable para controlar la visibilidad de la contraseña

  constructor(
    private autenticadorService: AutenticadorService,
    private router: Router,
    private notificacionSnackbarService: NotificacionSnackbarService
  ) { }


  // ---------------------------------------------------------
  // MÉTODO PARA INICIAR SESIÓN
  // ---------------------------------------------------------

  iniciarSesion() {

    // --- Validación de campos obligatorios ---
    if (!this.usuario || this.usuario.trim() === '') {
      this.notificacionSnackbarService.error(
        'El usuario es obligatorio',
        'El nombre de usuario no puede estar vacío'
      );
      return;
    }

    // --- Validación de campos obligatorios ---
    if (!this.clave || this.clave.trim() === '') {
      this.notificacionSnackbarService.error(
        'La contraseña es obligatoria',
        'La contraseña no puede estar vacía'
      );
      return;
    }


    // Creamos un objeto con los datos que necesita el backend
    const datos: inicioSesionSolicitud = {
      usuario: this.usuario,
      clave: this.clave
  };

  // Llamamos al servicio autenticadorService.iniciarSesion() {
  // Este devuelve un Observable, así que usamos subscribe() para recibir la respuesta
  this.autenticadorService.inicioSesion(datos).subscribe({
    
    // Si el backend responde correctamente (200 OK)
    next: (respuesta: inicioSesionRespuesta) => {

      // Verificar si el login fue exitoso por el mensaje del backend
        if (respuesta.mensaje === 'Inicio de Sesion Exitoso!!!') {
          // Notificación de éxito
          this.notificacionSnackbarService.success(
            'Bienvenido',
            respuesta.mensaje
          );

          // Guardar datos en localStorage
          localStorage.setItem('usuario', JSON.stringify(respuesta));

          // Redirigir al perfil después de 1 segundo (opcional)
          setTimeout(() => {
            this.router.navigate(['/autenticacion/perfil']);
          }, 1000);
        } else {
          // Cualquier otro mensaje (ej: "Usuario o contraseña incorrectos")
          this.notificacionSnackbarService.error(
            'Error de autenticación',
            respuesta.mensaje
          );
        }
      },
      error: (err) => {
        // Error de red o servidor (HTTP 500, etc.)
        this.notificacionSnackbarService.error(
          'Error del servidor',
          'No se pudo iniciar sesión. Intenta más tarde.'
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

  
}
