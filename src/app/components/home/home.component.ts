import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Redirigiendo...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .loading-spinner {
      text-align: center;
      color: white;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    p {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
    }
  `]
})
export class HomeComponent implements OnInit {
  
  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    if (this.usuarioService.isAuthenticated()) {
      // Si está autenticado, redirigir a dashboard
      this.router.navigate(['/dashboard']);
    } else {
      // Si no está autenticado, redirigir a login
      this.router.navigate(['/login']);
    }
  }
} 