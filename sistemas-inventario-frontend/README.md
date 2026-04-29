<h1 align="center"> # Registro-InicioSesion </h1>

## Necesario para Angular
`npm install -g @angular/cli@19`<br>
`ng add @angular/material@19`<br>



## Creación de Proyecto Angular
`ng new registro-y-iniciosesion-frontend` (Se crea con CSS)<br>
`ng generate component pagina/autenticacion/acceso` (Acceso)<br>
`ng generate component pagina/autenticacion/registro` (Registro)<br>
`ng generate service arquitectura/servicio/autenticacion/autenticador` (Servicio Autenticacion)<br>
`Se crea interface inicioSesionSolicitud manualmente` (Interface InicioSesionSolicitud SOLICITUD AUTENTICACION BACKEND)<br>
`Se crea interface inicioSesionRespuesta manualmente` (Interface inicioSesionRespuesta RESPUESTA AUTENTICACION BACKEND)<br>
`ng generate component pagina/autenticacion/perfil` (Perfil)<br>
`ng generate guard arquitectura/guardianRuta/enturamiento` (*)CanActivate (Guardian para Controlar Roles de Acceso)<br>
`ng generate component pagina/permisos/permisos-usuarios` (PERMISOS USUARIOS)<br>
`ng generate component pagina/permisos/permisos-perfil` (PERMISOS PERFIL)<br>
`ng generate component pagina/permisos/permisos-rol` (PERMISOS ROL)<br>
`ng generate component pagina/permisos/permisos-permisos` (PERMISOS PERMISOS)<br>

`ng generate component pagina/permisos/permisos-permisosxrol` (PERMISOS - PERMISOS POR ROL)<br>
`ng generate service arquitectura/servicio/permisos/usuarios-permisos` (Servicio para USUARIOS Permiso)<br>
`ng generate service arquitectura/servicio/permisos/rol-permisos` (Servicio para ROL Permiso)<br>
`ng generate service arquitectura/servicio/permisos/permisos-permisos` (Servicio para PERMISOS Permiso)<br>
`ng generate service arquitectura/servicio/permisos/permisosxrol-permisos` (Servicio para PERMISOS X ROL)<br>
`ng generate service arquitectura/servicio/autenticacion/perfil` (Servicio Autenticacion)<br>

`ng generate service arquitectura/servicio/autenticacion/permiso-modulo` (Servicio PERMISOS X MODULO)<br>
`ng generate component pagina/notificacion` (PERMISOS - PERMISOS POR ROL)<br>
`ng generate service arquitectura/servicio/notificacion/notificacion-snackbar` (Servicio NOTIFICACIONES SNACKBAR)<br>