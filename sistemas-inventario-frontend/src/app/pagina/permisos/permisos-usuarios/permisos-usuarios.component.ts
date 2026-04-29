import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UsuariosPermisosService } from './../../../arquitectura/servicio/permisos/usuarios-permisos.service';
import { RolPermisosService } from './../../../arquitectura/servicio/permisos/rol-permisos.service';
import { PerfilService } from '../../../arquitectura/servicio/autenticacion/perfil.service';
import { PermisoModuloService } from '../../../arquitectura/servicio/autenticacion/permiso-modulo.service';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';




@Component({
  selector: 'app-permisos-usuarios',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule, CommonModule, MatSelectModule],
  templateUrl: './permisos-usuarios.component.html',
  styleUrl: './permisos-usuarios.component.css'
})
export class PermisosUsuariosComponent {

  filtro: string = '';                  /** Texto de filtro para búsqueda de usuarios */
  usuarioSeleccionado: any = null;      /** Usuario seleccionado para edición */
  editando: boolean = false;            /** Indica si se está en modo edición */
  modoPassword: boolean = false;        /** Modo cambio de contraseña */
  verPasswordActual = false;            /** Mostrar/ocultar password actual */
  verPasswordNueva = false;             /** Mostrar/ocultar password nueva */
  modoCrearUsuario: boolean = false;    /** Modo creación de usuario */
  usuarios: any[] = [];                 /** Lista de usuarios */
  roles: any[] = [];                    /** Lista de roles disponibles */
  usuarioOriginal: string = '';         /** Usuario original antes de editar */
  nuevaClave: string = '';              /** Nueva contraseña */
  confirmarClave: string = '';          /** Confirmación de contraseña */
  mostrarModal: boolean = false;
  usuarioAEliminar: any = null;


