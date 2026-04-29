package com.registro_y_iniciosesion_backend.controladores;

import com.registro_y_iniciosesion_backend.entidades.Permisos;
import com.registro_y_iniciosesion_backend.servicios.PermisosService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/permisos")
public class PermisosController {

    private final PermisosService permisosService;

    // Inyección del servicio mediante constructor
    public PermisosController(PermisosService permisosService){
        this.permisosService = permisosService;
    }

    // Listar todos los permisos (GET /permisos)
    @GetMapping("/admin")
    public List<Permisos> listarPermisos() {
        return permisosService.listarPermisosConCantidadUsuarios();
    }

    // Editar Permiso
    @PutMapping("/admin/{id}")
    public Permisos editarPermisos(@PathVariable Long id, @RequestBody Permisos datos) {
        Permisos permisos = permisosService.buscarPorId(id);
        if (permisos == null) return null;
        permisos.setModulo(datos.getModulo());
        permisos.setAccion(datos.getAccion());
        return permisosService.crear(permisos);
    }

    //Eliminar Permiso
    @DeleteMapping("/admin/{id}")
    public String  eliminarPermisos(@PathVariable Long id) {
        return permisosService.eliminarPermiso(id);
    }


    // Crear un rol (POST /roles)
    @PostMapping("/admin/registrar")
    public Permisos crearPermiso(@RequestBody Permisos permisos) {
        return permisosService.crear(permisos);
    }


    // Buscar un permiso por ID (GET /permisos/{id})
    @GetMapping("/admin/{rolId}")
    public Permisos buscarPorId(@PathVariable Long id) {
        return permisosService.buscarPorId(id);
    }


    //TRAER PERMISOS X ROL

    @GetMapping("/admin/{permisoId}/roles")
    public List<Map<String, Object>> obtenerRolesPorPermiso(@PathVariable Long permisoId) {
        return permisosService.obtenerRolesPorPermiso(permisoId);
    }

    // Obtener todos los módulos únicos
    @GetMapping("/admin/modulos")
    public List<String> listarModulos() {
        return permisosService.listarModulosUnicos();
    }

    @GetMapping("/admin/modulos/{modulo}/acciones")
    public List<String> listarAccionesPorModulo(@PathVariable String modulo) {
        return permisosService.listarAccionesPorModulo(modulo);
    }

    // Verificar si un permiso existe
    @GetMapping("/admin/existe")
    public Map<String, Boolean> verificarPermiso(
            @RequestParam String modulo,
            @RequestParam String accion) {
        boolean existe = permisosService.existePermiso(modulo, accion);
        return Map.of("existe", existe);
    }

    // Crear permiso solo si no existe
    @PostMapping("/admin/crear-si-no-existe")
    public Map<String, Object> crearPermisoSiNoExiste(@RequestBody Permisos permiso) {
        return permisosService.crearSiNoExiste(permiso);
    }

}




/////////////////////////////////////////////////////////////////////////////////
////////////////////////// COMO PROBAR EN POSTMAN  //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


// 1 . Crear Un Permiso
//     Metodo: POST
//     URL: http://localhost:8080/permisos
//     Body -> raw -> JSON

//        {
//            "nombre": "inventario_equipos"
//        }


// 2. Listar Todos Los Permisos
//    Metodo: GET
//     URL: http://localhost:8080/permisos


// 3. Buscar Un Permiso Por ID
//    Metodo: GET
//    URL: http://localhost:8080/permisos/1


/////////////////////////////////////////////////////////////////////////////////

