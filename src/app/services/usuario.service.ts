import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Usuario, LoginRequest, RegistroRequest, UsuarioUpdateRequest, PasswordChangeRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://cuentas-ahorros-backend-production.up.railway.app/api/usuarios';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Recuperar usuario del localStorage al inicializar
    this.initializeUserFromStorage();
  }

  /**
   * Inicializa el usuario desde localStorage
   */
  private initializeUserFromStorage(): void {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        // Verificar que el usuario tenga los campos requeridos
        if (user && user.id && user.email && user.nombre) {
          console.log('Usuario cargado desde localStorage:', user);
          this.currentUserSubject.next(user);
        } else {
          console.log('Usuario en localStorage no válido, limpiando...');
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
        }
      } else {
        console.log('No hay usuario en localStorage');
        this.currentUserSubject.next(null);
      }
    } catch (error) {
      console.error('Error al cargar usuario desde localStorage:', error);
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Registra un nuevo usuario
   */
  registrar(registroRequest: RegistroRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registro`, registroRequest);
  }

  /**
   * Autentica un usuario
   */
  login(loginRequest: LoginRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(usuario => {
          console.log('Login exitoso, guardando usuario:', usuario);
          // Guardar usuario en localStorage y BehaviorSubject
          localStorage.setItem('currentUser', JSON.stringify(usuario));
          this.currentUserSubject.next(usuario);
        })
      );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    console.log('Cerrando sesión...');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si hay un usuario autenticado
   */
  isAuthenticated(): boolean {
    const user = this.currentUserSubject.value;
    const isAuth = user !== null && user.id !== undefined && user.email !== undefined;
    console.log('Verificación de autenticación:', isAuth, user);
    return isAuth;
  }

  /**
   * Obtiene todos los usuarios (solo para administradores)
   */
  obtenerTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  /**
   * Obtiene un usuario por ID
   */
  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza un usuario
   */
  actualizar(id: number, updateRequest: UsuarioUpdateRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, updateRequest)
      .pipe(
        tap(usuario => {
          // Si es el usuario actual, actualizar en localStorage
          const currentUser = this.currentUserSubject.value;
          if (currentUser && currentUser.id === id) {
            const updatedUser = { ...currentUser, ...usuario };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);
          }
        })
      );
  }

  /**
   * Cambia la contraseña de un usuario
   */
  cambiarPassword(id: number, passwordRequest: PasswordChangeRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/password`, passwordRequest);
  }

  /**
   * Desactiva un usuario
   */
  desactivar(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/desactivar`, {});
  }

  /**
   * Activa un usuario
   */
  activar(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/activar`, {});
  }
} 