import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { PermisosPerfilComponent } from '../../permisos/permisos-perfil/permisos-perfil.component';
import { PermisosUsuariosComponent } from '../../permisos/permisos-usuarios/permisos-usuarios.component';
import { PermisosRolComponent } from '../../permisos/permisos-rol/permisos-rol.component';
import { PermisosPermisosxrolComponent } from '../../permisos/permisos-permisosxrol/permisos-permisosxrol.component';
import { PermisosPermisosComponent } from '../../permisos/permisos-permisos/permisos-permisos.component';
import { PermisosxrolPermisosService } from '../../../arquitectura/servicio/permisos/permisosxrol-permisos.service';
import { AutenticadorService } from '../../../arquitectura/servicio/autenticacion/autenticador.service';
import { PerfilService } from '../../../arquitectura/servicio/autenticacion/perfil.service';
import { PermisosPermisosService } from '../../../arquitectura/servicio/permisos/permisos-permisos.service';
import { PermisoModuloService } from '../../../arquitectura/servicio/autenticacion/permiso-modulo.service';
import { Subscription } from 'rxjs';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';



@Component({
  selector: 'app-perfil',
  imports: [MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {

  // Variable donde se almacenan los datos del usuario
  Usuario: any;
  permisosAgrupados: { [key: string]: any[] } = {};
  moduloSeleccionado: string = '';
  accionesFiltradas: any[] = [];
  modulosUnicos: string[] = [];
  mostrarModal: boolean = false;


  private subscriptions = new Subscription(); // Para manejar suscripciones


  // Inyección del servicio que se conecta con el backend
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private autenticadorService: AutenticadorService,
    private perfilService: PerfilService,
    private permisosxrolPermisosService: PermisosxrolPermisosService,
    private permisosPermisosService: PermisosPermisosService,
    public permisoModuloService: PermisoModuloService,
    private notificacionSnackbarService: NotificacionSnackbarService
  ) { }

  // Método que se ejecuta al cargar el componente
  ngOnInit() {
    // 1. Verificar sesión
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      this.router.navigate(['/autenticacion/acceso']);
      return;
    }

    // 2. Cargar perfil inicial
    this.cargarPerfil();

    // 3. ESCUCHAR CAMBIOS DEL DIALOG - EDITAR PERFIL
    this.subscriptions.add(
      this.perfilService.perfilActualizado$.subscribe(() => {
        this.cargarPerfil();
      })
    );

    // 4. ESCUCHAR CAMBIOS EN PERMISOS DE ROLES
    this.subscriptions.add(
      this.permisosxrolPermisosService.permisosDeRolActualizados$.subscribe((rolIdModificado) => {
        //console.log(`Rol ${rolIdModificado} ha cambiado sus permisos`);

        // Verificar si el rol modificado es el del usuario actual
        if (this.Usuario?.rol?.id === rolIdModificado) {
          //console.log('Actualizando perfil porque el rol del usuario cambió');
          this.cargarPerfil();
        }
      })
    );

    // 5: ESCUCHAR CAMBIOS EN PERMISOS (cuando se crean/editan/eliminan)
    this.subscriptions.add(
      this.permisosPermisosService.permisosActualizados$.subscribe(() => {
        //console.log('Los permisos han sido modificados');

        // Verificar si el usuario actual tiene algún permiso afectado
        // Recargamos el perfil para actualizar los permisos del usuario
        if (this.Usuario?.rol?.permisos) {
          //console.log('Actualizando perfil porque los permisos cambiaron');
          this.cargarPerfil();
        }
      })
    );
  }

  ngOnDestroy() {
    // Limpiar suscripciones para evitar memory leaks
    this.subscriptions.unsubscribe();
  }

  confirmarCierreSesion(): void {
    this.mostrarModal = true;
  }

  cancelarCierreSesion(): void {
    this.mostrarModal = false;
  }

  cerrarSesion() {
    // Oculta el modal si estaba abierto
    this.mostrarModal = false;
    // Llamamos al método del servicio para cerrar sesión
    this.autenticadorService.cerrarSesion();
    // Mostrar notificación de éxito
    this.notificacionSnackbarService.success('Sesión cerrada', 'Has cerrado sesión correctamente');
    // limpiar consola o estado
    this.Usuario = null;
    // Redirigir a la página de inicio de sesión
    this.router.navigate(['/autenticacion/acceso']);
  }


  //DIALOGOS PARA PERMISOS


  permisosPerfil() {
    const dialogRef = this.dialog.open(PermisosPerfilComponent, {
      width: '800px',
      height: '350px'
    });

    dialogRef.afterClosed().subscribe((resultado) => {

      // Si el dialog devolvió true → recargar perfil
      if (resultado) {
        this.cargarPerfil();
      }

    });
  }

  permisosUsuarios() {
    this.dialog.open(PermisosUsuariosComponent, {
      width: '800px',
      height: '455px'
    });
  }

  permisosRol() {
    this.dialog.open(PermisosRolComponent, {
      width: '800px',
      height: '400px'
    });
  }

  permisosPermisos() {
    this.dialog.open(PermisosPermisosComponent, {
      width: '800px',
      height: '500px'
    });

  }

  permisosxRol() {
    this.dialog.open(PermisosPermisosxrolComponent, {
      width: '800px',
      height: '505px'
    });
  }


  cargarPerfil() {
    // Intentar cargar desde localStorage primero (opcional - para UI más rápida)
    const permisosCache = this.perfilService.obtenerPermisosLocalStorage();
    const infoCache = this.perfilService.obtenerInfoPermisosLocalStorage();

    if (permisosCache && infoCache) {
      // Construir un objeto usuario temporal con los datos de caché
      const usuarioTemp = {
        id: infoCache.usuarioId,
        usuario: infoCache.usuario,
        rol: {
          id: infoCache.rolId,
          nombre: infoCache.rolNombre,
          permisos: permisosCache
        }
      };

      // Mostrar datos desde caché instantáneamente
      this.Usuario = usuarioTemp;
      this.agruparPermisosDesdeCache(permisosCache);
      //console.log('Mostrando permisos desde localStorage (caché)');
    }

    // Siempre cargar desde backend para actualizar
    this.perfilService.getPerfil().subscribe({
      next: (datos) => {
        this.Usuario = datos;
        this.agruparPermisos();
        //console.log('Perfil y permisos cargados correctamente');
        //console.log('Permisos guardados en localStorage:', this.perfilService.obtenerPermisosLocalStorage()?.length);
      },
      error: (err) => {
        console.error(err);
        console.error('❌ Error cargando perfil:', err);
        this.router.navigate(['/autenticacion/acceso']);
      }
    });
  }


  agruparPermisos() {
    const permisos = this.Usuario?.rol?.permisos || [];

    //ORDENAR PRIMERO POR ID
    permisos.sort((a: any, b: any) => a.id - b.id);

    this.permisosAgrupados = permisos.reduce((acc: any, permiso: any) => {

      if (!acc[permiso.modulo]) {
        acc[permiso.modulo] = [];
      }

      acc[permiso.modulo].push(permiso);

      return acc;
    }, {});
    // módulos únicos
    this.modulosUnicos = Object.keys(this.permisosAgrupados);

    // seleccionar primero automáticamente
    if (this.modulosUnicos.length > 0) {
      this.seleccionarModulo(this.modulosUnicos[0]);
    }
  }

  // Método adicional para agrupar desde caché
  agruparPermisosDesdeCache(permisos: any[]) {
    if (!permisos || permisos.length === 0) return;

    const permisosOrdenados = [...permisos].sort((a: any, b: any) => a.id - b.id);

    this.permisosAgrupados = permisosOrdenados.reduce((acc: any, permiso: any) => {
      if (!acc[permiso.modulo]) {
        acc[permiso.modulo] = [];
      }
      acc[permiso.modulo].push(permiso);
      return acc;
    }, {});

    this.modulosUnicos = Object.keys(this.permisosAgrupados);

    if (this.modulosUnicos.length > 0) {
      this.seleccionarModulo(this.modulosUnicos[0]);
    }
  }

  seleccionarModulo(modulo: string) {
    this.moduloSeleccionado = modulo;

    const lista = this.permisosAgrupados[modulo] || [];

    // ordenar acciones por id también
    this.accionesFiltradas = lista
      .sort((a: any, b: any) => a.id - b.id)
      .map((p: any) => p.accion);
  }

  ordenarModulos = (a: any, b: any): number => {
    const aMin = Math.min(...a.value.map((x: any) => x.id));
    const bMin = Math.min(...b.value.map((x: any) => x.id));

    return aMin - bMin;
  };

}



