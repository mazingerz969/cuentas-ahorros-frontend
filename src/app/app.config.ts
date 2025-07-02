import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Configuración principal de la aplicación Angular 20.
 * 
 * Este archivo define todos los providers y configuraciones necesarias
 * para que la aplicación funcione correctamente:
 * 
 * - provideRouter: Configura el enrutador de Angular
 * - provideAnimations: Habilita las animaciones de Angular Material
 * - provideHttpClient: Configura el cliente HTTP para las peticiones al backend
 * 
 * Angular 20 incluye nuevas características como:
 * - Nuevo control flow (@if, @for, @switch)
 * - Mejor rendimiento con hydration mejorada
 * - APIs standalone mejoradas
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Configuración del enrutador con las rutas definidas
    provideRouter(routes),
    
    // Habilita las animaciones para Angular Material
    provideAnimations(),
    
    // Configura el cliente HTTP para comunicación con el backend
    provideHttpClient(withInterceptorsFromDi())
  ]
}; 