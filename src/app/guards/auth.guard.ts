import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.usuarioService.isAuthenticated()) {
      return true;
    }
    // Si no está autenticado, redirige a login
    return this.router.createUrlTree(['/login']);
  }
} 