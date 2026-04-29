import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificacionComponent, SnackbarData } from '../../../pagina/notificacion/notificacion.component';


@Injectable({
  providedIn: 'root'
})
export class NotificacionSnackbarService {

  constructor(private snackBar: MatSnackBar) { }


  //Notificacion de Exito
  success(message: string, subMessage?: string, duration: number = 3000) {
    this.mostrar(message, subMessage, 'success', duration);
  }

  //Notificacion de Error
  error(message: string, subMessage?: string, duration: number = 4000) {
    this.mostrar(message, subMessage, 'error', duration);
  }

  //Notificacion de Informacion
  info(message: string, subMessage?: string, duration: number = 3000) {
    this.mostrar(message, subMessage, 'info', duration);
  }

  //Notificacion de Advertencia
  warning(message: string, subMessage?: string, duration: number = 3500) {
    this.mostrar(message, subMessage, 'warning', duration);
  }


  private mostrar(message: string, subMessage?: string, type: any = 'info', duration: number = 10000) {
    this.snackBar.openFromComponent(NotificacionComponent, {
      data: {
        message,
        subMessage,
        type,
        duration
      } as SnackbarData,
      duration: duration,
      horizontalPosition: 'end', // derecha
      verticalPosition: 'top',   // arriba
      panelClass: ['custom-snackbar']
    });
  }

}
