import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  dni: string;
  nombreUsuario?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  activo?: boolean;
  rol_id?: number;
  rol?: unknown;
}

export interface CreateUsuarioDto {
  dni: string;
  nombreUsuario: string;
  nombre: string;
  apellido: string;
  password: string;
  direccion: string;
  edad: number;
  rol_id: number;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly apiUrl = 'http://localhost:3001/api/usuarios';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  create(data: CreateUsuarioDto): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

