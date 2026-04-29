package com.registro_y_iniciosesion_backend.controladores;


import com.registro_y_iniciosesion_backend.autenticacion.InicioSesionRespuesta;
import com.registro_y_iniciosesion_backend.autenticacion.InicioSesionSolicitud;
import com.registro_y_iniciosesion_backend.autenticacion.RegistroRespuesta;
import com.registro_y_iniciosesion_backend.autenticacion.RegistroSolicitud;
import com.registro_y_iniciosesion_backend.entidades.Rol;
import com.registro_y_iniciosesion_backend.repositorios.RolRepository;
import com.registro_y_iniciosesion_backend.entidades.Usuarios;
import com.registro_y_iniciosesion_backend.servicios.PermisosService;
import com.registro_y_iniciosesion_backend.servicios.RolService;
import com.registro_y_iniciosesion_backend.servicios.UsuariosService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/usuarios")
public class UsuariosController {

    private final UsuariosService usuariosService;
    private final RolService rolService;
    private final PermisosService permisosService;

    // Inyección del servicio mediante constructor
    public UsuariosController(UsuariosService usuariosService, RolService rolService, PermisosService permisosService) {
        this.usuariosService = usuariosService;
        this.rolService = rolService;
        this.permisosService = permisosService;
    }

    // Crear usuario (POST /usuarios)
    @PostMapping
    public Usuarios crearUsuario(@RequestBody Usuarios usuario) {
        return usuariosService.crear(usuario);
    }

    // Buscar por ID (GET /usuarios/{id})
    @GetMapping("/{id}")
    public Usuarios buscarPorId(@PathVariable Long id) {
        return usuariosService.buscarPorId(id);
    }

    // Buscar usuario por nombre (GET /usuarios/buscar/{usuario})
    @GetMapping("/buscar/{usuario}")
    public Usuarios buscarPorUsuario(@PathVariable String usuario) {
        return usuariosService.buscarPorUsuario(usuario);
    }


    //REGISTRAR USUARIO (POST /usuarios/registrar)
    @PostMapping("/registrar")
    public RegistroRespuesta registrar(@RequestBody RegistroSolicitud usuario) {
        return usuariosService.registrar(usuario);
    }


    //INICIAR SESION (POST /usuarios/inicio-sesion)
    @PostMapping("/inicio-sesion")
    public InicioSesionRespuesta login(@RequestBody InicioSesionSolicitud loginRequest) {
        return usuariosService.login(loginRequest.getUsuario(), loginRequest.getClave());
    }

    //MOSTRAR PERFIL POR USUARIO (POST /usuarios/perfil)
    @GetMapping("/perfil/{usuario}")
    public Usuarios obtenerPerfil(@PathVariable String usuario) {
        return usuariosService.buscarPorUsuario(usuario);
    }

    //ACTUALIZAR PERFIL
    @PutMapping("/perfil/{usuario}")
    public Usuarios actualizarPerfil(@PathVariable String usuario, @RequestBody Usuarios usuarios) {
        return usuariosService.actualizarPerfil(usuario, usuarios);
    }

    //ACTUALIZAR PERFIL CONTRASEÑA
    @PutMapping("/perfil/{usuario}/clave")
    public Map<String, String> cambiarClave(@PathVariable String usuario, @RequestBody Map<String, String> datos) {

        String mensaje = usuariosService.cambiarClave(
                usuario,
                datos.get("actual"),
                datos.get("nueva")
        );

        return Map.of("mensaje", mensaje);
    }

    //LISTAR USUARIOS (GET /usuarios)
    @GetMapping("/admin")
    public List<Usuarios> listarUsuarios() {
        return usuariosService.listar();
    }


    //EDITAR USUARIOS
    @PutMapping("/admin/{usuario}")
    public Usuarios actualizarUsuarioAdmin(@PathVariable String usuario, @RequestBody Usuarios datos) {
        return usuariosService.actualizarUsuarioAdmin(usuario, datos);
    }

    //EDITAR USUARIO CONTRASEÑA
    @PutMapping("/admin/{usuario}/clave")
    public Map<String, String> cambiarClaveAdmin(@PathVariable String usuario, @RequestBody Map<String, String> datos) {

        String mensaje = usuariosService.cambiarClaveAdmin(
                usuario,
                datos.get("nueva")
        );
        return Map.of("mensaje", mensaje);
    }

    //CREAR USUARIO DESDE ADMIN
    @PostMapping("/admin/registrar")
    public RegistroRespuesta registrarAdmin(@RequestBody RegistroSolicitud datos) {
        return usuariosService.registrarAdmin(datos);
    }

    //ELIMINAR USUARIO
    @DeleteMapping("/admin/{usuario}")
    public Map<String, String> eliminarUsuario(@PathVariable String usuario) {
        usuariosService.eliminarUsuario(usuario);
        return Map.of("mensaje", "Usuario eliminado correctamente");
    }

    //////////////////////////////////
    ////////////// ROL ///////////////
    //////////////////////////////////

    //OBTENER ROL
    @GetMapping("/admin/roles")
    public List<Rol> listarRoles() {
        return rolService.listarRoles();
    }

    //OBTENER CANTIDAD DE ROLES X USUARIO
    @GetMapping("/admin/roles/{rolId}/cantidad")
    public long contarUsuariosPorRol(@PathVariable Long rolId) {
        return usuariosService.contarUsuarioPorRol(rolId);
    }

    //OBTENER INFORMACION USUARIO X ROL
    @GetMapping("/admin/roles/{rolId}")
    public List<Usuarios> obtenerUsuariosPorRol(@PathVariable Long rolId) {
        return usuariosService.buscarUsuarioPorRol(rolId);
    }

    //////////////////////////////////
    //////////// PERMISO /////////////
    //////////////////////////////////

}


/// //////////////////////////////////////////////////////////////////////////////
/// /////////////////////// COMO PROBAR EN POSTMAN  //////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////

// 1 . REGISTRAR Un Usuario
//     Metodo: POST
//     URL: http://localhost:8080/usuarios/registrar
//     Body -> raw -> JSON
//        {
//           "usuario": "admin",
//           "nombre": "Administrador",
//           "clave": "1234"
//       }


// 2. INICIAR SESION USUARIO
//    Metodo: POST
//    URL: http://localhost:8080/usuarios/inicio-sesion
//     Body -> raw -> JSON
//      {
//         "usuario": "prueba",
//         "nombre": "Esta Prueba",
//      }


// 3. Buscar Un Usuarios Por Usuario
//    Metodo: GET
//    URL: http://localhost:8080/usuarios/perfil/admin


//CORREGIR

// 3. Listar Todos Los Usuarios
//    Metodo: GET
//     URL: http://localhost:8080/usuarios


