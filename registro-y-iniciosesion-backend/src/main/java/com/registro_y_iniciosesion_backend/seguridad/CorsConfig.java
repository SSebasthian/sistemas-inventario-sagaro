package com.registro_y_iniciosesion_backend.seguridad;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        // Objeto donde configuramos las reglas CORS
        CorsConfiguration config = new CorsConfiguration();


        // -------------------------------
        // ORIGENES PERMITIDOS
        // -------------------------------
        // Solo se permite que el backend reciba peticiones desde:http://localhost:4200  (proyecto Angular)
        // Si más adelante usas hosting, debes agregarlo también.
        config.setAllowedOrigins(List.of("http://localhost:4200"));


        // -------------------------------
        // METODOS HTTP PERMITIDOS
        // -------------------------------
        // Se permiten todos los métodos usados en APIs REST:
        // GET → Obtener datos
        // POST → Enviar datos
        // PUT → Actualizar datos
        // DELETE → Borrar datos
        // OPTIONS → Necesario para preflight de CORS
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));


        // -------------------------------
        // CABECERAS PERMITIDAS
        // -------------------------------
        // "*" significa que se permiten todas las cabeceras:
        // Authorization, Content-Type, Accept, etc.
        config.setAllowedHeaders(List.of("*"));


        // -------------------------------
        // PERMITIR ENVÍO DE COOKIES O TOKENS
        // -------------------------------
        // true permite que el navegador envíe:
        // - cookies
        // - sesión
        // - tokens
        // útil cuando más adelante se use JWT
        config.setAllowCredentials(true);


        // -------------------------------
        // REGISTRO DE LA CONFIGURACIÓN
        // -------------------------------
        // UrlBasedCorsConfigurationSource permite aplicar CORS a todas las rutas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // "/**" = aplica la configuración CORS a todos los endpoints del backend
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}