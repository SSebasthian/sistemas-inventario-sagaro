import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PermisosxrolPermisosService } from '../../../arquitectura/servicio/permisos/permisosxrol-permisos.service';
import { PermisoModuloService } from '../../../arquitectura/servicio/autenticacion/permiso-modulo.service';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';



@Component({
  selector: 'app-permisos-permisosxrol',
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, FormsModule, MatTooltipModule],
  templateUrl: './permisos-permisosxrol.component.html',
  styleUrl: './permisos-permisosxrol.component.css'
})
export class PermisosPermisosxrolComponent {

  roles: any[] = [];  /** Lista de roles disponibles en el sistema  (viene del backend)*/
  permisos: any[] = []; /** Todos los permisos disponibles con estado de asignación */
  rolSeleccionado: any = null;
  filtro: string = '';
  hayCambios: boolean = false;


  // Backup para saber qué cambió
  private backupPermisos: Map<number, boolean> = new Map();


  constructor(
    private dialogRef: MatDialogRef<PermisosPermisosxrolComponent>,
    private permisosxrolPermisosService: PermisosxrolPermisosService,
    public permisoModuloService: PermisoModuloService,
    private notificacionSnackbarService: NotificacionSnackbarService
  ) {
    this.cargarRoles();
    this.cargarTodosLosPermisosConRoles();
  }


  // ============================================
  // MÉTODOS DE INICIALIZACIÓN 
  // ============================================


