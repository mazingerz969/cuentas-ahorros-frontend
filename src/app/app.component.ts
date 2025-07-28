import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { UsuarioService } from './services/usuario.service';
import { NotificacionService } from './services/notificacion.service';
import { Usuario } from './models/usuario.model';

/**
 * Componente principal de la aplicación Angular.
 * 
 * Este es el componente raíz que contiene:
 * - La barra de navegación superior
 * - El menú lateral (sidenav)
 * - El área principal donde se cargan los componentes de las rutas
 * 
 * En Angular 17+, los componentes son standalone por defecto,
 * lo que significa que no necesitan estar declarados en un módulo.
 */
@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        RouterModule
    ],
    template: `
    <div class="app-container">
      <!-- Barra de navegación superior - solo mostrar si hay usuario autenticado -->
      <header *ngIf="usuario" class="toolbar">
        <div class="toolbar-left">
          <button class="menu-button" (click)="toggleSidenav()" type="button">
            <div class="logo-container">
              <span class="logo-icon">🛡️</span>
              <span class="logo-text">Banco Alberto</span>
            </div>
          </button>
        </div>
        
        <div class="toolbar-center">
          <div class="breadcrumb">
            <a class="breadcrumb-link" routerLink="/transacciones">Transacciones</a>
          </div>
        </div>
        
        <div class="toolbar-right">
          <button class="notification-button" (click)="showNotifications()" type="button">
            <span class="notification-icon">🔔</span>
            <span *ngIf="notificacionesNoLeidas > 0" class="notification-badge">{{ notificacionesNoLeidas }}</span>
          </button>
          <button class="user-button" (click)="showUserMenu()" type="button">
            <span class="user-icon">👤</span>
            <span *ngIf="usuario" class="user-name">{{ usuario.nombre }}</span>
          </button>
          <button *ngIf="usuario" class="logout-button" (click)="logout()" type="button">
            <span class="logout-icon">🚪</span>
          </button>
        </div>
      </header>

      <!-- Contenedor principal -->
      <div class="main-container" [class.with-toolbar]="usuario">
        <!-- Menú lateral - solo mostrar si hay usuario autenticado -->
        <nav *ngIf="usuario" class="sidenav" [class.sidenav-open]="sidenavOpen">
          <div class="nav-list">
            <a class="nav-item" routerLink="/dashboard" routerLinkActive="active" (click)="closeSidenav()">
              <span class="nav-icon">📊</span>
              <span class="nav-text">Dashboard</span>
            </a>
            <a class="nav-item" routerLink="/cuentas" routerLinkActive="active" (click)="closeSidenav()">
              <span class="nav-icon">🏦</span>
              <span class="nav-text">Cuentas</span>
            </a>
            <a class="nav-item" routerLink="/transacciones" routerLinkActive="active" (click)="closeSidenav()">
              <span class="nav-icon">💱</span>
              <span class="nav-text">Transacciones</span>
            </a>
            <a class="nav-item" routerLink="/notificaciones" routerLinkActive="active" (click)="closeSidenav()">
              <span class="nav-icon">🔔</span>
              <span class="nav-text">Notificaciones</span>
              <span *ngIf="notificacionesNoLeidas > 0" class="nav-badge">{{ notificacionesNoLeidas }}</span>
            </a>
          </div>
        </nav>

        <!-- Contenido principal -->
        <main class="content" [class.with-sidenav]="usuario && sidenavOpen">
          <div class="content-container">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <!-- Overlay para cerrar el sidenav en móviles -->
      <div class="sidenav-overlay" 
           [class.overlay-visible]="sidenavOpen" 
           (click)="closeSidenav()"
           *ngIf="sidenavOpen && usuario"></div>
    </div>
  `,
    styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Barra de navegación superior */
    .toolbar {
      background: #1a1a1a;
      color: white;
      padding: 0 24px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1000;
      position: relative;
      border-bottom: 1px solid #333;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .toolbar-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      justify-content: flex-end;
    }

    .menu-button {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 320px;
      height: 60px;
      width: 320px;
    }

    .menu-button:hover {
      background-color: rgba(255,255,255,0.1);
    }





    .app-title {
      margin-left: 16px;
      font-size: 20px;
      font-weight: 600;
      white-space: nowrap;
    }

    .breadcrumb {
      background: rgba(255,255,255,0.05);
      padding: 8px 16px;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .breadcrumb-link {
      color: #fff;
      font-weight: 500;
      font-size: 14px;
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .breadcrumb-link:hover {
      color: #e0e0e0;
    }

    .notification-button,
    .user-button,
    .logout-button {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      font-size: 14px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.2s ease;
      position: relative;
      display: flex;
      align-items: center;
      gap: 6px;
      justify-content: center;
      min-width: 40px;
      height: 36px;
    }

    .notification-button:hover,
    .user-button:hover,
    .logout-button:hover {
      background-color: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.2);
    }

    .notification-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .user-name {
      font-size: 13px;
      font-weight: 500;
    }

    /* Contenedor principal */
    .main-container {
      flex: 1;
      display: flex;
      position: relative;
      overflow: hidden;
    }

    .main-container.with-toolbar {
      margin-top: 70px;
    }

    /* Menú lateral */
    .sidenav {
      background: #f8f9fa;
      width: 280px;
      box-shadow: 2px 0 8px rgba(0,0,0,0.08);
      transform: translateX(-100%); /* Oculto por defecto */
      transition: transform 0.3s ease;
      z-index: 999;
      position: fixed;
      height: calc(100vh - 70px);
      top: 70px;
      overflow-y: auto;
      border-right: 1px solid #e9ecef;
    }

    .sidenav-open {
      transform: translateX(0);
    }

    .nav-list {
      padding: 20px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 14px 24px;
      color: #495057;
      text-decoration: none;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
      font-weight: 500;
      font-size: 14px;
    }

    .nav-item:hover {
      background-color: #e9ecef;
      border-left-color: #007bff;
      color: #007bff;
    }

    .nav-item.active {
      background-color: #e3f2fd;
      border-left-color: #007bff;
      color: #007bff;
      font-weight: 600;
    }

    .nav-icon {
      font-size: 18px;
      margin-right: 16px;
      width: 20px;
      text-align: center;
    }

    .nav-text {
      font-size: 14px;
      flex: 1;
    }

    .nav-badge {
      background: #dc3545;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      margin-left: auto;
    }

    /* Contenido principal */
    .content {
      flex: 1;
      background-color: #ffffff;
      margin-left: 0; /* Sin margen cuando sidenav está cerrado */
      transition: margin-left 0.3s ease;
      overflow-y: auto;
    }

    .content-container {
      padding: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
    }

    .logo-icon {
      font-size: 24px;
      filter: brightness(0) invert(1);
    }

    .logo-text {
      font-family: 'Orbitron', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 24px;
      font-weight: 500;
      color: white;
    }

    .content.with-sidenav {
      margin-left: 280px;
    }

    /* Overlay para móviles */
    .sidenav-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5);
      z-index: 998;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .overlay-visible {
      opacity: 1;
      visibility: visible;
    }

    /* Responsive */
    @media (min-width: 768px) {
      .sidenav {
        position: fixed;
        top: 70px;
        height: calc(100vh - 70px);
        transform: translateX(-100%); /* Oculto por defecto en desktop también */
      }

      .sidenav.sidenav-open {
        transform: translateX(0);
      }

      .content {
        margin-left: 0; /* Sin margen cuando está cerrado */
        transition: margin-left 0.3s ease;
      }

      .content.with-sidenav {
        margin-left: 280px; /* Margen solo cuando está abierto */
      }

      .sidenav-overlay {
        display: none;
      }

      .breadcrumb {
        display: block;
      }
    }

    @media (max-width: 767px) {
      .sidenav {
        position: fixed;
        top: 70px;
        height: calc(100vh - 70px);
      }

      .toolbar {
        padding: 0 16px;
      }

      .breadcrumb {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .toolbar {
        padding: 0 12px;
      }
      
      .user-name {
        display: none;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * Título de la aplicación.
   */
  title = 'Gestión de Cuentas de Ahorros';

  /**
   * Estado del menú lateral (abierto/cerrado).
   */
  sidenavOpen = false; // Cerrado por defecto
  usuario: Usuario | null = null;
  notificacionesNoLeidas = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private usuarioService: UsuarioService,
    private notificacionService: NotificacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse al usuario actual
    this.usuarioService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuario => {
        this.usuario = usuario;
        if (usuario) {
          this.cargarNotificacionesNoLeidas();
        }
      });

    // Suscribirse al contador de notificaciones
    this.notificacionService.notificacionesNoLeidas$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.notificacionesNoLeidas = count;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarNotificacionesNoLeidas(): void {
    if (this.usuario) {
      this.notificacionService.contarNoLeidas(this.usuario.id).subscribe();
    }
  }

  /**
   * Alterna el estado del menú lateral.
   */
  toggleSidenav(): void {
    console.log('Botón clickeado - Estado anterior:', this.sidenavOpen);
    this.sidenavOpen = !this.sidenavOpen;
    console.log('Nuevo estado del sidenav:', this.sidenavOpen);
  }

  /**
   * Cierra el menú lateral.
   */
  closeSidenav(): void {
    this.sidenavOpen = false;
    console.log('Sidenav closed');
  }

  /**
   * Obtiene el título de la página actual.
   */
  getCurrentPageTitle(): string {
    const currentPath = window.location.pathname;
    switch (currentPath) {
      case '/dashboard':
        return 'Dashboard';
      case '/cuentas':
        return 'Gestión de Cuentas';
      case '/transacciones':
        return 'Transacciones';
      default:
        return 'Dashboard';
    }
  }

  /**
   * Muestra las notificaciones.
   */
  showNotifications(): void {
    if (this.usuario) {
      this.router.navigate(['/notificaciones']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Muestra el menú de usuario.
   */
  showUserMenu(): void {
    if (this.usuario) {
      // Aquí podrías mostrar un dropdown con opciones del usuario
      console.log('Usuario actual:', this.usuario);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    this.usuarioService.logout();
    this.router.navigate(['/login']);
  }
} 