import { Injectable } from '@angular/core';
import { PerfilService } from './perfil.service';


@Injectable({
  providedIn: 'root'
})
export class PermisoModuloService {

  constructor(private perfilService: PerfilService) { }

  
  /**
   * Helper rápido para verificar permisos en templates
   * Uso: *ngIf="permisosHelper.puede('usuarios', 'crear')"
   */
  puede(modulo: string, accion: string): boolean {
    return this.perfilService.tienePermiso(modulo, accion);
  }


   /**
   * Verifica acceso a módulo
   * Uso: *ngIf="permisosHelper.tieneModulo('productos')"
   */
  tieneModulo(modulo: string): boolean {
    return this.perfilService.tieneAccesoAModulo(modulo);
  }


  /**
   * Obtiene acciones de un módulo
   * Uso: *ngFor="let accion of permisosHelper.accionesDeModulo('usuarios')"
   */
  accionesDeModulo(modulo: string): string[] {
    return this.perfilService.obtenerAccionesPorModuloLocal(modulo);
  }


  /**
   * Verifica si tiene alguno de varios permisos (OR lógico)
   */
  tieneAlgunPermiso(permisosRequeridos: { modulo: string, accion: string }[]): boolean {
    return permisosRequeridos.some(permiso => 
      this.perfilService.tienePermiso(permiso.modulo, permiso.accion)
    );
  }


  /**
   * Verifica si tiene todos los permisos requeridos (AND lógico)
   */
  tieneTodosPermisos(permisosRequeridos: { modulo: string, accion: string }[]): boolean {
    return permisosRequeridos.every(permiso => 
      this.perfilService.tienePermiso(permiso.modulo, permiso.accion)
    );
  }
}
