import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface UsuarioListado {
  email: string;
  dni: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  activo: boolean;
  rol_id: number;
  rol?: { id: number; nombre: string };
}

export type RolFiltro = '' | 'ADMIN' | 'RECEPCIONISTA' | 'CLIENTE';
export type EstadoFiltro = '' | 'ACTIVO' | 'INACTIVO';
export type TipoInscripcionFiltro = '' | 'ABONADO' | 'NO_ABONADO';

export interface UsuariosFiltro {
  q?: string;
  rol?: RolFiltro;
  estado?: EstadoFiltro;
  tipoInscripcion?: TipoInscripcionFiltro;
}

export interface ActualizarUsuarioDto {
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  genero?: string;
  fechaNacimiento?: string;
}

export interface ClienteExtraInfo {
  genero?: string;
  fechaNacimiento?: string;
}

@Injectable({ providedIn: 'root' })
export class GestionUsuariosService {
  private readonly apiUrl = 'http://localhost:3001/api/usuarios';
  private readonly clientesUrl = 'http://localhost:3001/api/clientes';

  constructor(private readonly http: HttpClient) {}

  /**
   * Listado consumiendo `GET /api/usuarios?rol=&activo=&q=` (real).
   * El filtro `tipoInscripcion` se aplica client-side porque el back no tiene
   * ese atributo (MOCK - Regla de Oro 1).
   */
  getAll(filtros: UsuariosFiltro = {}): Observable<UsuarioListado[]> {
    let params = new HttpParams();
    if (filtros.q?.trim()) params = params.set('q', filtros.q.trim());
    if (filtros.rol) params = params.set('rol', filtros.rol);
    if (filtros.estado === 'ACTIVO') params = params.set('activo', 'true');
    if (filtros.estado === 'INACTIVO') params = params.set('activo', 'false');

    return this.http.get<UsuarioListado[]>(this.apiUrl, { params }).pipe(
      map((lista) => this.aplicarFiltroTipoInscripcionMock(lista, filtros.tipoInscripcion)),
    );
  }

  getByEmail(email: string): Observable<UsuarioListado> {
    return this.http.get<UsuarioListado>(`${this.apiUrl}/${encodeURIComponent(email)}`);
  }

  update(email: string, data: ActualizarUsuarioDto): Observable<UsuarioListado> {
    return this.http.put<UsuarioListado>(
      `${this.apiUrl}/${encodeURIComponent(email)}`,
      data,
    );
  }

  /**
   * Trae los campos extra que viven en el modelo `Cliente` (género y fecha de nacimiento)
   * para pre-poblar el formulario de edición. Si el usuario no es CLIENTE el endpoint
   * devuelve 404 → devolvemos `null` para que el componente muestre el form vacío.
   */
  getClienteExtraInfo(email: string): Observable<ClienteExtraInfo | null> {
    return this.http
      .get<ClienteExtraInfo>(`${this.clientesUrl}/${encodeURIComponent(email)}`)
      .pipe(
        map((c) => ({
          genero: c?.genero,
          fechaNacimiento: c?.fechaNacimiento,
        })),
        catchError(() => of(null)),
      );
  }

  /**
   * MOCK (Regla de Oro 1): el back no valida unicidad de DNI al editar.
   * Se compara contra la lista que ya tiene cargada el componente.
   */
  dniEstaTomadoPorOtro(dni: string, emailEditado: string, lista: UsuarioListado[]): boolean {
    const target = dni.trim();
    if (!target) return false;
    return lista.some((u) => u.dni === target && u.email !== emailEditado);
  }

  /**
   * MOCK (Regla de Oro 1): distribución determinística según hash del email.
   * Permite probar visualmente el filtro "Tipo de inscripción" de la HU.
   */
  tipoInscripcionMock(email: string): 'ABONADO' | 'NO_ABONADO' {
    const hash = email.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return hash % 2 === 0 ? 'ABONADO' : 'NO_ABONADO';
  }

  private aplicarFiltroTipoInscripcionMock(
    lista: UsuarioListado[],
    tipo?: TipoInscripcionFiltro,
  ): UsuarioListado[] {
    if (!tipo) return lista;
    return lista.filter((u) => this.tipoInscripcionMock(u.email) === tipo);
  }
}
