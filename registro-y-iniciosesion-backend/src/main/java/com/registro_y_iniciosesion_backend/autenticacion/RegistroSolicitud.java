package com.registro_y_iniciosesion_backend.autenticacion;

import lombok.Data;


// ==================================================
// CLASE RegistroSolicitud
// DTO (Data Transfer Object) que representa los datos
// que el cliente envía para registrarse.
// ==================================================
@Data
public class RegistroSolicitud {

    private Long rolId;
    private String usuario;     // Usuario enviado desde el cliente (formulario o JSON)
    private String nombre;      // Nombre de usuario enviado desde el cliente (formulario o JSON)
    private String clave;       // Contraseña enviada desde el cliente (formulario o JSON)
}
