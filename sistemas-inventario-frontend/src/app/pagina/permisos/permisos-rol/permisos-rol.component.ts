import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RolPermisosService } from './../../../arquitectura/servicio/permisos/rol-permisos.service';
import { UsuariosPermisosService } from './../../../arquitectura/servicio/permisos/usuarios-permisos.service';
import { PerfilService } from '../../../arquitectura/servicio/autenticacion/perfil.service';
import { PermisoModuloService } from '../../../arquitectura/servicio/autenticacion/permiso-modulo.service';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';



@Component({
  selector: 'app-permisos-rol',
  imports: [CommonModule, MatIconModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule, MatAutocompleteModule],
  templateUrl: './permisos-rol.component.html',
  styleUrl: './permisos-rol.component.css'
})
export class PermisosRolComponent implements OnInit {

  filtro: string = '';
  rolSeleccionado: any = null;
  editando: boolean = false;
  modoCrearRol: boolean = false;
  verRolesxUsuarios: boolean = false;
  roles: any[] = [];
  usuariosPorRol: any[] = [];
  usuarioActual: any = null;

  // ============================================
  // VARIABLES PARA AUTOCOMPLETADO
  // ============================================
  rolesFiltradosSugerencia: any[] = [];
  buscarRolActivo: boolean = false;
  mensajeError: string = '';
  rolesFiltradosSugerenciaEditar: any[] = [];
  buscarRolEditarActivo: boolean = false;
  mensajeErrorEditar: string = '';

  mostrarModal: boolean = false;
  rolAEliminar: any = null;


  constructor(
    private dialog: MatDialogRef<PermisosRolComponent>,
    private rolPermisosService: RolPermisosService,
    private usuariosPermisosService: UsuariosPermisosService,
    private perfilService: PerfilService,
    public permisoModuloService: PermisoModuloService,
    private notificacionSnackbarService: NotificacionSnackbarService
  ) { }

  ngOnInit() {
    this.cargarRoles();
    this.cargarUsuarioActual();
  }

  nuevoRol: any = {
    nombre: ''
  };

  // Nuevo método: Cargar usuario actual para saber su rol
  cargarUsuarioActual() {
    this.perfilService.getPerfil().subscribe({
      next: (datos) => {
        this.usuarioActual = datos;
        //console.log('Usuario actual - Rol ID:', this.usuarioActual?.rol?.id);
        //console.log('Usuario actual - Rol nombre:', this.usuarioActual?.rol?.nombre);
      },
      error: (err) => {
        console.error('Error al cargar usuario actual:', err);
      }
    });
  }

  cargarRoles() {
    this.rolPermisosService.obtenerRoles().subscribe({
      next: (data) => {
        this.roles = data;
        // traer conteo por cada rol
        console.log('Se Listan Los Roles');
        this.roles.forEach(rol => {
          this.usuariosPermisosService.contarUsuariosPorRol(rol.id)
            .subscribe(count => {
              rol.usuariosxRol = count;
            });
        });
      }
    });
  }


  // ============================================
  // MÉTODOS PARA AUTOCOMPLETADO
  // ============================================

  /** Filtra roles existentes mientras escribe */
  filtrarRolesNuevos() {
    const texto = this.nuevoRol.nombre?.toLowerCase() || '';
    this.buscarRolActivo = texto.length > 0;

    if (texto.length > 0) {
      // Filtrar roles existentes que coincidan con lo que escribe
      this.rolesFiltradosSugerencia = this.roles
        .filter(rol => rol.nombre.toLowerCase().includes(texto))
        .slice(0, 10);

      // Verificar si el nombre exacto ya existe
      const existeExactamente = this.roles.some(rol =>
        rol.nombre.toLowerCase() === texto
      );

      if (existeExactamente && texto.trim() !== '') {
        this.mensajeError = `El rol "${this.nuevoRol.nombre}" ya existe`;
      } else {
        this.mensajeError = '';
      }
    } else {
      this.rolesFiltradosSugerencia = [];
      this.mensajeError = '';
    }
  }


