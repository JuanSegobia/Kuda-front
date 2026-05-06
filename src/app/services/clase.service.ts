import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Clase {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  cupo?: number;
  activa?: boolean;
  actividad_id?: number;
  sala_id?: number;
  profesor_id?: number;
  actividad?: unknown;
  sala?: unknown;
  profesor?: unknown;
}

export interface CreateClaseDto {
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  cupo: number;
  actividad_id: number;
  sala_id: number;
  profesor_id: number;
}

@Injectable({ providedIn: 'root' })
export class ClaseService {
  private readonly apiUrl = 'http://localhost:3001/api/clases';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Clase[]> {
    return this.http.get<Clase[]>(this.apiUrl);
  }

  create(data: CreateClaseDto): Observable<{ message: string; clase: Clase }> {
    return this.http.post<{ message: string; clase: Clase }>(this.apiUrl, data);
  }
}

