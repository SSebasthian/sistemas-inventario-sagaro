import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AutenticadorService } from '../servicio/autenticacion/autenticador.service';



// GUARD PRIVADO -> SOLO SI EL USUARIO ESTA LOGUEADO
export const estadoPrivado: CanActivateFn = () => {
  const router = inject(Router);
  const autenticadorService = inject(AutenticadorService);

  // Validar si está logueado
  const estaLogueado = autenticadorService.isLoggedIn();

  if (estaLogueado) {
    return true; // Deja entrar
  }

  // si no está logueado → redirige
  router.navigate(['/autenticacion/acceso']);
  return false;
};


// GUARD PUBLICO -> SOLO SI NO ESTA LOGUEADO
export const estadoPublico: CanActivateFn = () => {
  const router = inject(Router);
  const autenticadorService = inject(AutenticadorService);

  const estaLogueado = autenticadorService.isLoggedIn();

  if (estaLogueado) {
    router.navigate(['/autenticacion/perfil']);
    return false;
  }
  // si NO está logueado → sí entra
  return true;
}