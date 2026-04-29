import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PermisosPermisosService {

  private apiUrlPermisos = 'http://localhost:8080/permisos';


  // Subject para notificar cambios en permisos
  private permisosActualizados = new BehaviorSubject<boolean>(false);
  permisosActualizados$ = this.permisosActualizados.asObservable();


  constructor(private http: HttpClient) { }

  // Método para notificar cambios
  notificarPermisosActualizados() {
    this.permisosActualizados.next(true);
  }


  // ---------------------------------------------------------
  // MÉTODO PARA PERMISOS ADMINISTRADOR
  // ---------------------------------------------------------


  // -------------------
  // OBTENER PERMISOS---
  // -------------------
  obtenerPermisos() {
    return this.http.get<any[]>(`${this.apiUrlPermisos}/admin`);
  }


  // ----------------------
  // ACTUALIZAR PERMISOS---
  // ----------------------
  actualizarPermiso(permisoId: number, datos: any) {
    return this.http.put<any>(`${this.apiUrlPermisos}/admin/${permisoId}`, datos).pipe(
      tap(() => {
        this.notificarPermisosActualizados(); // Notificar cambio
      })
    );;
  }


  // ----------------------
  // CREAR PERMISO --------
  // ----------------------
  crearPermiso(permiso: any) {
    return this.http.post(`${this.apiUrlPermisos}/admin/registrar`, permiso).pipe(
      tap(() => {
        this.notificarPermisosActualizados(); // Notificar cambio
      })
    );;
  }


  // ----------------------------------------
  // CREAR PERMISO SOLO SI NO EXISTE --------
  // ----------------------------------------
  crearPermisoSiNoExiste(permiso: any): Observable<any> {
    return this.http.post(`${this.apiUrlPermisos}/admin/crear-si-no-existe`, permiso).pipe(
      tap((respuesta) => {
        if (respuesta && (respuesta as any).creado) {
          this.notificarPermisosActualizados(); // Notificar solo si se creó
        }
      })
    );;
  }


  // -------------------------
  // ELIMINAR PERMISO --------
  // -------------------------
  eliminarPermiso(id: number) {
    return this.http.delete(`${this.apiUrlPermisos}/admin/${id}`, {
      responseType: 'text'
    }).pipe(
      tap(() => {
        this.notificarPermisosActualizados(); // Notificar cambio
      })
    );
  }


  // ============================================
  // MÓDULOS Y ACCIONES
  // ============================================


  // -------------------------------
  // OBTENER MODULOS UNICOS --------
  // -------------------------------
  obtenerModulos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlPermisos}/admin/modulos`);
  }


  // ------------------------------------
  // OBTENER ACCIONES POR MODULO --------
  // ------------------------------------
  obtenerAccionesPorModulo(modulo: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlPermisos}/admin/modulos/${modulo}/acciones`);
  }


  // ------------------------------------
  // VERIFICAR SI EXISTE UN PERMISO -----
  // ------------------------------------
  verificarPermiso(modulo: string, accion: string): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>(`${this.apiUrlPermisos}/admin/existe?modulo=${modulo}&accion=${accion}`);
  }



  // ============================================
  // ROLES POR PERMISO
  // ============================================


  // ----------------------------------------
  // OBTENER ROLES QUE TIENE UN PERMISO -----
  // ----------------------------------------
  obtenerRolesPorPermiso(permisoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlPermisos}/admin/${permisoId}/roles`);
  }

}
