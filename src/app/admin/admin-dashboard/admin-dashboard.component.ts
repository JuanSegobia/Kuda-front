import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Clase, ClaseService, CreateClaseDto } from '../../services/clase.service';
import { Profesor, ProfesorService } from '../../services/profesor.service';
import { PlanService } from '../../services/plan.service';
import { Plan } from '../../models/plan.model';
import { AuthService, CurrentUser } from '../../services/auth.service';
import { UsuariosListComponent } from '../usuarios-list/usuarios-list.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, UsuariosListComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  tab: 'planes' | 'usuarios' | 'clases' | 'profesores' = 'usuarios';

  planes: Plan[] = [];
  clases: Clase[] = [];
  profesores: Profesor[] = [];

  loading = {
    planes: false,
    clases: false,
    profesores: false,
  };

  error = {
    planes: '',
    clases: '',
    profesores: '',
  };

  createClase: CreateClaseDto = {
    dia_semana: 'Lunes',
    hora_inicio: '09:00',
    hora_fin: '10:00',
    cupo: 10,
    actividad_id: 1,
    sala_id: 1,
    profesor_id: 1,
  };
  createProfesor = {
    nombre: '',
    apellido: '',
    dni: '',
    actividadesCsv: '',
  };

  currentUser: CurrentUser | null = null;

  constructor(
    private readonly planService: PlanService,
    private readonly claseService: ClaseService,
    private readonly profesorService: ProfesorService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/');
  }

  setTab(tab: typeof this.tab): void {
    this.tab = tab;

    if (tab === 'planes' && this.planes.length === 0) this.refreshPlanes();
    if (tab === 'clases' && this.clases.length === 0) this.refreshClases();
    if (tab === 'profesores' && this.profesores.length === 0) this.refreshProfesores();
  }

  refreshPlanes(): void {
    this.loading.planes = true;
    this.error.planes = '';
    this.planService.getPlanes().subscribe({
      next: (data) => {
        this.planes = data ?? [];
        this.loading.planes = false;
      },
      error: () => {
        this.error.planes = 'No se pudieron cargar los planes.';
        this.loading.planes = false;
      },
    });
  }

  refreshClases(): void {
    this.loading.clases = true;
    this.error.clases = '';
    this.claseService.getAll().subscribe({
      next: (data) => {
        this.clases = data ?? [];
        this.loading.clases = false;
      },
      error: () => {
        this.error.clases = 'No se pudieron cargar las clases.';
        this.loading.clases = false;
      },
    });
  }

  onCreateClase(): void {
    this.error.clases = '';
    const c = this.createClase;
    if (
      !c.dia_semana ||
      !c.hora_inicio ||
      !c.hora_fin ||
      Number(c.cupo) < 10 ||
      Number(c.actividad_id) <= 0 ||
      Number(c.sala_id) <= 0 ||
      Number(c.profesor_id) <= 0
    ) {
      this.error.clases =
        'Completá todos los campos. El cupo mínimo es 10.';
      return;
    }

    this.claseService
      .create({
        ...c,
        cupo: Number(c.cupo),
        actividad_id: Number(c.actividad_id),
        sala_id: Number(c.sala_id),
        profesor_id: Number(c.profesor_id),
      })
      .subscribe({
        next: () => {
          this.refreshClases();
        },
        error: (err) => {
          this.error.clases =
            err?.error?.message ?? 'No se pudo agendar la clase.';
        },
      });
  }

  refreshProfesores(): void {
    this.loading.profesores = true;
    this.error.profesores = '';
    this.profesorService.getAll().subscribe({
      next: (data) => {
        this.profesores = data ?? [];
        this.loading.profesores = false;
      },
      error: (err) => {
        if (err?.status === 404) {
          this.profesores = [];
          this.loading.profesores = false;
          return;
        }
        this.error.profesores = 'No se pudieron cargar los profesores.';
        this.loading.profesores = false;
      },
    });
  }

  onCreateProfesor(): void {
    this.error.profesores = '';
    const p = this.createProfesor;
    if (!p.nombre || !p.apellido || !p.dni) {
      this.error.profesores = 'Completá nombre, apellido y DNI.';
      return;
    }

    const actividades = p.actividadesCsv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n) && n > 0);

    this.profesorService
      .create({
        nombre: p.nombre,
        apellido: p.apellido,
        dni: p.dni,
        actividades: actividades.length ? actividades : undefined,
      })
      .subscribe({
        next: () => {
          this.createProfesor = {
            nombre: '',
            apellido: '',
            dni: '',
            actividadesCsv: '',
          };
          this.refreshProfesores();
        },
        error: (err) => {
          this.error.profesores =
            err?.error?.message ?? 'No se pudo registrar el profesor.';
        },
      });
  }
}
