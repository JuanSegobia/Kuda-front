import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  email: string;
  dni: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  activo: boolean;
  rol_id: number;
  rol?: { id: number; nombre: string };
}

export interface CreateUsuarioDto {
  email: string;
  dni: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  password: string;
  rol_id: number;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly apiUrl = 'http://localhost:3001/api/usuarios';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getByEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${encodeURIComponent(email)}`);
  }

  create(data: CreateUsuarioDto): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, data);
  }

  update(email: string, data: Partial<CreateUsuarioDto>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${encodeURIComponent(email)}`, data);
  }

  delete(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(email)}`);
  }
}
