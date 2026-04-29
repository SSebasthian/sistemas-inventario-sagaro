import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject  } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PermisosxrolPermisosService {


  private apiUrlRoles = 'http://localhost:8080/roles';
  private apiUrlPermisos = 'http://localhost:8080/permisos';

  // Subject para notificar cambios en permisos de roles
  private permisosDeRolActualizadosSource = new Subject<number>(); // Emite el ID del rol modificado
  permisosDeRolActualizados$ = this.permisosDeRolActualizadosSource.asObservable();

  constructor(private http: HttpClient) { }

  // ============================================
  // CRUD DE ROLES
  // ============================================

  obtenerRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlRoles}/admin`);
  }

  crearRol(rol: any): Observable<any> {
    return this.http.post(`${this.apiUrlRoles}/admin/registrar`, rol);
  }

  actualizarRol(id: number, rol: any): Observable<any> {
    return this.http.put(`${this.apiUrlRoles}/admin/${id}`, rol);
  }

  eliminarRol(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrlRoles}/admin/${id}`, { responseType: 'text' });
  }

  // ============================================
  // PERMISOS POR ROL
  // ============================================

  // Obtener todos los permisos (sin estado de asignación)
  obtenerPermisos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlPermisos}/admin`);
  }

  // Obtener todos los permisos con roles asignados (vista general)
  obtenerPermisosConRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlRoles}/admin/con-roles`);
  }


  // Obtener roles que tienen un permiso específico
  obtenerRolesPorPermiso(permisoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlPermisos}/admin/${permisoId}/roles`);
  }

  // Obtiene todos los permisos con indicación de si están asignados al rol
  obtenerPermisosConEstado(rolId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlRoles}/${rolId}/permisos-con-estado`);
  }

  // Actualiza los permisos de un rol
  actualizarPermisosDeRol(rolId: number, permisosAAgregar: number[], permisosAQuitar: number[]): Observable<any> {
    const data = {
      permisosAAgregar: permisosAAgregar,
      permisosAQuitar: permisosAQuitar
    };
    return this.http.put(`${this.apiUrlRoles}/${rolId}/permisos`, data).pipe(
      tap(() => {
        // Emitir el ID del rol modificado para notificar a los suscriptores
        this.permisosDeRolActualizadosSource.next(rolId);
      })
    );
  }
}
