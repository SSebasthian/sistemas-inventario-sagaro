package com.registro_y_iniciosesion_backend.servicios;

import com.registro_y_iniciosesion_backend.entidades.Permisos;
import com.registro_y_iniciosesion_backend.entidades.Rol;
import com.registro_y_iniciosesion_backend.repositorios.PermisosRepository;
import com.registro_y_iniciosesion_backend.repositorios.RolRepository;
import com.registro_y_iniciosesion_backend.repositorios.UsuariosRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RolService {

    private final RolRepository rolRepository;
    private final UsuariosRepository usuariosRepository;
    private final PermisosRepository permisosRepository;

    // Inyección del repositorio mediante el constructor
    public RolService(
            RolRepository rolRepository,
            UsuariosRepository usuariosRepository,
            PermisosRepository permisosRepository) {
        this.rolRepository = rolRepository;
        this.usuariosRepository = usuariosRepository;
        this.permisosRepository = permisosRepository;
    }

    // Listar todos los roles existentes
    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }

    // Buscar un rol por su ID //SE PUEDE EDITAR ELIMINAR ETC
    public Rol buscarPorId(Long id) {
        return rolRepository.findById(id).orElse(null);
    }

    // Crear o editar un rol
    public Rol crear(Rol rol) {
        return rolRepository.save(rol);
    }


    //Eliminar rol , si existe usuario con rol (SE BLOQUEA , NO PERMITE)
    public String eliminarRol(Long id) {
        boolean tieneUsuarios = usuariosRepository.existsByRol_Id(id);

        if (tieneUsuarios) {
            return "No se puede eliminar: hay usuarios con este rol";
        }

        rolRepository.deleteById(id);
        return "Rol eliminado correctamente";
    }

    public boolean existeRol(String nombre) {
        return rolRepository.findByNombre(nombre).isPresent();
    }

    public Rol actualizarRol(Long id, Rol rolActualizado) {
        Rol rolExistente = rolRepository.findById(id).orElse(null);
        if (rolExistente == null) return null;
        rolExistente.setNombre(rolActualizado.getNombre());
        return rolRepository.save(rolExistente);
    }


    /// ////////////////////////////////////////
    /// //// OBTENER ROL POR PERMISOS    ///////
    /// ////////////////////////////////////////


    /*** Obtiene todos los permisos con indicación de si están asignados al rol  */
    public List<Map<String, Object>> obtenerPermisosConEstado(Long rolId) {
        Rol rol = rolRepository.findById(rolId).orElse(null);
        if (rol == null) {
            return new ArrayList<>();
        }

        // Obtener IDs de permisos que ya tiene el rol
        Set<Long> idsPermisosAsignados = rol.getPermisos().stream()
                .map(Permisos::getId)
                .collect(Collectors.toSet());

        // Obtener todos los permisos
        List<Permisos> todosLosPermisos = permisosRepository.findAll();

        // Construir respuesta
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Permisos permiso : todosLosPermisos) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", permiso.getId());
            item.put("modulo", permiso.getModulo());
            item.put("accion", permiso.getAccion());
            item.put("asignado", idsPermisosAsignados.contains(permiso.getId()));
            resultado.add(item);
        }

        return resultado;
    }



    /*** Actualiza los permisos de un rol (asigna y desasigna)  */
    @Transactional
    public void actualizarPermisosDeRol(Long rolId, List<Long> permisosAAgregar, List<Long> permisosAQuitar) {
        Rol rol = rolRepository.findById(rolId).orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        // Agregar nuevos permisos
        if (permisosAAgregar != null) {
            for (Long permisoId : permisosAAgregar) {
                Permisos permiso = permisosRepository.findById(permisoId).orElse(null);
                if (permiso != null && !rol.getPermisos().contains(permiso)) {
                    rol.getPermisos().add(permiso);
                }
            }
        }

        // Quitar permisos
        if (permisosAQuitar != null) {
            for (Long permisoId : permisosAQuitar) {
                Permisos permiso = permisosRepository.findById(permisoId).orElse(null);
                if (permiso != null) {
                    rol.getPermisos().remove(permiso);
                }
            }
        }

        rolRepository.save(rol);
    }


}
