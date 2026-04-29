package com.registro_y_iniciosesion_backend.autenticacion;

import lombok.Data;



// ==================================================
// CLASE InicioSesionRespuesta
// DTO (Data Transfer Object) que representa la respuesta
// que se devuelve al cliente después de intentar iniciar sesión.
// ==================================================
@Data
public class InicioSesionRespuesta {

    private String mensaje;     // Mensaje de resultado del login
    private String usuario;     // Nombre de usuario
    private String nombre;      // Nombre completo del usuario
    private String rol;         // Nombre del rol asignado al usuario


    // Constructor para inicializar todos los campos
    public InicioSesionRespuesta(String mensaje, String usuario,String nombre, String rol) {
        this.mensaje = mensaje;
        this.usuario = usuario;
        this.nombre = nombre;
        this.rol = rol;
    }


}
