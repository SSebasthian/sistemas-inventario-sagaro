
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { inicioSesionSolicitud } from '../../interface/inicioSesionSolicitud.interface';
import { inicioSesionRespuesta } from '../../interface/inicioSesionRespuesta.interface';
import { registroSolicitud } from '../../interface/registroSolicitud.interface';
import { registroRespuesta } from '../../interface/registroRespuesta.interface';
import { PerfilService } from './perfil.service';



@Injectable({
  providedIn: 'root'
})
export class AutenticadorService {

  // URL base del backend donde están los endpoints de usuarios
  private apiUrl = 'http://localhost:8080/';
  private perfilActualizado = new BehaviorSubject<boolean>(false);
  perfilActualizado$ = this.perfilActualizado.asObservable();


  constructor(
    private http: HttpClient,
    private perfilService: PerfilService
  ) { }



  // ============================================
  // AUTENTICACION
  // ============================================


  // --------------------
  // INICIAR SESIÓN -----
  // --------------------
  inicioSesion(data: inicioSesionSolicitud): Observable<inicioSesionRespuesta> {
    return this.http.post<inicioSesionRespuesta>(`${this.apiUrl}usuarios/inicio-sesion`, data);
  }


  // -----------------------
  // REGISTRAR USUARIO -----
  // -----------------------
  registro(data: registroSolicitud): Observable<registroRespuesta> {
    return this.http.post<registroRespuesta>(`${this.apiUrl}usuarios/registrar`, data);
  }


  // ----------------
  // CERRAR PERFIL---
  // ----------------
  cerrarSesion() {
    // Limpiar permisos antes de cerrar sesión
    this.perfilService.limpiarPermisosLocalStorage();
    // Elimina el usuario del localStorage para cerrar sesión
    localStorage.removeItem('usuario');
  }
  


  // ----------------------------------
  // VERIFICAR SI HAY SESION ACTIVA ---
  // ----------------------------------
  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuario');
  }

  

}