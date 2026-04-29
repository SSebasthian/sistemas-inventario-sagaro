package com.registro_y_iniciosesion_backend.entidades;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity                 // Indica que esta clase es una entidad (tabla en la base de datos)
@Table(name = "rol")    // Nombre real de la tabla en la base de datos
@Data                   // Genera Automaticamente getters, setters, toString, equals y hashCode
public class Rol {

    @Id                                                      // Llave primaria de la tabla
    @GeneratedValue(strategy = GenerationType.IDENTITY)      // MySQL generará el ID automáticamente (auto-increment)
    private Long id;

    @Column(nullable = false, unique = true)                // No permite nulos y debe ser único
    private String nombre;

    @ManyToMany(fetch = FetchType.EAGER)                    // Relación muchos-a-muchos
    @JoinTable(
            name = "permisosxrol",                           // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "id_rol"),
            inverseJoinColumns = @JoinColumn(name = "id_permiso")
    )
    private Set<Permisos> permisos = new HashSet<>();        // Conjunto de permisos asignados al rol
}
