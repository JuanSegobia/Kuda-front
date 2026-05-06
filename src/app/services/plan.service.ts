import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../models/plan.model';

export interface CreatePlanDto {
  nombre: string;
  precio: number;
  duracion_dias: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private readonly apiUrl = 'http://localhost:3001/api/planes';

  constructor(private readonly http: HttpClient) {}

  getPlanes(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.apiUrl);
  }

  createPlan(plan: CreatePlanDto): Observable<Plan> {
    return this.http.post<Plan>(this.apiUrl, plan);
  }
}
