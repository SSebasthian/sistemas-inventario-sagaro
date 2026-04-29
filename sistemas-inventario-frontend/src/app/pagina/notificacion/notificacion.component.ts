import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';





export interface SnackbarData {
  message: string;
  subMessage?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}


@Component({
  selector: 'app-notificacion',
  imports: [CommonModule, MatIconModule],
  templateUrl: './notificacion.component.html',
  styleUrl: './notificacion.component.css'
})


export class NotificacionComponent implements OnInit{

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    private notificacionSnackbar: MatSnackBarRef<NotificacionComponent>
  ){}


  ngOnInit() {
    // Auto cerrar después de la duración especificada
    if (this.data.duration) {
      setTimeout(() => {
        this.dismiss();
      }, this.data.duration);
    }
  }

  dismiss() {
    this.notificacionSnackbar.dismiss();
  }
}
