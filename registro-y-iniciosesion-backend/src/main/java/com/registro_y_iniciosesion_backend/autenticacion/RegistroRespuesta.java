package com.registro_y_iniciosesion_backend.autenticacion;

import lombok.Data;



// ==================================================
// CLASE RegistroRespuesta
// DTO (Data Transfer Object) que representa la respuesta
// que se devuelve al cliente después de intentar Registrarse.
// ==================================================
@Data
public class RegistroRespuesta {

    private String mensaje;     // Mensaje de resultado del registro
    private String usuario;     // Nombre de usuario
    private String nombre;      // Nombre completo del usuario
    private String rol;         // Nombre del rol asignado al usuario

    // Constructor para inicializar todos los campos
    public RegistroRespuesta(String mensaje, String usuario, String nombre, String rol) {
        this.mensaje = mensaje;
        this.usuario = usuario;
        this.nombre = nombre;
        this.rol = rol;
    }
}