  /** Filtra roles existentes mientras escribe en edición */
  filtrarRolesEditar() {
    const texto = this.rolSeleccionado?.nombre?.toLowerCase() || '';
    this.buscarRolEditarActivo = texto.length > 0;

    if (texto.length > 0) {
      // Excluir el rol actual de las sugerencias
      this.rolesFiltradosSugerenciaEditar = this.roles
        .filter(rol =>
          rol.id !== this.rolSeleccionado?.id && // No mostrar el rol actual
          rol.nombre.toLowerCase().includes(texto)
        )
        .slice(0, 10);

      // Verificar si el nombre exacto ya existe (excluyendo el rol actual)
      const existeExactamente = this.roles.some(rol =>
        rol.id !== this.rolSeleccionado?.id &&
        rol.nombre.toLowerCase() === texto
      );

      if (existeExactamente && texto.trim() !== '') {
        this.mensajeErrorEditar = `El rol "${texto}" ya existe`;
      } else {
        this.mensajeErrorEditar = '';
      }
    } else {
      this.rolesFiltradosSugerenciaEditar = [];
      this.mensajeErrorEditar = '';
    }
  }


  /** Limpia el mensaje de error */
  limpiarError() {
    this.mensajeError = '';
  }



  // ============================================
  // MÉTODOS CRUD
  // ============================================

  editarRol(rol: any) {
    // Verificar permiso para editar
    if (!this.permisoModuloService.puede('roles', 'editar')) {
      this.notificacionSnackbarService.error('Sin permiso', 'No puedes editar roles');
      return;
    }

    this.rolSeleccionado = { ...rol };
    console.log('Rol seleccionado para edición:', this.rolSeleccionado.nombre);
    this.editando = true;
    this.mensajeErrorEditar = '';
  }



  guardarRol() {
    // Validación local (ya la tienes con mensajeErrorEditar)
    if (this.mensajeErrorEditar) {
      this.notificacionSnackbarService.error('Nombre duplicado', this.mensajeErrorEditar);
      return;
    }

    if (!this.permisoModuloService.puede('roles', 'editar')) {
      this.notificacionSnackbarService.error('Sin permiso', 'No puedes editar roles');
      return;
    }

    const nombreNuevo = this.rolSeleccionado.nombre.trim();
    const nombreOriginal = this.rolSeleccionado.nombreOriginal; // Guarda el original al editar

    // Si el nombre no cambió, no validar
    if (nombreNuevo === nombreOriginal) {
      this.ejecutarActualizacion();
      return;
    }

    // Verificar si ya existe otro rol con ese nombre
    this.rolPermisosService.verificarRolExiste(nombreNuevo).subscribe({
      next: (resp) => {
        if (resp.existe) {
          this.mensajeErrorEditar = `El rol "${nombreNuevo}" ya existe`;
          this.notificacionSnackbarService.error('Nombre duplicado', this.mensajeErrorEditar);
        } else {
          this.ejecutarActualizacion();
        }
      },
      error: () => {
        // Si falla la verificación, asumimos que no existe e intentamos
        this.ejecutarActualizacion();
      }
    });
  }

  private ejecutarActualizacion() {
    const rolId = this.rolSeleccionado.id;
    const esMiRol = this.usuarioActual?.rol?.id === rolId;

    this.rolPermisosService.actualizarRol(this.rolSeleccionado.id, this.rolSeleccionado).subscribe({
      next: (resp) => {
        this.editando = false;
        this.cargarRoles();
        this.notificacionSnackbarService.success('Rol actualizado',
          `El rol "${this.rolSeleccionado.nombre}" se guardó correctamente`);

        if (esMiRol) {
          const usuarioLS = JSON.parse(localStorage.getItem('usuario') || '{}');
          usuarioLS.rol = this.rolSeleccionado.nombre;
          localStorage.setItem('usuario', JSON.stringify(usuarioLS));
          this.perfilService.notificarPerfilActualizado();
          this.notificacionSnackbarService.success('Perfil actualizado',
            'Tu información de rol ha sido actualizada');
        }
      },
      error: (err) => {
        let msg = 'No se pudo actualizar el rol';
        if (err.error && typeof err.error === 'string') msg = err.error;
        else if (err.error?.mensaje) msg = err.error.mensaje;
        this.notificacionSnackbarService.error('Error', msg);
      }
    });
  }



