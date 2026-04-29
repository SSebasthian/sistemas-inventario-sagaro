package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

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
