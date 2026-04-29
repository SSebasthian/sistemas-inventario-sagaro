package com.registro_y_iniciosesion_backend.autenticacion;

import lombok.Data;



// ==================================================
// CLASE InicioSesionSolicitud
// DTO (Data Transfer Object) que representa los datos
// que el cliente envía para iniciar sesión.
// ==================================================
@Data
public class InicioSesionSolicitud {

    private String usuario;  // Nombre de usuario enviado desde el cliente (formulario o JSON)
    private String clave;    // Contraseña enviada desde el cliente (formulario o JSON)

}
