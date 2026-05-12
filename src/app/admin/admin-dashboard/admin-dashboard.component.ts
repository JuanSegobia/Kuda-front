import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Usuario, UsuarioService, CreateUsuarioDto } from '../../services/usuario.service';
import { Clase, ClaseService, CreateClaseDto } from '../../services/clase.service';
import { Profesor, ProfesorService } from '../../services/profesor.service';
import { PlanService } from '../../services/plan.service';
import { Plan } from '../../models/plan.model';
import { AuthService, CurrentUser } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  tab: 'planes' | 'usuarios' | 'clases' | 'profesores' = 'planes';

  planes: Plan[] = [];
  usuarios: Usuario[] = [];
  clases: Clase[] = [];
  profesores: Profesor[] = [];

  loading = {
    planes: false,
    usuarios: false,
    clases: false,
    profesores: false,
  };

  error = {
    planes: '',
    usuarios: '',
    clases: '',
    profesores: '',
  };

  createUsuario: CreateUsuarioDto = {
    email: '',
    dni: '',
    nombre: '',
    apellido: '',
    telefono: '',
    password: '',
    rol_id: 2,
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
    private readonly usuarioService: UsuarioService,
    private readonly claseService: ClaseService,
    private readonly profesorService: ProfesorService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.refreshPlanes();
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/');
  }

  setTab(tab: typeof this.tab): void {
    this.tab = tab;

    if (tab === 'planes' && this.planes.length === 0) this.refreshPlanes();
    if (tab === 'usuarios' && this.usuarios.length === 0) this.refreshUsuarios();
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

  refreshUsuarios(): void {
    this.loading.usuarios = true;
    this.error.usuarios = '';
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data ?? [];
        this.loading.usuarios = false;
      },
      error: () => {
        this.error.usuarios = 'No se pudieron cargar los usuarios.';
        this.loading.usuarios = false;
      },
    });
  }

  onCreateUsuario(): void {
    this.error.usuarios = '';
    const u = this.createUsuario;
    if (!u.email || !u.dni || !u.nombre || !u.apellido || !u.password || Number(u.rol_id) <= 0) {
      this.error.usuarios = 'Completá email, DNI, nombre, apellido, contraseña y rol.';
      return;
    }

    this.usuarioService
      .create({
        email: u.email,
        dni: u.dni,
        nombre: u.nombre,
        apellido: u.apellido,
        telefono: u.telefono || undefined,
        password: u.password,
        rol_id: Number(u.rol_id),
      })
      .subscribe({
        next: () => {
          this.createUsuario = { email: '', dni: '', nombre: '', apellido: '', telefono: '', password: '', rol_id: 2 };
          this.refreshUsuarios();
        },
        error: (err) => {
          this.error.usuarios =
            err?.error?.message ?? 'No se pudo crear el usuario.';
        },
      });
  }

  onDeleteUsuario(email: string): void {
    this.error.usuarios = '';
    this.usuarioService.delete(email).subscribe({
      next: () => {
        this.refreshUsuarios();
      },
      error: (err) => {
        this.error.usuarios =
          err?.error?.message ?? 'No se pudo dar de baja el usuario.';
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