  constructor(
    private dialog: MatDialogRef<PermisosUsuariosComponent>,
    private usuariosPermisosService: UsuariosPermisosService,
    private rolPermisosService: RolPermisosService,
    private perfilService: PerfilService,
    public permisoModuloService: PermisoModuloService,
    private notificacionSnackbarService: NotificacionSnackbarService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  /****************************************************
  /*** Obtiene la lista de usuarios desde el backend **
  *****************************************************/
  cargarUsuarios() {
    this.usuariosPermisosService.obtenerUsuariosAdmin().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Se Listaron los Usuarios');
      },
      error: (err) => {
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los usuarios');
        console.error(err);
      }
    });
  }

  /**********************************************
   * Obtiene la lista de roles desde el backend *
   **********************************************/
  cargarRoles() {
    this.rolPermisosService.obtenerRoles().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error(err)
    });
  }

  /**********************************************
   **** Compara dos roles para el select *********
   **********************************************/
  compararRoles(r1: any, r2: any) {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  /**********************************************
   ***** Vuelve a diseño listar usuarios ********
   **********************************************/
  volverLista() {
    this.editando = false;
    this.usuarioSeleccionado = null;
  }

  /**********************************************
   *** Abre formulario de edición de usuario ****
   **********************************************/
  editarUsuario(usuario: any) {
    // Verificar permiso para editar
    if (!this.permisoModuloService.puede('usuarios', 'editar')) {
      alert('No tienes permiso para editar usuarios');
      return;
    }

    this.usuarioSeleccionado = { ...usuario };
    this.usuarioOriginal = usuario.usuario;
    this.editando = true;
    this.modoPassword = false;
    console.log('Se Selecciona Usuario: ', this.usuarioSeleccionado.usuario);
  }

  /**********************************************
   **** Guarda cambios del usuario editado ******
   **********************************************/
  guardarUsuario() {

    // Verificar permiso para editar
    if (!this.permisoModuloService.puede('usuarios', 'editar')) {
      this.notificacionSnackbarService.error('Sin permiso', 'No puedes editar usuarios');
      return;
    }


    const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.usuariosPermisosService.actualizarUsuariosAdmin(this.usuarioOriginal, this.usuarioSeleccionado).subscribe({

      next: () => {
        // SI ES EL MISMO USUARIO LOGUEADO
        if (usuarioActual.usuario === this.usuarioOriginal) {

          const usuarioActualizado = {
            ...usuarioActual,
            usuario: this.usuarioSeleccionado.usuario,
            nombre: this.usuarioSeleccionado.nombre,
            rol: this.usuarioSeleccionado.rol.nombre
          };

          // ACTUALIZAR LOCALSTORAGE
          localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

          // NOTIFICAR A TODA LA APP
          this.perfilService.notificarPerfilActualizado();
        }

        // refrescar lista
        this.cargarUsuarios();

        this.editando = false;
        //console.log('Usuario actualizado correctamente');
        this.notificacionSnackbarService.success(
          'Usuario actualizado',
          `Los datos de ${this.usuarioSeleccionado.usuario} se guardaron correctamente`
        );



      },
      error: (err) => {
        this.notificacionSnackbarService.error(
          'Error al actualizar',
          err.error?.mensaje || 'No se pudo modificar el usuario'
        );
        console.error('Error', err);
      }
    });
  }

  /**********************************************
   **** Activa modo cambio de contraseña ********
   **********************************************/
  abrirPassword() {
    // Verificar permiso para cambiar contraseña
    if (!this.permisoModuloService.puede('usuarios', 'editar')) {
      alert('No tienes permiso para cambiar contraseñas');
      return;
    }
    this.modoPassword = true;
  }

  /**********************************************
   **** Guarda nueva contraseña del usuario *****
   **********************************************/
  guardarPassword() {
    if (!this.permisoModuloService.puede('usuarios', 'editar')) {
      this.notificacionSnackbarService.error('Sin permiso', 'No puedes cambiar contraseñas');
      return;
    }

    if (this.nuevaClave !== this.confirmarClave) {
      this.notificacionSnackbarService.error('Contraseñas no coinciden', 'Verifica la nueva contraseña');
      return;
    }

    this.usuariosPermisosService.cambiarClaveAdmin(this.usuarioSeleccionado.usuario, this.nuevaClave)
      .subscribe({
        next: (res: any) => {
          this.notificacionSnackbarService.success('Contraseña cambiada', res.mensaje || 'Actualizada correctamente');
          this.modoPassword = false;
          this.nuevaClave = '';
          this.confirmarClave = '';
        },
        error: (err) => {
          this.notificacionSnackbarService.error('Error', err.error?.mensaje || 'No se pudo cambiar la contraseña');
          console.error(err);
        }
      });
  }


  /**********************************************
   **** Cancela cualquier operación activa ******
   **********************************************/
  accionCancelar() {
    if (!this.editando && !this.modoPassword && !this.modoCrearUsuario) {
      this.dialog.close();
      return;
    }

    this.editando = false;
    this.modoPassword = false;
    this.modoCrearUsuario = false;
    this.usuarioSeleccionado = null;
  }


  /**********************************************
   ************ Objeto para nuevo usuario *******
   **********************************************/
  nuevoUsuario: any = {
    nombre: '',
    usuario: '',
    clave: '',
    rol: ''
  };

  /**********************************************
   ** Activa formulario de creación de usuario **
   **********************************************/
  crearUsuario() {
    // Verificar permiso para crear
    if (!this.permisoModuloService.puede('usuarios', 'crear')) {
      alert('No tienes permiso para crear usuarios');
      return;
    }

    this.modoCrearUsuario = true;
    this.editando = false;
    this.modoPassword = false;

    this.nuevoUsuario = {
      nombre: '',
      usuario: '',
      clave: '',
      rol: 2
    };
  }

  /**********************************************
   ** Guarda un nuevo usuario en el sistema *****
   **********************************************/
  guardarNuevoUsuario() {
    if (!this.permisoModuloService.puede('usuarios', 'crear')) {
      this.notificacionSnackbarService.error('Sin permiso', 'No puedes crear usuarios');
      return;
    }

    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.usuario || !this.nuevoUsuario.clave || !this.nuevoUsuario.rol) {
      this.notificacionSnackbarService.error('Campos incompletos', 'Todos los campos son obligatorios');
      return;
    }

    const data = {
      usuario: this.nuevoUsuario.usuario,
      clave: this.nuevoUsuario.clave,
      nombre: this.nuevoUsuario.nombre,
      rolId: this.nuevoUsuario.rol
    };

    this.usuariosPermisosService.registrarAdmin(data).subscribe({
      next: (res) => {
        this.notificacionSnackbarService.success('Usuario creado', res.mensaje || 'Registro exitoso');
        this.cargarUsuarios();
        this.modoCrearUsuario = false;
      },
      error: (err) => {
        this.notificacionSnackbarService.error('Error al crear', err.error?.mensaje || 'No se pudo registrar el usuario');
        console.error(err);
      }
    });
  }

  /**********************************************
   **** Filtra usuarios por nombre o usuario ****
   **********************************************/
  get usuariosFiltrados() {
    const texto = this.filtro.toLowerCase().trim();

    if (!texto) return this.usuarios;

    return this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(texto) ||
      u.usuario.toLowerCase().includes(texto)
    );
  }

  /**********************************************
   **** Elimina un usuario del sistema **********
   **********************************************/

  confirmarEliminacionUsuario(usuario: any) {
    if (!this.permisoModuloService.puede('usuarios', 'eliminar')) {
      this.notificacionSnackbarService.error('Sin permiso', 'No puedes eliminar usuarios');
      return;
    }
    this.usuarioAEliminar = usuario;
    this.mostrarModal = true;
  }

  cancelarEliminacion() {
    this.mostrarModal = false;
  }



  eliminarUsuario() {
    if (!this.usuarioAEliminar) return;

  this.usuariosPermisosService.eliminarUsuarioAdmin(this.usuarioAEliminar.usuario).subscribe({
    next: (res: any) => {
      this.notificacionSnackbarService.success('Usuario eliminado', res.mensaje || 'Eliminado correctamente');
      this.cargarUsuarios();
      this.cancelarEliminacion();
    },
    error: (err) => {
      this.notificacionSnackbarService.error('Error al eliminar', err.error?.mensaje || 'No se pudo eliminar');
      console.error(err);
      this.cancelarEliminacion();
    }
  });
  }
}