  cargarRoles() {
    this.permisosxrolPermisosService.obtenerRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los roles');
        console.error('Error al cargar roles:', err);
      }
    });
  }

  cargarPermisosDelRol() {
    if (!this.rolSeleccionado) return;

    this.permisosxrolPermisosService.obtenerPermisosConEstado(this.rolSeleccionado.id).subscribe({
      next: (data) => {
        //ORDENAR PERMISOS POR ID (ascendente)
        this.permisos = [...data].sort((a, b) => a.id - b.id);
        this.permisos = data;
        this.guardarBackup();
        this.hayCambios = false;
      },
      error: (err) => {
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los permisos del rol');
        console.error('Error al cargar permisos del rol:', err);
      }
    });
  }




  // ============================================
  // PROPIEDADES Y MÉTODOS AUXILIARES PARA LA VISTA
  // ============================================

  // Permisos filtrados por búsqueda
  get permisosFiltrados() {
    let resultado = this.permisos;

    if (this.filtro) {
      resultado = resultado.filter(permiso =>
        permiso.modulo.toLowerCase().includes(this.filtro.toLowerCase()) ||
        permiso.accion.toLowerCase().includes(this.filtro.toLowerCase())
      );
    }

    // Mantener orden por ID incluso después del filtro
    return [...resultado].sort((a, b) => a.id - b.id);
  }


  // Obtener SOLO los roles que tienen este permiso
  obtenerRolesConPermiso(permiso: any): any[] {
    if (!permiso.rolesAsignados || permiso.rolesAsignados.length === 0) {
      return [];
    }

    // Filtrar los roles que están en rolesAsignados
    return this.roles.filter(rol =>
      permiso.rolesAsignados.includes(rol.nombre)
    );
  }


  // Obtener nombre corto del rol (primeras 4 letras)
  getNombreCortoRol(nombre: string): string {
    return nombre.substring(0, 3).toUpperCase();
  }

  // Obtener tooltip con nombre completo
  getTooltipRol(nombre: string): string {
    return nombre.toUpperCase();
  }


  // ============================================
  // MÉTODOS PARA ASIGNACIÓN DE PERMISOS (VISTA CON ROL)
  // ============================================

  // Cuando cambia el rol seleccionado
  onRolChange() {
    //console.log('Rol seleccionado:', this.rolSeleccionado);

    if (!this.rolSeleccionado) {
      this.cargarTodosLosPermisosConRoles();
      return;
    }
    this.cargarPermisosDelRol();
  }

  cargarTodosLosPermisosConRoles() {
    //console.log('Listar todos los permisos con roles');

    // Primero obtener todos los permisos
    this.permisosxrolPermisosService.obtenerPermisos().subscribe({
      next: (permisos) => {
        //console.log('Permisos obtenidos:', permisos);

        // ORDENAR PERMISOS POR ID (ascendente)
        const permisosOrdenados = [...permisos].sort((a, b) => a.id - b.id);

        // Para cada permiso, obtener los roles que lo tienen
        const permisosConRoles: any[] = [];
        let solicitudesCompletadas = 0;

        if (permisos.length === 0) {
          this.permisos = [];
          return;
        }

        permisosOrdenados.forEach(permiso => {
          this.permisosxrolPermisosService.obtenerRolesPorPermiso(permiso.id).subscribe({
            next: (rolesAsignados) => {
              //console.log(`Permiso ${permiso.modulo}-${permiso.accion} tiene roles:`, rolesAsignados);

              permisosConRoles.push({
                ...permiso,
                rolesAsignados: rolesAsignados.map((r: any) => r.nombre)
              });

              solicitudesCompletadas++;

              // Cuando todas las solicitudes terminen, asignar a this.permisos
              if (solicitudesCompletadas === permisos.length) {
                this.permisos = [...permisosConRoles].sort((a, b) => a.id - b.id);
                //console.log('Todos los permisos con roles cargados:', this.permisos);
              }
            },
            error: (err) => {
              console.error(`Error al cargar roles para permiso ${permiso.id}:`, err);
              permisosConRoles.push({
                ...permiso,
                rolesAsignados: []
              });
              solicitudesCompletadas++;

              if (solicitudesCompletadas === permisos.length) {
                this.permisos = permisosConRoles;
              }
            }
          });
        });
      },
      error: (err) => {
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los permisos');
        console.error('❌ Error al cargar permisos:', err);
      }
    });
  }


  // Guardar backup del estado actual
  guardarBackup() {
    this.backupPermisos.clear();
    this.permisos.forEach(p => {
      this.backupPermisos.set(p.id, p.asignado);
    });
  }

  // Cuando cambia un toggle
  onToggleChange() {
    // Verificar si hay cambios respecto al backup
    this.hayCambios = this.permisos.some(p =>
      p.asignado !== this.backupPermisos.get(p.id)
    );
  }

  guardarCambios() {
    // Verificar permiso para crear
    if (!this.permisoModuloService.puede('permisos', 'asignar')) {
      this.notificacionSnackbarService.error('Sin permiso', 'No puedes asignar permisos a roles');
      return;
    }

    if (!this.hayCambios) {
      this.notificacionSnackbarService.success('Sin cambios', 'No hay modificaciones para guardar');
      return;
    }

    const permisosAAgregar = this.permisos
      .filter(p => p.asignado && !this.backupPermisos.get(p.id))
      .map(p => p.id);

    const permisosAQuitar = this.permisos
      .filter(p => !p.asignado && this.backupPermisos.get(p.id))
      .map(p => p.id);

    this.permisosxrolPermisosService.actualizarPermisosDeRol(
      this.rolSeleccionado.id,
      permisosAAgregar,
      permisosAQuitar
    ).subscribe({
      next: (respuesta) => {
        this.guardarBackup();
        this.hayCambios = false;
        this.notificacionSnackbarService.success('Permisos actualizados', 'Los cambios se guardaron correctamente');


        this.rolSeleccionado = null;  // Limpiar el rol seleccionado
        this.cargarTodosLosPermisosConRoles();
      },
      error: (err) => {
        const msg = err.error?.mensaje || 'Error al guardar los cambios';
        this.notificacionSnackbarService.error('Error', msg);
        console.error(err);
      }
    });
  }

  accionCancelar() {
    this.dialogRef.close();
  }

}


