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

export interface LoginResponse {
  usuario: unknown;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3001/api/auth';
  private readonly tokenKey = 'kuda_token';

  constructor(private readonly http: HttpClient) {}

  register(data: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, data);
  }

  confirmarCuenta(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(
      `${this.apiUrl}/confirmar/${encodeURIComponent(token)}`
    );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((resp) => {
        if (resp?.token) this.setToken(resp.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return Boolean(this.getToken());
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
}
