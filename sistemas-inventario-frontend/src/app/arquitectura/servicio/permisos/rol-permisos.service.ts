import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolPermisosService {


  private apiUrlRoles = 'http://localhost:8080/roles';

  constructor(private http: HttpClient) { }


  // ---------------------------------------------------------
  // MÉTODO PARA ROLES ADMINISTRADOR
  // ---------------------------------------------------------


  // -------------------
  // OBTENER ROLES------
  // -------------------
  obtenerRoles() {
    return this.http.get<any[]>(`${this.apiUrlRoles}/admin`);
  }


  // ----------------------
  // ACTUALIZAR ROLES------
  // ----------------------
  actualizarRol(rolId: number, datos: any) {
    return this.http.put<any>(`${this.apiUrlRoles}/admin/${rolId}`, datos);
  }

  verificarRolExiste(nombre: string): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>(`${this.apiUrlRoles}/admin/existe?nombre=${nombre}`);
  }

  // ----------------------
  // CREAR ROL-------------
  // ----------------------
  crearRol(rol: any) {
    return this.http.post(`${this.apiUrlRoles}/admin/registrar`, rol);
  }


  // --------------------
  // ELIMINAR ROLES------
  // --------------------
  eliminarRol(id: number) {
    return this.http.delete(`${this.apiUrlRoles}/admin/${id}`, {
      responseType: 'text'
    });
  }



}
