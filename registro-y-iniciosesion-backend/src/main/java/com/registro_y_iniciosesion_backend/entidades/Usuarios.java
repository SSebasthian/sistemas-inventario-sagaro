package com.registro_y_iniciosesion_backend.entidades;

import jakarta.persistence.*;
import lombok.Data;

@Entity                         // Indica que esta clase es una entidad (tabla en la base de datos)
@Table(name = "usuarios")       // Nombre real de la tabla en la base de datos
@Data                           // Genera Automaticamente getters, setters, toString, equals y hashCode
public class Usuarios {
    @Id                                                     // Llave primaria de la tabla
    @GeneratedValue(strategy = GenerationType.IDENTITY)     // MySQL generará el ID automáticamente (auto-increment)
    private Long id;

    @Column(unique = true, nullable = false)              // Usuario Unico
    private String usuario;
    private String nombre;
    private String clave;
    private Boolean activo = true;

    @ManyToOne                          // Muchos usuarios pueden tener un solo rol
    @JoinColumn(name = "rol_id")        // Columna FK que apunta a la tabla 'rol'
    private Rol rol;
}
