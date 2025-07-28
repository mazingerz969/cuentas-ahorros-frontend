import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    console.log('AuthGuard: Verificando autenticación...');
    // Verificar si hay un usuario autenticado
    if (this.usuarioService.isAuthenticated()) {
      console.log('AuthGuard: Usuario autenticado, permitiendo acceso');
      return true;
    }
    
    console.log('AuthGuard: Usuario no autenticado, redirigiendo a login');
    // Si no está autenticado, redirige a login
    return this.router.createUrlTree(['/login']);
  }
} 