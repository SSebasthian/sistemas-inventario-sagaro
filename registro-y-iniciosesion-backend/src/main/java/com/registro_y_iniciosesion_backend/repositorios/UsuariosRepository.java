package com.registro_y_iniciosesion_backend.repositorios;

import com.registro_y_iniciosesion_backend.entidades.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

// --------------------------------------------------------
// Esta interfaz es el repositorio encargado de acceder a la tabla
// "usuarios" en la base de datos mediante Spring Data JPA.
// JpaRepository proporciona automaticamente:
//  - CRUD completo (guardar, buscar, eliminar).
//  - Paginación y ordenamiento.
//  - Consultas personalizadas por nombre del metodo.
// --------------------------------------------------------

public interface UsuariosRepository extends JpaRepository<Usuarios,Long> {

    Usuarios findByUsuario(String usuario);

    //ROL
    long countByRolId(Long rolId);
    List<Usuarios> findByRolId(Long rolId);
    boolean existsByRol_Id(Long rolId);

}