  confirmarEliminacionRol(rol: any) {
    // PRIMERO verificar permiso
    if (!this.permisoModuloService.puede('roles', 'eliminar')) {
      this.notificacionSnackbarService.error('Sin permiso', 'No puedes eliminar roles');
      return;  // No se abre el modal
    }
    // Si tiene permiso, recién abrimos el modal
    this.rolAEliminar = rol;
    this.mostrarModal = true;
  }

  cancelarEliminacion() {
    this.mostrarModal = false;
    this.rolAEliminar = null;
  }



  eliminarRol() {
    if (!this.rolAEliminar) return;

    if (!this.permisoModuloService.puede('roles', 'eliminar')) {
      this.notificacionSnackbarService.error('Sin permiso', 'No puedes eliminar roles');
      this.cancelarEliminacion();
      return;
    }

    this.rolPermisosService.eliminarRol(this.rolAEliminar.id).subscribe({
      next: (mensaje: string) => {
        if (mensaje.includes('correctamente')) {
          this.notificacionSnackbarService.success('Rol eliminado', mensaje);
        } else {
          this.notificacionSnackbarService.error('No se pudo eliminar', mensaje);
        }
        this.cargarRoles();
        this.cancelarEliminacion();
      },
      error: (err) => {
        let msg = err.error?.mensaje || 'Error al eliminar rol';
        this.notificacionSnackbarService.error('Error', msg);
        console.error(err);
        this.cancelarEliminacion();
      }
    });
  }


  crearRol() {
    // Verificar permiso para crear
    if (!this.permisoModuloService.puede('roles', 'crear')) {
      this.notificacionSnackbarService.error('Sin permiso', 'No puedes crear roles');
      return;
    }

    this.modoCrearRol = true;
    this.editando = false;
    this.mensajeError = '';

    this.nuevoRol = {
      nombre: ''
    };
  }


  /** Verifica si el rol existe antes de crearlo */
  verificarYCrearRol() {
    const nombreRol = this.nuevoRol.nombre?.trim();
    if (!nombreRol) {
      this.mensajeError = 'El nombre del rol es obligatorio';
      this.notificacionSnackbarService.error('Campo obligatorio', 'El nombre del rol es requerido');
      return;
    }

    // Verificar si ya existe un rol con el mismo nombre
    const existe = this.roles.some(rol => rol.nombre.toLowerCase() === nombreRol.toLowerCase());
    if (existe) {
      this.mensajeError = `El rol "${nombreRol}" ya existe. No se puede crear duplicados.`;
      this.notificacionSnackbarService.error('Rol duplicado', this.mensajeError);
      return;
    }
    this.crearNuevoRol();
  }


  crearNuevoRol() {
    const nombreRol = this.nuevoRol.nombre.trim();
    this.rolPermisosService.crearRol({ nombre: nombreRol }).subscribe({
      next: (resp) => {
        this.notificacionSnackbarService.success('Rol creado', `"${nombreRol}" se agregó correctamente`);
        this.modoCrearRol = false;
        this.nuevoRol = { nombre: '' };
        this.mensajeError = '';
        this.cargarRoles();
      },
      error: (err) => {
        let msg = err.error?.mensaje || 'No se pudo crear el rol';
        this.notificacionSnackbarService.error('Error', msg);
        console.error(err);
      }
    });
  }

  //Buscar rol por nombre
  get rolesFiltrados() {
    if (!this.filtro) return this.roles;

    return this.roles.filter(rol =>
      rol.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }


  volverListaRoles() {
    this.verRolesxUsuarios = false;
  }


  cantidadUsuariosRol(rol: any) {
    this.verRolesxUsuarios = true;
    this.editando = false;
    this.modoCrearRol = false;

    this.rolSeleccionado = rol;
    this.usuariosPorRol = [];

    this.usuariosPermisosService.obtenerUsuariosPorRol(rol.id).subscribe({
      next: (datos) => {
        this.usuariosPorRol = datos;
      },
      error: (err) => {
        console.error(err);
        this.usuariosPorRol = [];
      }
    })

  }


  accionCancelar() {
    if (!this.editando && !this.modoCrearRol) {
      this.dialog.close();
      return;
    }
    this.editando = false;
    this.modoCrearRol = false;
    this.rolSeleccionado = null;
  }
}
