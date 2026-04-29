package com.registro_y_iniciosesion_backend.servicios;


import com.registro_y_iniciosesion_backend.autenticacion.InicioSesionRespuesta;
import com.registro_y_iniciosesion_backend.autenticacion.RegistroRespuesta;
import com.registro_y_iniciosesion_backend.autenticacion.RegistroSolicitud;
import com.registro_y_iniciosesion_backend.entidades.Rol;
import com.registro_y_iniciosesion_backend.entidades.Usuarios;
import com.registro_y_iniciosesion_backend.repositorios.RolRepository;
import com.registro_y_iniciosesion_backend.repositorios.UsuariosRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuariosService {

    private final UsuariosRepository usuariosRepository;
    private final PasswordEncoder codificarClave;
    private final RolRepository rolRepository;

    // Inyección del repositorio mediante el constructor
    public UsuariosService(UsuariosRepository usuariosRepository, PasswordEncoder codificarClave, RolRepository rolRepository) {
        this.usuariosRepository = usuariosRepository;
        this.codificarClave = codificarClave;
        this.rolRepository = rolRepository;
    }

    // Crear o guardar un usuario nuevo
    // Se encripta la contraseña
    public Usuarios crear(Usuarios usuario) {
        usuario.setClave(codificarClave.encode(usuario.getClave()));
        // Asegurarnos de que activo sea true por defecto
        if (usuario.getActivo() == null) {
            usuario.setActivo(true);
        }
        return usuariosRepository.save(usuario);
    }

    // Buscar usuario por su nombre de usuario (para login después)
    public Usuarios buscarPorUsuario(String usuario) {
        return usuariosRepository.findByUsuario(usuario);
    }

    // Obtener todos los usuarios
    public List<Usuarios> listar() {
        return usuariosRepository.findAll();
    }

    //  Buscar un usuario por su ID
    public Usuarios buscarPorId(Long id) {
        return usuariosRepository.findById(id).orElse(null);
    }


    /// ////////////////////////////////////////
    /// /// METODO PARA REGISTRAR USUARIO///////
    /// ////////////////////////////////////////
    public RegistroRespuesta registrar(RegistroSolicitud datos) {

        // 1. Verificar que el usuario NO exista antes de registrar
        Usuarios existente = usuariosRepository.findByUsuario(datos.getUsuario());
        if (existente != null) {
            return new RegistroRespuesta("El Usuario Ya Existe", null, null, null);
        }

        // 2. Asignar por defecto el rol NORMAL (id = 2)
        Rol rolAsignado;

        if (datos.getRolId() != null) {
            // Si viene rolId en la solicitud, usar ese
            rolAsignado = rolRepository.findById(datos.getRolId()).orElse(null);
            if (rolAsignado == null) {
                return new RegistroRespuesta("El Rol con ID " + datos.getRolId() + " No Existe", null, null, null);
            }
        } else {
            // Si no viene rolId, usar el rol NORMAL (id=2) por defecto
            rolAsignado = rolRepository.findById(2L).orElse(null);
            if (rolAsignado == null) {
                return new RegistroRespuesta("El Rol NORMAL (id=2) No Existe", null, null, null);
            }
        }

        // 3. Crear usuario nuevo
        Usuarios nuevo = new Usuarios();
        nuevo.setUsuario(datos.getUsuario());
        nuevo.setNombre(datos.getNombre());
        // Se encripta la contraseña
        nuevo.setClave(codificarClave.encode(datos.getClave()));
        nuevo.setActivo(true);
        nuevo.setRol(rolAsignado);

        usuariosRepository.save(nuevo);

        // 4. Respuesta de éxito
        return new RegistroRespuesta(
                "Usuario Registrado Correctamente",
                nuevo.getUsuario(),
                nuevo.getNombre(),
                nuevo.getRol().getNombre()
        );
    }

    /// ////////////////////////////////////////
    /// ////// METODO PARA INICIAR SESION///////
    /// ////////////////////////////////////////
    public InicioSesionRespuesta login(String usuario, String clave) {
        // Buscar el usuario en la base de datos por su nombre de usuario
        Usuarios user = usuariosRepository.findByUsuario(usuario);

        // Si no existe, retornar mensaje de error
        if (user == null) {
            return new InicioSesionRespuesta("Usuario No Encontrado", null, null, null);
        }

        // Verificar que la contraseña ingresada coincida con la almacenada
        // codificarClave.matches compara la clave en texto plano con la codificada en la DB
        if (!codificarClave.matches(clave, user.getClave())) {
            return new InicioSesionRespuesta("Contraseña Incorrecta", null, null, null);
        }

        // Verificar que el usuario esté activo
        if (!user.getActivo()) {
            return new InicioSesionRespuesta("Usuario Inactivo", null, null, null);
        }

        // Si, todo es correcto retornar mensaje de exito junto con informacion del usuario
        return new InicioSesionRespuesta(
                "Inicio de Sesion Exitoso!!!",
                user.getUsuario(),
                user.getNombre(),
                user.getRol().getNombre()
        );
    }

    /// ////////////////////////////////////////
    /// ////// METODO PARA EDITAR PERFIL ///////
    /// ////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////////
    // Actualiza el perfil del usuario (solo datos básicos)- No modifica rol ni contraseña

    /// /////////////////////////////////////////////////////////////////////////////////////
    public Usuarios actualizarPerfil(String usuario, Usuarios datos) {

        // Buscar usuario existente
        Usuarios user = usuariosRepository.findByUsuario(usuario);

        if (user == null) {
            return null;
        }

        // Actualizar SOLO lo necesario
        user.setNombre(datos.getNombre());

        // IMPORTANTE: NO tocar rol ni clave aquí
        return usuariosRepository.save(user);
    }

    ////////////////////////////////////////////////////////////////////////////////////////
    // Cambia la contraseña del usuario validando la actua

    /// /////////////////////////////////////////////////////////////////////////////////////
    public String cambiarClave(String usuario, String actual, String nueva) {
        Usuarios user = usuariosRepository.findByUsuario(usuario);

        if (user == null) {
            return "Usuario no encontrado";
        }

        // Validar contraseña actual
        if (!codificarClave.matches(actual, user.getClave())) {
            return "Contraseña actual incorrecta";
        }

        // Guardar nueva contraseña encriptada
        user.setClave(codificarClave.encode(nueva));
        usuariosRepository.save(user);

        return "Contraseña actualizada correctamente";
    }

    /// ////////////////////////////////////////
    /// //// METODO PARA EDITAR USUARIOS ///////
    /// ////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////////
    // Actualiza usuario desde el panel ADMIN - Permite modificar nombre, usaurio, estado, rol

    /// /////////////////////////////////////////////////////////////////////////////////////
    public Usuarios actualizarUsuarioAdmin(String usuario, Usuarios datos) {

        Usuarios user = usuariosRepository.findByUsuario(usuario);

        if (user == null) {
            return null;
        }

        // Actualizar todo lo permitido por admin
        user.setNombre(datos.getNombre());
        user.setUsuario(datos.getUsuario());
        user.setActivo(datos.getActivo());

        // ROL (muy importante)
        if (datos.getRol() != null) {
            user.setRol(datos.getRol());
        }

        return usuariosRepository.save(user);
    }

    ////////////////////////////////////////////////////////////////////////////////////////
    // Cambia contraseña desde ADMIN sin validar contraseña actual

    /// /////////////////////////////////////////////////////////////////////////////////////
    public String cambiarClaveAdmin(String usuario, String nueva) {
        Usuarios user = usuariosRepository.findByUsuario(usuario);

        if (user == null) {
            return "Usuario no encontrado";
        }

        // NO valida contraseña actual
        user.setClave(codificarClave.encode(nueva));
        usuariosRepository.save(user);

        return "Contraseña actualizada por admin";
    }


    ////////////////////////////////////////////////////////////////////////////////////////
    // Registra un usuario desde el panel ADMIN - Valida duplicados, asigna rol, incripta clave

    /// /////////////////////////////////////////////////////////////////////////////////////
    public RegistroRespuesta registrarAdmin(RegistroSolicitud datos) {
        Usuarios existente = usuariosRepository.findByUsuario(datos.getUsuario());
        if (existente != null) {
            return new RegistroRespuesta("El Usuario Ya Existe", null, null, null);
        }
        Rol rol = rolRepository.findById(datos.getRolId())
                .orElse(null);

        if (rol == null) {
            return new RegistroRespuesta("Rol no válido", null, null, null);
        }

        Usuarios nuevo = new Usuarios();
        nuevo.setUsuario(datos.getUsuario());
        nuevo.setNombre(datos.getNombre());
        nuevo.setClave(codificarClave.encode(datos.getClave()));
        nuevo.setActivo(true);
        nuevo.setRol(rol);

        usuariosRepository.save(nuevo);

        return new RegistroRespuesta(
                "Usuario creado por admin correctamente",
                nuevo.getUsuario(),
                nuevo.getNombre(),
                nuevo.getRol().getNombre()
        );
    }


    ////////////////////////////////////////////////////////////////////////////////////////
    // Elimina un usuario del sistema

    /// /////////////////////////////////////////////////////////////////////////////////////
    public void eliminarUsuario(String usuario) {
        Usuarios user = usuariosRepository.findByUsuario(usuario);

        if (user != null) {
            usuariosRepository.delete(user);
        }
    }


    /// ////////////////////////////////////////
    /// //// OBTENER USUARIOS POR ROL    ///////
    /// ////////////////////////////////////////


    public long contarUsuarioPorRol(Long rolId) {
        return usuariosRepository.countByRolId(rolId);
    }

    public List<Usuarios> buscarUsuarioPorRol(Long rolId) {
        return usuariosRepository.findByRolId(rolId);
    }

}
