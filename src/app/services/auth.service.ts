import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  genero: string;
  fechaNacimiento: string; // YYYY-MM-DD
  telefono: string;
  fichaMedica?: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CurrentUser {
  email: string;
  dni: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  activo: boolean;
  rol_id: number;
  rol: { id: number; nombre: string };
}

export interface LoginResponse {
  usuario: CurrentUser;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3001/api/auth';
  private readonly tokenKey = 'kuda_token';
  private readonly userKey = 'kuda_user';

  constructor(private readonly http: HttpClient) {}

  register(data: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, data);
  }

  confirmarCuenta(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(
      `${this.apiUrl}/confirmar/${encodeURIComponent(token)}`
    );
  }

  actualizarPerfil(data: { nombre: string; apellido: string; telefono?: string }): Observable<CurrentUser> {
    return this.http.put<CurrentUser>(`${this.apiUrl}/me`, data).pipe(
      tap((usuario) => this.setUser(usuario))
    );
  }

  recuperarPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/recuperar`, { email });
  }

  nuevaPassword(token: string, password: string, confirmPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/nueva-password/${encodeURIComponent(token)}`, { password, confirmPassword });
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((resp) => {
        if (resp?.token) this.setToken(resp.token);
        if (resp?.usuario) this.setUser(resp.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): CurrentUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CurrentUser;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return Boolean(this.getToken());
  }

  getRol(): string | null {
    return this.getCurrentUser()?.rol?.nombre ?? null;
  }

  isAdmin(): boolean {
    return this.getRol() === 'ADMIN';
  }

  isRecepcionista(): boolean {
    return this.getRol() === 'RECEPCIONISTA';
  }

  isStaff(): boolean {
    return this.isAdmin() || this.isRecepcionista();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: CurrentUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
}
