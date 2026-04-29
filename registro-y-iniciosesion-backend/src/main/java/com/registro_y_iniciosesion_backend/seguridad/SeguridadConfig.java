package com.registro_y_iniciosesion_backend.seguridad;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SeguridadConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Deshabilitamos CSRF para Postman
                .csrf(csrf -> csrf.disable())

                //Permite que el backend acepte peticiones desde otro origen (Angular corriendo en localhost:4200).
                //Si no activas CORS, Angular no podrá conectar con tu backend.
                .cors(cors ->{})

                // Permite que cualquier petición hacia cualquier endpoint sea accesible
                // sin autenticación. Es decir, todo el backend queda publico.
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        // Construye y devuelve la configuración de seguridad.
        return http.build();
    }


    //CODIFICACIÓN DE CLAVES
    // Este metodo crea un PasswordEncoder usando BCrypt.
    // lo que evita almacenar contraseñas en texto plano.
    @Bean
    public PasswordEncoder codificarClave() {
        return new BCryptPasswordEncoder();
    }
}
