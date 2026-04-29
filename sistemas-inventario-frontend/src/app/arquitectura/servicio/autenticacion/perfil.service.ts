import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private apiUrl = 'http://localhost:8080/usuarios/perfil';
  private readonly TIEMPO_EXPIRACION_HORAS = 1

  // Subject para notificar cambios en el perfil
  private perfilActualizado = new BehaviorSubject<boolean>(false);
  perfilActualizado$ = this.perfilActualizado.asObservable();


  // Subject para notificar cambios en permisos
  private permisosActualizados = new BehaviorSubject<any[] | null>(null);
  permisosActualizados$ = this.permisosActualizados.asObservable();


  // Clave para localStorage
  private readonly PERMISOS_STORAGE_KEY = 'permisos';

  constructor(private http: HttpClient) { }



  // ============================================
  // PERFIL DE USUARIO
  // ============================================



  // ----------------
  // OBTENER PERFIL--
  // ----------------
  // Obtiene el perfil del usuario logueado desde el backend  
  getPerfil(): Observable<any> {
    // Se obtiene el usuario guardado en el localStorage
    // Este valor se guarda al iniciar sesión
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
    // Se construye la petición GET hacia el backend
    // http://localhost:8080/usuarios/perfil/admin
    return this.http.get(`${this.apiUrl}/${usuarioGuardado.usuario}`).pipe(
      tap((datos: any) => {
        // Guardar permisos en localStorage cuando se carga el perfil
        this.guardarPermisosEnLocalStorage(datos);
      })
    );;
  }


  // --------------------
  // ACTUALIZAR PERFIL---
  // --------------------
  actualizarPerfil(usuario: string, datos: any) {
    return this.http.put(`${this.apiUrl}/${usuario}`, datos).pipe(
      tap(() => {
        this.notificarPerfilActualizado();
      })
    );;
  }



  // -----------------------
  // CAMBIAR CLAVE PERFIL---
  // -----------------------
  cambiarClave(usuario: string, actual: string, nueva: string) {
    return this.http.put(`${this.apiUrl}/${usuario}/clave`, {
      actual,
      nueva
    });
  }


  // -----------------
  // CAMBIOS PERFIL---
  // -----------------
  notificarPerfilActualizado() {
    this.perfilActualizado.next(true);
  }




  // ============================================
  // MANEJO DE PERMISOS EN LOCALSTORAGE
  // ============================================


  //Guarda los permisos del usuario en localStorage
  private guardarPermisosEnLocalStorage(datos: any): void {
    try {
      const permisosRaw = datos?.rol?.permisos || [];

      // Limpiar permisos - eliminar campos innecesarios para localStorage
      const permisosLimpios = permisosRaw.map((permiso: any) => {

        const permisoLimpio = {
          numero: permiso.id,
          modulo: permiso.modulo,
          accion: permiso.accion
        };
        return permisoLimpio;
      });

      // Ordenar los permisos por ID antes de guardar
      permisosLimpios.sort((a: any, b: any) => a.numero - b.numero);

      const permisosStorage = {
        permisos: permisosLimpios,  // Guardar versión limpia
        rol: datos?.rol?.id,
        usuario: datos?.id,
        timestamp: new Date().getTime(),
        //usuarioNombre: datos?.usuario,
        //rolNombre: datos?.rol?.nombre,
      };

      localStorage.setItem(this.PERMISOS_STORAGE_KEY, JSON.stringify(permisosStorage));
      //console.log('Permisos guardados en localStorage:', permisosLimpios.length);

      // Notificar que los permisos se actualizaron
      this.permisosActualizados.next(permisosLimpios);

    } catch (error) {
      console.error('❌ Error guardando permisos en localStorage:', error);
    }
  }

  //Obtiene los permisos desde localStorage
  obtenerPermisosLocalStorage(): any[] | null {
    try {
      const permisosData = localStorage.getItem(this.PERMISOS_STORAGE_KEY);
      if (!permisosData) return null;

      const data = JSON.parse(permisosData);

      // Opcional: Verificar expiración (1 hora)
      const expiracionMs = this.TIEMPO_EXPIRACION_HORAS * 60 * 60 * 1000;

      if (Date.now() - data.timestamp > expiracionMs) {
        //console.log('Permisos expirados, se recargarán automáticamente');
        this.limpiarPermisosLocalStorage();
        return null;
      }

      return data.permisos;

    } catch (error) {
      console.error('❌ Error leyendo permisos de localStorage:', error);
      return null;
    }
  }


  //Obtiene información completa de permisos (incluyendo rol, usuario, etc)
  obtenerInfoPermisosLocalStorage(): any | null {
    try {
      const permisosData = localStorage.getItem(this.PERMISOS_STORAGE_KEY);
      if (!permisosData) return null;

      const data = JSON.parse(permisosData);

      // Verificar expiración
      const expiracionMs = this.TIEMPO_EXPIRACION_HORAS * 60 * 60 * 1000;
      if (Date.now() - data.timestamp > expiracionMs) {
        this.limpiarPermisosLocalStorage();
        return null;
      }

      return data;

    } catch (error) {
      console.error('❌ Error leyendo info de permisos:', error);
      return null;
    }
  }


  //Verifica si el usuario tiene un permiso específico
  tienePermiso(modulo: string, accion: string): boolean {
    const permisos = this.obtenerPermisosLocalStorage();
    if (!permisos) return false;

    return permisos.some((permiso: any) =>
      permiso.modulo === modulo && permiso.accion === accion
    );
  }


  //Verifica si el usuario tiene acceso a un módulo (al menos una acción)
  tieneAccesoAModulo(modulo: string): boolean {
    const permisos = this.obtenerPermisosLocalStorage();
    if (!permisos) return false;

    return permisos.some((permiso: any) => permiso.modulo === modulo);
  }



  // Obtiene todas las acciones permitidas para un módulo
  obtenerAccionesPorModuloLocal(modulo: string): string[] {
    const permisos = this.obtenerPermisosLocalStorage();
    if (!permisos) return [];

    return permisos
      .filter((permiso: any) => permiso.modulo === modulo)
      .map((permiso: any) => permiso.accion);
  }


  //Obtiene todos los módulos a los que tiene acceso
  obtenerModulosAcceso(): string[] {
    const permisos = this.obtenerPermisosLocalStorage();
    if (!permisos) return [];

    const modulos = new Set(permisos.map((p: any) => p.modulo));
    return Array.from(modulos);
  }

  //Obtiene permisos agrupados por módulo
  obtenerPermisosAgrupados(): { [key: string]: any[] } {
    const permisos = this.obtenerPermisosLocalStorage();
    if (!permisos) return {};

    return permisos.reduce((acc: any, permiso: any) => {
      if (!acc[permiso.modulo]) {
        acc[permiso.modulo] = [];
      }
      acc[permiso.modulo].push(permiso);
      return acc;
    }, {});
  }


  //Limpia los permisos del localStorage
  limpiarPermisosLocalStorage(): void {
    localStorage.removeItem(this.PERMISOS_STORAGE_KEY);
    //console.log('Permisos eliminados de localStorage');
    this.permisosActualizados.next(null);
  }


  //Fuerza la recarga de permisos desde el backend
  recargarPermisos(): void {
    //console.log('Recargando permisos desde el backend...');
    this.getPerfil().subscribe({
      next: () => console.log('✅ Permisos recargados exitosamente'),
      error: (err) => console.error('❌ Error recargando permisos:', err)
    });
  }
}

