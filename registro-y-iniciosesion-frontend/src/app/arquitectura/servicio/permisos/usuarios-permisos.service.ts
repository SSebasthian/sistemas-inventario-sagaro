import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { registroRespuesta } from '../../interface/registroRespuesta.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosPermisosService {

  private apiUrlUsuarios = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) { }


  // ---------------------------------------------------------
  // MÉTODO PARA USUARIOS ADMINISTRADOR
  // ---------------------------------------------------------


  // -------------------
  // OBTENER USUARIOS---
  // -------------------
  obtenerUsuariosAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlUsuarios}/admin`);
  }


  // ----------------------
  // ACTUALZIAR USUARIOS---
  // ----------------------
  actualizarUsuariosAdmin(usuario: string, datos: any) {
    return this.http.put(`${this.apiUrlUsuarios}/admin/${usuario}`, datos);
  }


  // -----------------------------
  // REGISTRAR USUARIOS (ADMIN)---
  // -----------------------------
  registrarAdmin(data: any) {
    return this.http.post<registroRespuesta>(`${this.apiUrlUsuarios}/admin/registrar`, data);
  }

  // ---------------------------
  // CABMIAR USUARIOS (ADMIN)---
  // ---------------------------
  cambiarClaveAdmin(usuario: string, nueva: string) {
    return this.http.put(`${this.apiUrlUsuarios}/admin/${usuario}/clave`, {
      nueva
    });
  }


  // --------------------
  // ELIMINAR USUARIOS---
  // --------------------
  eliminarUsuarioAdmin(usuario: string) {
    return this.http.delete(`${this.apiUrlUsuarios}/admin/${usuario}`);
  }



  // ---------------------------------------------------------
  // USUARIOS POR ROL
  // ---------------------------------------------------------


  // --------------------------
  // OBTENER USUARIOS X ROL ---
  // --------------------------
  obtenerUsuariosPorRol(rolId: number) {
    return this.http.get<any[]>(`${this.apiUrlUsuarios}/admin/roles/${rolId}`);
  }



  // --------------------------
  // CONTTAR USUARIOS X ROL ---
  // --------------------------
  contarUsuariosPorRol(rolId: number) {
    return this.http.get<number>(`${this.apiUrlUsuarios}/admin/roles/${rolId}/cantidad`);
  }

}
