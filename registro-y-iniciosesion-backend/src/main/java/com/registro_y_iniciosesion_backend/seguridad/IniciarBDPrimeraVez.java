package com.registro_y_iniciosesion_backend.seguridad;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


// Esta clase se ejecuta automáticamente cuando inicia la aplicación Spring Boot
// Sirve para inicializar la base de datos por primera vez
@Component
public class IniciarBDPrimeraVez implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;        // Permite ejecutar consultas SQL directamente
    private final PasswordEncoder passwordEncoder;  // Permite encriptar contraseñas


    // Constructor con inyección de dependencias
    public IniciarBDPrimeraVez(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional      // @Transactional asegura que todas las operaciones se ejecuten como una sola transacción
    public void run(String... args) {

        // ============================================
        // 1. VALIDAR SI YA EXISTE INFORMACIÓN
        // ============================================

        // Cuenta cuántos registros existen en la tabla permsisos
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM permisos",
                Integer.class
        );

        // Si ya hay datos, no ejecuta nada (evita duplicados)
        if (count != null && count > 0) {
            return;
        }


        // ============================================
        // 2. INSERTAR ROLES
        // ============================================

        // Se insertan dos roles con ID fijo
        jdbcTemplate.update("INSERT INTO rol (nombre) VALUES ('Administrador')");
        jdbcTemplate.update("INSERT INTO rol (nombre) VALUES ('Normal')");


        // ============================================
        // 3. INSERTAR PERMISOS
        // ============================================

        // Lista de permisos: id, módulo y acción
        Object[][] permisos = {
                {1L, "usuarios", "ver"},
                {2L, "usuarios", "crear"},
                {3L, "usuarios", "editar"},
                {4L, "usuarios", "eliminar"},
                {5L, "roles", "ver"},
                {6L, "roles", "crear"},
                {7L, "roles", "editar"},
                {8L, "roles", "eliminar"},
                {9L, "permisos", "ver"},
                {10L, "permisos", "crear"},
                {11L, "permisos", "editar"},
                {12L, "permisos", "eliminar"},
                {13L, "permisos", "asignar"}
        };
        // Inserta cada permiso en la base de datos
        for (Object[] p : permisos) {
            jdbcTemplate.update("INSERT INTO permisos (id, modulo, accion) VALUES (?, ?, ?)", p[0], p[1], p[2]);
        }


        // ============================================
        // 4. ASIGNAR PERMISOS AL ROL ADMINISTRADOR
        // ============================================

        // Se asignan todos los permisos al rol con id = 1 (Administrador)
        List<Long> ids = jdbcTemplate.queryForList(
                "SELECT id FROM permisos",
                Long.class
        );

        for (Long id : ids) {
            jdbcTemplate.update(
                    "INSERT INTO permisosxrol (id_rol, id_permiso) VALUES (1, ?)",
                    id
            );
        }


        // ============================================
        // 5. CREAR USUARIO ADMINISTRADOR
        // ============================================

        Integer adminExiste = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM usuarios WHERE usuario = 'admin'",
                Integer.class
        );

        if (adminExiste != null && adminExiste == 0) {
            String claveEncriptada = passwordEncoder.encode("admin");

            jdbcTemplate.update(
                    "INSERT INTO usuarios (usuario, nombre, clave, activo, rol_id) VALUES ('admin', 'admin', ?, 1, 1)",
                    claveEncriptada
            );
        }
    }
}