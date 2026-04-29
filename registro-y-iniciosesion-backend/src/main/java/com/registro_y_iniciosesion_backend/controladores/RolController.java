package com.registro_y_iniciosesion_backend.controladores;
import com.registro_y_iniciosesion_backend.entidades.Rol;
import com.registro_y_iniciosesion_backend.servicios.PermisosService;
import com.registro_y_iniciosesion_backend.servicios.RolService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("roles")
public class RolController {


    private final RolService rolService;
    private final PermisosService permisosService;

    // Inyección del servicio mediante constructor
    public RolController(RolService rolService,  PermisosService permisosService) {
        this.rolService = rolService;
        this.permisosService = permisosService;
    }

    // Listar todos los permisos (GET /permisos)
    @GetMapping("/admin")
    public List<Rol> listarRoles() {
        return rolService.listarRoles();
    }

    // Editar Rol
    @PutMapping("/admin/{id}")
    public Rol editarRol(@PathVariable Long id, @RequestBody Rol datos) {
        return rolService.actualizarRol(id, datos);
    }

    //Eliminar Rol
    @DeleteMapping("/admin/{id}")
    public String  eliminarRol(@PathVariable Long id) {
        return rolService.eliminarRol(id);
    }

    // Crear un rol (POST /roles)
    @PostMapping("/admin/registrar")
    public Rol crearRol(@RequestBody Rol rol) {
        return rolService.crear(rol);
    }

    // Buscar un permiso por ID (GET /permisos/{id})
    @GetMapping("/admin/{rolId}")
    public Rol buscarPorId(@PathVariable Long id) {
        return rolService.buscarPorId(id);
    }


    @GetMapping("/admin/existe")
    public Map<String, Boolean> verificarRol(@RequestParam String nombre) {
        boolean existe = rolService.existeRol(nombre);
        return Map.of("existe", existe);
    }

    ////////////////////////////////////////
    //////////// PERMISO x ROL /////////////
    ////////////////////////////////////////


    /*** Obtiene todos los permisos con indicación de si están asignados al rol  */
    @GetMapping("/{rolId}/permisos-con-estado")
    public List<Map<String, Object>> obtenerPermisosConEstado(@PathVariable Long rolId) {
        return rolService.obtenerPermisosConEstado(rolId);
    }

    /*** Actualiza los permisos de un rol (asigna y desasigna)  */
    @PutMapping("/{rolId}/permisos")
    public Map<String, String> actualizarPermisosDeRol(
            @PathVariable Long rolId,
            @RequestBody Map<String, List<Long>> datos) {

        List<Long> permisosAAgregar = datos.get("permisosAAgregar");
        List<Long> permisosAQuitar = datos.get("permisosAQuitar");

        rolService.actualizarPermisosDeRol(rolId, permisosAAgregar, permisosAQuitar);

        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Permisos actualizados correctamente");
        return respuesta;
    }




}



/////////////////////////////////////////////////////////////////////////////////
////////////////////////// COMO PROBAR EN POSTMAN  //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


// 1 . Crear Un Rol
//     Metodo: POST
//     URL: http://localhost:8080/roles
//     Body -> raw -> JSON

//        {
//            "nombre": "Administrador"
//        }


// 2. Listar Todos Los Roles
//    Metodo: GET
//     URL: http://localhost:8080/roles


// 3. Buscar Un Rol Por ID
//    Metodo: GET
//    URL: http://localhost:8080/roles/1



// 4. Agregar Permiso a Un ROl
//    Metodo: POST
//    URL: http://localhost:8080/roles/1/agregar-permiso/1


/////////////////////////////////////////////////////////////////////////////////

