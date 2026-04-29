package com.registro_y_iniciosesion_backend.servicios;

import com.registro_y_iniciosesion_backend.entidades.Permisos;
import com.registro_y_iniciosesion_backend.entidades.Rol;
import com.registro_y_iniciosesion_backend.repositorios.PermisosRepository;
import com.registro_y_iniciosesion_backend.repositorios.UsuariosRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;


@Service
public class PermisosService {

    private final PermisosRepository permisosRepository;
    private final UsuariosRepository usuariosRepository;
    private final EntityManager entityManager;


    // Inyección del repositorio mediante el constructor
    public PermisosService(
            PermisosRepository permisosRepository,
            UsuariosRepository usuariosRepository,
            EntityManager entityManager
    ) {
        this.permisosRepository = permisosRepository;
        this.usuariosRepository = usuariosRepository;
        this.entityManager = entityManager;
    }

    // Listar todos los permisos
    public List<Permisos> listarPermisos() {
        return permisosRepository.findAll();
    }
    // Listar todos los roles existentes

    // Buscar un permiso por su ID //SE PUEDE EDITAR ELIMINAR ETC
    public Permisos buscarPorId(Long id) {
        return permisosRepository.findById(id).orElse(null);
    }


    // Crear o Editar
    public Permisos crear(Permisos permiso){
        return permisosRepository.save(permiso);
    }


    //Eliminar permisos , si existe usuario con permiso (SE BLOQUEA , NO PERMITE)
    public String eliminarPermiso(Long id) {
        boolean tieneUsuarios = permisosRepository.existsPermisoEnRol(id);

        if (tieneUsuarios) {
            return "No se puede eliminar: hay roles asociados a este permiso";
        }

        permisosRepository.deleteById(id);
        return "Permiso  eliminado correctamente";
    }



    //TRAER PERMISOS X ROL

    public List<Permisos> listarPermisosConCantidadUsuarios() {
        List<Permisos> permisos = permisosRepository.findAll();

        for (Permisos permiso : permisos) {
            // Calcular cantidad de roles que tienen este permiso
            Long cantidadRoles = contarRolesPorPermiso(permiso.getId());
            // Calcular cantidad de usuarios que tienen este permiso
            Long cantidad = contarUsuariosPorPermiso(permiso.getId());
            // Usar setter para agregar un campo temporal (necesitas modificar la entidad)
            permiso.setCantidadRoles(cantidadRoles);
            permiso.setCantidadUsuarios(cantidad);
        }

        return permisos;
    }


    // NUEVO MÉTODO: Obtener todos los permisos con los roles asignados
    public List<Map<String, Object>> obtenerPermisosConRoles() {
        List<Permisos> permisos = permisosRepository.findAll();
        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Permisos permiso : permisos) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", permiso.getId());
            item.put("modulo", permiso.getModulo());
            item.put("accion", permiso.getAccion());

            // Obtener nombres de roles que tienen este permiso
            List<String> rolesNombres = permisosRepository.findRolesNombresByPermisoId(permiso.getId());
            item.put("rolesAsignados", rolesNombres);

            resultado.add(item);
        }

        return resultado;
    }



    public Long contarUsuariosPorPermiso(Long permisoId) {
        // Consulta nativa directa con jakarta.persistence
        Query query = entityManager.createNativeQuery(
                "SELECT COUNT(DISTINCT u.id) " +
                        "FROM usuarios u " +
                        "JOIN rol r ON u.rol_id = r.id " +
                        "JOIN permisosxrol pr ON r.id = pr.id_rol " +
                        "WHERE pr.id_permiso = :permisoId"
        );
        query.setParameter("permisoId", permisoId);

        Number result = (Number) query.getSingleResult();
        return result.longValue();
    }

    public Long contarRolesPorPermiso(Long permisoId) {
        Query query = entityManager.createNativeQuery(
                "SELECT COUNT(DISTINCT pr.id_rol) " +
                        "FROM permisosxrol pr " +
                        "WHERE pr.id_permiso = :permisoId"
        );
        query.setParameter("permisoId", permisoId);

        Number result = (Number) query.getSingleResult();
        return result.longValue();
    }


    public List<Map<String, Object>> obtenerRolesPorPermiso(Long permisoId) {
        List<Object[]> resultados = permisosRepository.findRolesConUsuariosByPermisoId(permisoId);
        List<Map<String, Object>> roles = new ArrayList<>();

        for (Object[] row : resultados) {
            Map<String, Object> rol = new HashMap<>();
            rol.put("id", row[0]);
            rol.put("nombre", row[1]);
            rol.put("cantidadUsuarios", row[2]);
            roles.add(rol);
        }

        return roles;
    }


    public List<String> listarModulosUnicos() {
        return permisosRepository.findModulosUnicos();
    }

    public List<String> listarAccionesPorModulo(String modulo) {
        return permisosRepository.findAccionesByModulo(modulo);
    }

    public boolean existePermiso(String modulo, String accion) {
        return permisosRepository.existsByModuloAndAccion(modulo, accion);
    }

    public Map<String, Object> crearSiNoExiste(Permisos permiso) {
        Map<String, Object> respuesta = new HashMap<>();

        boolean existe = existePermiso(permiso.getModulo(), permiso.getAccion());

        if (existe) {
            respuesta.put("creado", false);
            respuesta.put("mensaje", "El permiso '" + permiso.getModulo() + " - " + permiso.getAccion() + "' ya existe");
            respuesta.put("permiso", null);
        } else {
            Permisos nuevo = crear(permiso);
            respuesta.put("creado", true);
            respuesta.put("mensaje", "Permiso creado correctamente");
            respuesta.put("permiso", nuevo);
        }

        return respuesta;
    }

}
