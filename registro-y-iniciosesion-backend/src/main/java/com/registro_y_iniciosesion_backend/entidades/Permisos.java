package com.registro_y_iniciosesion_backend.entidades;

import jakarta.persistence.*;
import lombok.Data;

@Entity                             // Indica que esta clase es una entidad (tabla en la base de datos)
@Table(name = "permisos",          // Nombre real de la tabla en la base de datos
        uniqueConstraints = @UniqueConstraint(columnNames = {"modulo", "accion"}))  // Esto evita que tengas duplicados como: usuarios.ver - usuarios.ver
@Data                               // Genera Automaticamente getters, setters, toString, equals y hashCode
public class Permisos {

    @Id                                                         // Llave primaria de la tabla
    @GeneratedValue(strategy = GenerationType.IDENTITY)         // MySQL generará el ID automáticamente (auto-increment)
    private Long id;

    @Column(nullable = false)
    private String modulo;

    @Column(nullable = false)
    private String accion;


    @Transient // Esto evita que se guarde en la base de datos
    private Long cantidadRoles;

    @Transient  // Esto evita que se guarde en la base de datos
    private Long cantidadUsuarios;

}
