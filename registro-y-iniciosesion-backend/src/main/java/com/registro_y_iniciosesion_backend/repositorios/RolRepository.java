package com.registro_y_iniciosesion_backend.repositorios;

import com.registro_y_iniciosesion_backend.entidades.Permisos;
import com.registro_y_iniciosesion_backend.entidades.Rol;
import com.registro_y_iniciosesion_backend.entidades.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


// --------------------------------------------------------
// Esta interfaz es el repositorio encargado de acceder a la tabla
// "rol" en la base de datos mediante Spring Data JPA.
// JpaRepository proporciona automaticamente:
//  - CRUD completo (guardar, buscar, eliminar).
//  - Paginación y ordenamiento.
//  - Consultas personalizadas por nombre del metodo.
// --------------------------------------------------------


public interface RolRepository extends JpaRepository<Rol,Long> {
    Optional<Rol> findByNombre(String nombre);
}
