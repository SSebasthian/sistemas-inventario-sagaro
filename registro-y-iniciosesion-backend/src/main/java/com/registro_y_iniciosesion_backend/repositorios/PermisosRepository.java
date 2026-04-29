package com.registro_y_iniciosesion_backend.repositorios;

import com.registro_y_iniciosesion_backend.entidades.Permisos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

// --------------------------------------------------------
// Esta interfaz es el repositorio encargado de acceder a la tabla
// "permisos" en la base de datos mediante Spring Data JPA.
// JpaRepository proporciona automaticamente:
//  - CRUD completo (guardar, buscar, eliminar).
//  - Paginación y ordenamiento.
//  - Consultas personalizadas por nombre del metodo.
// --------------------------------------------------------


public interface PermisosRepository extends JpaRepository<Permisos,Long> {

    @Query(value = "SELECT r.id, r.nombre, COUNT(u.id) as cantidad_usuarios " +
            "FROM rol r " +
            "JOIN permisosxrol pr ON r.id = pr.id_rol " +
            "LEFT JOIN usuarios u ON r.id = u.rol_id " +
            "WHERE pr.id_permiso = :permisoId " +
            "GROUP BY r.id, r.nombre", nativeQuery = true)
    List<Object[]> findRolesConUsuariosByPermisoId(@Param("permisoId") Long permisoId);


    @Query(value = "SELECT DISTINCT r.nombre FROM rol r " +
            "JOIN permisosxrol pr ON r.id = pr.id_rol " +
            "WHERE pr.id_permiso = :permisoId", nativeQuery = true)
    List<String> findRolesNombresByPermisoId(@Param("permisoId") Long permisoId);


    // Obtener módulos únicos
    @Query("SELECT DISTINCT p.modulo FROM Permisos p ORDER BY p.modulo")
    List<String> findModulosUnicos();

    // Obtener acciones por módulo
    @Query("SELECT DISTINCT p.accion FROM Permisos p WHERE p.modulo = :modulo ORDER BY p.accion")
    List<String> findAccionesByModulo(@Param("modulo") String modulo);

    // Verificar si existe un permiso
    boolean existsByModuloAndAccion(String modulo, String accion);

    // Verificar si un permiso está asociado a algún rol
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Rol r JOIN r.permisos p WHERE p.id = :permisoId")
    boolean existsPermisoEnRol(@Param("permisoId") Long permisoId);

    Optional<Permisos> findByModuloAndAccion(String modulo, String accion);
}
